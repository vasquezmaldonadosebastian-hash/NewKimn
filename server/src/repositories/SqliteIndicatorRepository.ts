import path from "path";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import type {
  GroupedReport,
  Indicator,
  IndicatorCategory,
  RawGroupedReport,
  RawIndicator,
} from "../../../shared/types/indicators";
import type { IndicatorRepository } from "./IndicatorRepository";
import { mapItem } from "../services/normalizers";

type SqliteIndicatorRepositoryOptions = {
  dbPath: string;
  seedIndicators: RawIndicator[];
  seedReports?: RawGroupedReport[];
};

export class SqliteIndicatorRepository implements IndicatorRepository {
  private readonly options: SqliteIndicatorRepositoryOptions;
  private db: DatabaseSync | null = null;
  private initialized = false;
  private initializePromise: Promise<void> | null = null;

  private indicators: Indicator[] = [];
  private categories: IndicatorCategory[] = [];
  private groupedReports: GroupedReport[] = [];

  constructor(options: SqliteIndicatorRepositoryOptions) {
    this.options = options;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initializePromise) return this.initializePromise;

    this.initializePromise = this.doInitialize().finally(() => {
      this.initializePromise = null;
    });

    return this.initializePromise;
  }

  private async doInitialize(): Promise<void> {
    const dbPath = this.options.dbPath;
    const resolvedDbPath =
      dbPath === ":memory:"
        ? dbPath
        : path.isAbsolute(dbPath)
          ? dbPath
          : path.resolve(process.cwd(), dbPath);

    if (resolvedDbPath !== ":memory:") {
      const dir = path.dirname(resolvedDbPath);
      if (dir && dir !== "." && !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(resolvedDbPath) && fs.statSync(resolvedDbPath).isDirectory()) {
        throw new Error("SQLite dbPath points to a directory");
      }
    }

    this.db = new DatabaseSync(resolvedDbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS indicators (
        id TEXT PRIMARY KEY,
        json TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS grouped_reports (
        id TEXT PRIMARY KEY,
        json TEXT NOT NULL
      );
    `);

    const countStmt = this.db.prepare("SELECT COUNT(*) as c FROM indicators");
    const row = countStmt.get() as { c: number };
    if (row.c === 0) {
      const insertIndicator = this.db.prepare("INSERT INTO indicators (id, json) VALUES (?, ?)");
      for (const raw of this.options.seedIndicators) {
        const mapped = mapItem(raw);
        insertIndicator.run(mapped.id, JSON.stringify(mapped));
      }

      const insertReport = this.db.prepare("INSERT INTO grouped_reports (id, json) VALUES (?, ?)");
      for (const report of this.options.seedReports ?? []) {
        insertReport.run(report.id, JSON.stringify(report));
      }
    }

    this.reloadFromDb();
    this.initialized = true;
  }

  private reloadFromDb() {
    if (!this.db) return;
    // Ensure deterministic ordering so API responses don't depend on SQLite internal iteration order.
    const indicatorsRows = this.db
      .prepare("SELECT json FROM indicators ORDER BY id")
      .all() as Array<{ json: string }>;
    this.indicators = indicatorsRows.map((r) => JSON.parse(r.json) as Indicator);

    this.categories = groupIndicatorsByArea(this.indicators);

    const reportsRows = this.db
      .prepare("SELECT json FROM grouped_reports ORDER BY id")
      .all() as Array<{ json: string }>;
    this.groupedReports = reportsRows.map((r) => JSON.parse(r.json) as GroupedReport);
  }

  getIndicators(): Indicator[] {
    return this.indicators;
  }

  getIndicator(id: string): Indicator | undefined {
    return this.indicators.find((ind) => ind.id === id);
  }

  getCategories(): IndicatorCategory[] {
    return this.categories;
  }

  getIndicatorsByCategory(categoryId: string): Indicator[] {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.indicadores : [];
  }

  getGroupedReports(): GroupedReport[] {
    return this.groupedReports;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-*|-*$/g, "");
}

function groupIndicatorsByArea(indicators: Indicator[]): IndicatorCategory[] {
  const categoryMap = new Map<string, IndicatorCategory>();
  for (const ind of indicators) {
    const area = ind.area;
    if (!area) continue;
    if (!categoryMap.has(area)) {
      categoryMap.set(area, {
        id: slugify(area),
        label: area,
        icono: "",
        descripcion: `Indicadores relacionados con ${area.toLowerCase()}`,
        indicadores: [],
      });
    }
    categoryMap.get(area)!.indicadores.push(ind);
  }
  return Array.from(categoryMap.values());
}
