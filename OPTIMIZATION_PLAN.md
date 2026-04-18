# Plan de optimización — Repositorio `NewKimn`

Fecha de elaboración: **2026-04-17**.

---

## Paso 1 — Reconocimiento (lectura del código real)

### 1) Archivos revisados

Se revisaron exactamente los archivos solicitados:

- `package.json` (raíz). No existen `client/package.json` ni `server/package.json`.
- `server/src/app.ts`
- `server/src/services/indicatorService.ts`
- `server/src/api/v1/indicators/indicators.routes.ts`
- `client/src/App.tsx`
- `client/src/contexts/IndicatorsContext.tsx`
- `client/src/features/indicadores/components/IndicadorDetail.tsx`
- `shared/types/indicators.ts`
- `data/indicadores.json` (solo estructura y tamaño)
- `patches/wouter@3.7.1.patch`

### 2) Hallazgo real por archivo (resumen técnico)

#### `package.json` (raíz)

- Monorepo lógico en carpetas, pero **single package manifest** en la raíz.
- `vitest` ya está instalado en `devDependencies`, pero no hay scripts de test.
- Hay `prettier` y script `format`, pero no hay `eslint` configurado.
- Dependencias UI extensas (múltiples paquetes Radix).
- Se aplica parche a `wouter@3.7.1` vía `pnpm.patchedDependencies`.

#### `server/src/app.ts`

- Carga el JSON al arranque y normaliza con `initializeIndicators(...)`.
- Expone rutas en `/api` y un endpoint adicional `/api/reportes-agrupados`.
- Manejo de errores ad-hoc por endpoint (`res.status(500).json({ error: ... })`).
- No se observa middleware global de errores ni contrato unificado.
- No se observa `express.json()` (hoy no afecta porque no hay endpoints POST/PUT, pero es deuda técnica).

#### `server/src/services/indicatorService.ts`

- Usa **estado global en memoria** (`indicators`, `categories`, `groupedReports`).
- `mapItem`, `groupByCategory`, `resolveIframe` hacen normalización de fuentes heterogéneas.
- La capa servicio combina transformación + almacenamiento + consulta.
- Buena base para tests unitarios, pero actualmente no está testeada.

#### `server/src/api/v1/indicators/indicators.routes.ts`

- Endpoints:
  - `GET /indicadores`
  - `GET /indicadores/:id`
  - `GET /categorias`
  - `GET /categorias/:categoryId/indicadores`
- Sin validación de `id` / `categoryId`.
- Sin trazabilidad estructurada de error (solo strings genéricos).

#### `client/src/App.tsx`

- Enrutamiento con `wouter`.
- `IndicatorsProvider` global envuelve la app.
- No hay lazy loading de rutas pesadas.

#### `client/src/contexts/IndicatorsContext.tsx`

- Descarga `/api/indicadores` y `/api/categorias` en paralelo.
- Error modelado como `string | null` sin contrato con backend.
- Incluye `getIndicatorsByCategory` que filtra desde categorías cargadas en cliente.

#### `client/src/features/indicadores/components/IndicadorDetail.tsx`

- Componente de **406 líneas** (confirmado).
- Mezcla renderizado UI complejo + lógica de negocio/presentación + side-effects DOM (`querySelectorAll`, `requestFullscreen`, `navigator.share`, `navigator.clipboard`, `alert`).
- Usa `sandbox` en iframe (positivo), pero sin política CSP coordinada desde servidor.

#### `shared/types/indicators.ts`

- Contiene tipos de dominio de indicadores y también tipos genéricos no vinculados al flujo actual (`User`, `Notification`, `AppState`, etc.).
- Incluye `SearchResult` con `any[]`.

#### `data/indicadores.json`

- Tamaño: **23,973 bytes**.
- Estructura: **array top-level**.
- Cantidad de elementos: **19**.
- El primer objeto mezcla campos normalizados (`id`, `codigo`, etc.) con fuentes heterogéneas compatibles con normalización.

#### `patches/wouter@3.7.1.patch`

- Modifica internamente `Switch` para colectar paths y almacenarlos en `window.__WOUTER_ROUTES__`.
- Es un comportamiento custom no estándar y debe preservarse hasta validación explícita.

### 3) Confirmación/corrección de hallazgos previos

1. **Componentes sobredimensionados** ✅ Confirmado.
   - `IndicadorDetail.tsx` tiene 406 líneas.

2. **Ausencia de tests automatizados** ✅ Confirmado.
   - No hay archivos `*test*` ni `*spec*` y no hay script `test` en `package.json`.

3. **Type bloat en tipos compartidos** ✅ Confirmado.
   - `shared/types/indicators.ts` mezcla dominio y tipos genéricos.

4. **Manejo de errores mínimo** ✅ Confirmado.
   - Error handling por endpoint, sin middleware ni formato estándar.

5. **Persistencia sin capa de datos** ✅ Confirmado.
   - Arreglos globales en servicio.

6. **Duplicidad de lógica de consulta** ⚠️ Parcialmente confirmado.
   - Backend expone filtro por categoría (`/categorias/:categoryId/indicadores`).
   - Frontend también filtra por área/dimensión en `Indicadores.tsx` y por categoría en contexto.
   - Resultado: reglas de filtrado distribuidas entre capas.

7. **Superficie de dependencias amplia** ✅ Confirmado.
   - Dependencias UI extensas y potencialmente redundantes.

8. **Sin validación de entrada** ✅ Confirmado.
   - Params sin zod ni validadores.

9. **Parche custom de `wouter@3.7.1`** ✅ Confirmado.
   - Existe y está activo vía `patchedDependencies`.

### 4) Problemas adicionales detectados

1. **Inconsistencia de arquitectura monorepo**: se espera `client/package.json` y `server/package.json`, pero hoy hay solo manifiesto raíz (afecta scripts granulares y ownership de dependencias).
2. **Servidor acoplado a bootstrap**: `startServer()` y carga de datos están en el mismo archivo sin factory de app para test de integración limpio.
3. **Falta de seguridad HTTP base**: no se observan `helmet`, `cors` explícito, rate limiting, ni hardening de headers.
4. **Sin observabilidad**: `console.log`/`console.error` sin request-id ni formato estructurado.
5. **Fecha potencialmente frágil**: en `IndicadorDetail`, `new Date(indicador.fechaCorte)` podría mostrar `Invalid Date` según calidad del origen.
6. **Uso de `alert(...)` en UX productiva**: bloqueante, no accesible, difícil de testear.
7. **No hay contrato de cliente API centralizado**: fetch directo en contexto sin wrapper reusable para headers/errores/reintentos.
8. **Tipo `GroupedReport.tipo` demasiado abierto (`string`)**: se podría cerrar a unión literal (`powerbi | tableau | placeholder`).
9. **No hay objetivo de performance explícito en API**: endpoints listan todo sin paginación ni caching semántico.

---

## Paso 2 — Plan de optimización por fases

> Restricciones respetadas: sin breaking changes en `/api/indicadores` y `/api/categorias`, sin cambio de framework, mantener parche de wouter hasta validación, preferencia por zod/pino/vitest+supertest.

---

## Fase 1 — Fundaciones (1–2 semanas, alto impacto / bajo riesgo)

### Objetivo
Establecer una base confiable para iterar rápido sin romper la API: pruebas ejecutables, validación de entrada, errores uniformes y tipado organizado.

### Alcance

1. **Setup de testing con Vitest + Supertest (mínimo humo en verde)**
2. **Contrato de error unificado + middleware Express + helper de cliente**
3. **Validación zod de parámetros en endpoints existentes**
4. **Separación de tipos en `shared/` (dominio vs genéricos)**
5. **Higiene estática: agregar ESLint y scripts estandarizados**

### Archivos afectados (propuestos)

- `package.json`
- `vitest.config.ts` (nuevo)
- `tsconfig.vitest.json` (nuevo, opcional)
- `server/src/app.ts` (refactor a app factory)
- `server/src/createApp.ts` (nuevo)
- `server/src/middleware/error.middleware.ts` (nuevo)
- `server/src/middleware/validate.middleware.ts` (nuevo)
- `server/src/errors/AppError.ts` (nuevo)
- `server/src/api/v1/indicators/indicators.routes.ts`
- `server/src/api/v1/indicators/indicators.routes.test.ts` (nuevo)
- `client/src/lib/apiClient.ts` (nuevo)
- `client/src/contexts/IndicatorsContext.tsx`
- `shared/types/indicators.ts` (ajuste)
- `shared/types/indicator-domain.ts` (nuevo)
- `shared/types/common.ts` (nuevo)
- `.eslintrc.cjs` o `eslint.config.js` (nuevo)
- `.eslintignore` (nuevo)

### Comandos

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react-hooks eslint-plugin-import eslint-config-prettier @vitest/coverage-v8 supertest @types/supertest
npm install zod pino pino-http
```

Scripts sugeridos en `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix"
  }
}
```

### Diff conceptual (por ítem)

#### 1) Testing setup

- **Antes**: `vitest` instalado sin ejecución real.
- **Después**: config base + 1 test de rutas API en verde + cobertura inicial reportable.

#### 2) Contrato de error

- **Antes**: `{ error: string }` inconsistente.
- **Después**: payload estándar `{ code, message, details? }` en backend y parse homogéneo en frontend.

#### 3) Validación zod

- **Antes**: params sin chequeo.
- **Después**: parse seguro de `id` y `categoryId`; 400 si no cumple esquema.

#### 4) Separación de tipos

- **Antes**: un archivo mezcla dominio y tipos irrelevantes.
- **Después**: dominio aislado (`indicator-domain.ts`) y tipos genéricos en módulo separado.

#### 5) Linting

- **Antes**: solo prettier.
- **Después**: eslint + prettier integrados para prevenir regresiones.

### Snippets de código (nuevos reales, no placeholders)

#### Contrato de error y middleware (backend)

```ts
// server/src/errors/AppError.ts
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}
```

```ts
// server/src/middleware/error.middleware.ts
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid request parameters",
      details: err.flatten(),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      details: err.details,
    });
  }

  return res.status(500).json({
    code: "INTERNAL_ERROR",
    message: "Unexpected error",
  });
}
```

#### Validación zod en rutas

```ts
// server/src/api/v1/indicators/indicators.routes.ts (extracto)
import { z } from "zod";
import { AppError } from "../../../errors/AppError";

const indicatorIdParamsSchema = z.object({
  id: z.string().min(1).max(64).regex(/^[\w-]+$/),
});

router.get("/indicadores/:id", (req, res, next) => {
  try {
    const { id } = indicatorIdParamsSchema.parse(req.params);
    const indicator = getIndicator(id);
    if (!indicator) {
      throw new AppError("NOT_FOUND", "Indicator not found", 404, { id });
    }
    return res.json(indicator);
  } catch (err) {
    return next(err);
  }
});
```

#### Helper cliente API

```ts
// client/src/lib/apiClient.ts
export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    let payload: ApiError | null = null;
    try {
      payload = (await res.json()) as ApiError;
    } catch {
      // ignore parse error
    }
    throw new Error(payload?.message ?? `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}
```

### Tests a escribir

- `server/src/api/v1/indicators/indicators.routes.test.ts`
  - `GET /api/indicadores` responde 200 y array.
  - `GET /api/indicadores/:id` 404 con contrato unificado si no existe.
  - `GET /api/categorias/:categoryId/indicadores` 400 si `categoryId` inválido.
- `client/src/lib/apiClient.test.ts`
  - Mapea error `{ code, message }` al `Error.message`.

Ejemplo mínimo de test (Fase 1):

```ts
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../createApp";

describe("GET /api/indicadores", () => {
  it("returns 200 and an array", async () => {
    const app = createApp();
    const res = await request(app).get("/api/indicadores");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
```

### Riesgos

- Cambios en shape de error podrían impactar UI que asuma `{ error: string }`.
- Refactor de `app.ts` para testeo podría alterar arranque si no se separa correctamente bootstrap.

**Mitigación**

- Mantener compatibilidad transitoria: incluir `message` y opcionalmente `error` en ventana de migración.
- Agregar test de smoke de arranque y test de endpoints actuales.

### Criterio de aceptación

- `npm run test` ejecuta y pasa en CI/local.
- Todos los endpoints actuales validan params con zod cuando corresponde.
- Todo error HTTP en API responde `{ code, message, details? }`.
- ESLint corre sin errores críticos.
- Coverage global inicial **≥20%**.

### Rollback

- Revertir commit de middleware/validación y mantener endpoints actuales.
- Mantener pruebas añadidas (si son neutrales) para no perder baseline.
- Feature-flag opcional de error contract (`USE_ERROR_CONTRACT_V1=true`) para retorno gradual.

---

## Fase 2 — Refactor estructural (2–4 semanas, impacto alto / riesgo medio)

### Objetivo
Reducir complejidad cognitiva y acoplamiento para acelerar cambios funcionales sin degradar estabilidad.

### Alcance

1. Descomponer `IndicadorDetail.tsx` en subcomponentes testeables.
2. Introducir `IndicatorRepository` con inyección en servicio.
3. Consolidar reglas de negocio de consulta en backend (frontend solo estado de UI).
4. Cubrir funciones de normalización (`mapItem`, `groupByCategory`, `resolveIframe`) con tests unitarios.
5. Incorporar tests de integración de rutas con `supertest`.

### Archivos afectados (propuestos)

- `client/src/features/indicadores/components/IndicadorDetail.tsx`
- `client/src/features/indicadores/components/detail/Hero.tsx` (nuevo)
- `client/src/features/indicadores/components/detail/DashboardCard.tsx` (nuevo)
- `client/src/features/indicadores/components/detail/TechnicalSheet.tsx` (nuevo)
- `client/src/features/indicadores/components/detail/FormulaBlock.tsx` (nuevo)
- `client/src/features/indicadores/components/detail/*.test.tsx` (nuevos)
- `server/src/repositories/IndicatorRepository.ts` (nuevo)
- `server/src/repositories/InMemoryIndicatorRepository.ts` (nuevo)
- `server/src/services/indicatorService.ts` (refactor)
- `server/src/services/indicatorService.test.ts` (nuevo)
- `server/src/services/normalizers.ts` (nuevo)
- `server/src/services/normalizers.test.ts` (nuevo)
- `server/src/api/v1/indicators/indicators.routes.test.ts`
- `client/src/contexts/IndicatorsContext.tsx` (ajuste para delegar reglas de negocio)

### Comandos

```bash
npm run test -- --runInBand
npm run test:coverage
```

Si se decide separar por workspaces en esta fase (opcional y sin breaking):

```bash
# solo si se aprueba diseño de workspaces
pnpm init -w
```

### Diff conceptual

#### 1) `IndicadorDetail` modular

- **Antes**: componente monolítico de 406 líneas.
- **Después**: shell <150 líneas que orquesta subcomponentes con props tipadas.

#### 2) Repositorio

- **Antes**: servicio manipula estado global directamente.
- **Después**: servicio depende de interfaz de repositorio; implementación actual sigue in-memory.

#### 3) Unificación de consulta

- **Antes**: reglas de filtrado repartidas (backend + frontend).
- **Después**: backend define filtros semánticos; frontend solo compone query y filtra visual local no-semántico (por ejemplo texto libre en tarjeta ya cargada).

#### 4) Testing de normalización

- **Antes**: transformación crítica sin cobertura.
- **Después**: casos de campos heterogéneos y placeholders cubiertos.

### Snippets de código

#### Interface de repositorio

```ts
// server/src/repositories/IndicatorRepository.ts
import type { Indicator, IndicatorCategory, GroupedReport, RawGroupedReport, RawIndicator } from "../../../shared/types/indicators";

export interface IndicatorRepository {
  initialize(rawIndicators: RawIndicator[], rawReports: RawGroupedReport[]): void;
  findAllIndicators(): Indicator[];
  findIndicatorById(id: string): Indicator | undefined;
  findAllCategories(): IndicatorCategory[];
  findIndicatorsByCategoryId(categoryId: string): Indicator[];
  findAllGroupedReports(): GroupedReport[];
}
```

#### Servicio con inyección

```ts
// server/src/services/indicatorService.ts (extracto conceptual)
import type { IndicatorRepository } from "../repositories/IndicatorRepository";

export class IndicatorService {
  constructor(private readonly repository: IndicatorRepository) {}

  getIndicators() {
    return this.repository.findAllIndicators();
  }

  getIndicator(id: string) {
    return this.repository.findIndicatorById(id);
  }
}
```

#### Descomposición de componente

```tsx
// client/src/features/indicadores/components/IndicadorDetail.tsx (estructura objetivo)
import type { Indicator } from "@shared/types/indicators";
import { Hero } from "./detail/Hero";
import { DashboardCard } from "./detail/DashboardCard";
import { TechnicalSheet } from "./detail/TechnicalSheet";
import { FormulaBlock } from "./detail/FormulaBlock";

export default function IndicadorDetail({ indicador }: { indicador: Indicator }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Hero indicador={indicador} />
      <DashboardCard indicador={indicador} />
      <FormulaBlock indicador={indicador} />
      <TechnicalSheet indicador={indicador} />
    </div>
  );
}
```

### Tests

- Unitarios backend:
  - `mapItem` normaliza `id` desde `id`, `nro`, `"ID"`, `"Nro indicador"`.
  - `resolveIframe` maneja placeholders (`None`, `Visible`, `falta`, `-`, vacío).
  - `groupByCategory` genera `slug` consistente.
- Integración backend:
  - `/api/indicadores/:id` not found.
  - `/api/categorias/:categoryId/indicadores` con categoría válida.
- Render frontend:
  - `Hero` muestra código y título.
  - `FormulaBlock` renderiza fallback cuando no hay variables.

Ejemplo test de normalización (Fase 2):

```ts
import { describe, expect, it } from "vitest";
import { mapItem } from "./normalizers";

describe("mapItem", () => {
  it("normaliza id desde nro cuando id no existe", () => {
    const mapped = mapItem({ nro: 12, nombre: "X", descripcion: "Y" });
    expect(mapped.id).toBe("12");
  });
});
```

### Riesgos

- Refactor de UI puede romper estilos visuales.
- Introducir repositorio puede crear sobreingeniería si no se mantiene simple.

**Mitigación**

- Snapshot/light render tests + revisión visual manual por ruta.
- Mantener implementación `InMemoryIndicatorRepository` mínima y sin async innecesario.

### Criterio de aceptación

- `IndicadorDetail` <= 150 líneas y subcomponentes con tests de render.
- Servicio no usa arreglos globales directamente; todo acceso vía repositorio.
- Cobertura global **≥50%** y cobertura de servicios **≥40%**.
- Tests de integración `supertest` para rutas críticas en verde.

### Rollback

- Revertir capa repositorio manteniendo interfaz para no perder esfuerzo.
- Restaurar `IndicadorDetail` original desde commit previo si hay regresión UX crítica.

---

## Fase 3 — Evolución (4–8 semanas, impacto estratégico)

### Objetivo
Escalar confiabilidad operacional y sostenibilidad técnica para crecimiento de datos, tráfico y gobernanza de seguridad.

### Alcance

1. Observabilidad con `pino`, `pino-http`, request-id y métricas de duración por endpoint.
2. Estrategia de coexistencia in-memory + DB (SQLite o Postgres) detrás del repositorio y feature flag.
3. Auditoría de dependencias (especialmente Radix) y evaluación formal del parche de `wouter`.
4. Performance API/cliente: paginación, compresión, ETag, lazy-loading y análisis de bundle.
5. Seguridad: CSP fuerte e iframes con whitelist de orígenes permitidos.

### Archivos afectados (propuestos)

- `server/src/observability/logger.ts` (nuevo)
- `server/src/middleware/requestId.middleware.ts` (nuevo)
- `server/src/middleware/metrics.middleware.ts` (nuevo)
- `server/src/app.ts` / `server/src/createApp.ts`
- `server/src/config/security.ts` (nuevo)
- `server/src/repositories/SqliteIndicatorRepository.ts` (nuevo, opcional)
- `server/src/repositories/PostgresIndicatorRepository.ts` (nuevo, opcional)
- `server/src/config/repositoryFactory.ts` (nuevo)
- `client/src/App.tsx` (lazy routes)
- `client/vite.config.ts` (análisis de bundle)
- `docs/DEPENDENCY_AUDIT.md` (nuevo)
- `docs/WOUTER_PATCH_EVALUATION.md` (nuevo)

### Comandos

```bash
npm install pino pino-http helmet compression
npm install -D rollup-plugin-visualizer
npm run build
npm run test:coverage
```

Comando de análisis bundle (ejemplo):

```bash
vite build --mode analyze
```

### Diff conceptual

#### 1) Observabilidad

- **Antes**: logs sueltos sin correlación.
- **Después**: cada request incluye `requestId`, duración y status en JSON estructurado.

#### 2) Repositorio con DB opcional

- **Antes**: solo memoria.
- **Después**: `REPOSITORY_MODE=inmemory|sqlite|postgres` sin romper contrato del servicio.

#### 3) Dependencias/parche

- **Antes**: parque de dependencias amplio sin inventario de uso.
- **Después**: matriz “instalado vs usado” y remoción segura de paquetes no utilizados; parche wouter validado por pruebas funcionales.

#### 4) Performance

- **Antes**: listados completos sin paginado ni caching HTTP explícito.
- **Después**: paginado optativo (`?page=1&limit=20`), ETag/304, compresión y rutas pesadas lazy.

#### 5) Seguridad

- **Antes**: `sandbox` en iframe pero sin CSP integral en servidor.
- **Después**: CSP explícita con `frame-src` de Power BI/Tableau permitidos y bloqueo por defecto.

### Snippets de código

#### Logger + request id

```ts
// server/src/observability/logger.ts
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
});
```

```ts
// server/src/middleware/requestId.middleware.ts
import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = req.header("x-request-id") ?? randomUUID();
  res.setHeader("x-request-id", requestId);
  (req as Request & { requestId?: string }).requestId = requestId;
  next();
}
```

#### Security headers y CSP

```ts
// server/src/config/security.ts
import helmet from "helmet";

export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      frameSrc: [
        "'self'",
        "https://app.powerbi.com",
        "https://public.tableau.com",
      ],
      connectSrc: ["'self'"],
    },
  },
});
```

#### Feature flag de repositorio

```ts
// server/src/config/repositoryFactory.ts
import type { IndicatorRepository } from "../repositories/IndicatorRepository";
import { InMemoryIndicatorRepository } from "../repositories/InMemoryIndicatorRepository";
import { SqliteIndicatorRepository } from "../repositories/SqliteIndicatorRepository";

export function createIndicatorRepository(): IndicatorRepository {
  const mode = process.env.REPOSITORY_MODE ?? "inmemory";
  if (mode === "sqlite") return new SqliteIndicatorRepository();
  return new InMemoryIndicatorRepository();
}
```

### Tests

- `server/src/middleware/*.test.ts`
  - agrega/propaga `x-request-id`.
  - registra duración por endpoint.
- `server/src/repositories/repository-contract.test.ts`
  - mismo comportamiento para in-memory y sqlite.
- `client/src/App.lazy-routes.test.tsx`
  - confirma carga diferida.

Ejemplo de test (Fase 3):

```ts
import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../createApp";

describe("request-id", () => {
  it("returns x-request-id header", async () => {
    const app = createApp();
    const res = await request(app).get("/api/indicadores");
    expect(res.headers["x-request-id"]).toBeDefined();
  });
});
```

### Riesgos

- CSP puede bloquear recursos legítimos si whitelist incompleta.
- DB opcional agrega costo operativo y migraciones.
- Remoción de dependencias puede romper componentes ocultos.

**Mitigación**

- Deploy progresivo con `report-only` de CSP antes de enforcing.
- Migración en paralelo con feature flag y fallback in-memory.
- Auditoría con `rg` de imports + test suite + smoke visual.

### Criterio de aceptación

- 100% de requests con `x-request-id`.
- Métrica de latencia por endpoint disponible en logs.
- CSP habilitada y sin bloqueos críticos tras periodo report-only.
- Dependencias directas reducidas y justificadas en inventario.
- Decisión documentada sobre continuidad/retiro del parche `wouter`.

### Rollback

- `REPOSITORY_MODE=inmemory` inmediato si falla backend con DB.
- Volver de CSP enforcing a report-only por variable de entorno.
- Reinstalar dependencias removidas con lockfile del release anterior.

---

## Paso 3 — Entregables por fase (tabla consolidada)

### Fase 1

| Campo | Contenido |
| --- | --- |
| **Objetivo** | Asegurar calidad mínima verificable y contratos estables entre cliente y servidor. |
| **Alcance** | Vitest operativo, middleware de errores, zod en params, tipado modular, ESLint activo. |
| **Archivos afectados** | `package.json`, `vitest.config.ts`, `server/src/middleware/*`, `server/src/errors/AppError.ts`, `server/src/api/v1/indicators/indicators.routes.ts`, `client/src/lib/apiClient.ts`, `shared/types/*`, config ESLint. |
| **Comandos** | `npm install -D ...`, `npm install zod pino pino-http`, `npm run test`, `npm run lint`. |
| **Snippets de código** | Incluidos arriba: `AppError`, `errorMiddleware`, validación zod y `apiGet<T>`. |
| **Tests** | API smoke + validación params + helper cliente. Ejemplo incluido. |
| **Riesgos** | Ruptura del parsing de errores en frontend. |
| **Criterio de aceptación** | Errores uniformes, zod en rutas con params, tests en verde, coverage ≥20%. |
| **Rollback** | Revert parcial de middleware/validación manteniendo tests base. |

### Fase 2

| Campo | Contenido |
| --- | --- |
| **Objetivo** | Reducir deuda estructural en UI y backend para mantener velocidad de entrega. |
| **Alcance** | Split de `IndicadorDetail`, repositorio inyectable, tests de normalización y de integración. |
| **Archivos afectados** | `client/src/features/indicadores/components/detail/*`, `server/src/repositories/*`, `server/src/services/*`, tests asociados. |
| **Comandos** | `npm run test -- --runInBand`, `npm run test:coverage`. |
| **Snippets de código** | Interface `IndicatorRepository`, servicio con inyección, shell de `IndicadorDetail`. |
| **Tests** | Unitarios de normalización + integración API + render de subcomponentes. |
| **Riesgos** | Regresión visual o sobre-ingeniería del repositorio. |
| **Criterio de aceptación** | `IndicadorDetail` ≤150 líneas, backend desacoplado de arreglos globales, coverage ≥50%. |
| **Rollback** | Revert por módulo (UI/repositorio) sin tocar API pública. |

### Fase 3

| Campo | Contenido |
| --- | --- |
| **Objetivo** | Elevar operación productiva (observabilidad, seguridad, performance, sostenibilidad). |
| **Alcance** | pino + request-id, DB opcional por feature flag, CSP/headers, bundle analysis, auditoría de dependencias. |
| **Archivos afectados** | `server/src/observability/*`, `server/src/middleware/*`, `server/src/config/*`, `client/src/App.tsx`, `client/vite.config.ts`, `docs/*.md`. |
| **Comandos** | `npm install pino pino-http helmet compression`, `vite build --mode analyze`. |
| **Snippets de código** | Logger, request-id middleware, CSP y repository factory. |
| **Tests** | Contrato de repositorio cruzado, request-id, lazy routes. |
| **Riesgos** | Bloqueos CSP, complejidad operativa DB, falsos positivos en cleanup de dependencias. |
| **Criterio de aceptación** | Latencia observable, seguridad activa, fallback seguro in-memory, reporte de dependencias. |
| **Rollback** | Flags para revertir DB y CSP, restauración lockfile release previo. |

---

## Paso 4 — Métricas de éxito (con baseline actual)

> Baselines inferidos desde el estado actual observado.

1. **Coverage de tests**
   - Baseline: **0%** (no hay tests ejecutables).
   - Meta Fase 1: **≥20%**.
   - Meta Fase 2: **≥50%** global; servicios **≥40%**.

2. **Tamaño máximo por componente React**
   - Baseline: `IndicadorDetail.tsx` = **406 líneas**.
   - Meta Fase 2: **≤150 líneas por componente**.

3. **Tiempo de respuesta p95 `/api/indicadores`**
   - Baseline: **no medido** (sin métricas).
   - Meta Fase 3: p95 documentado y monitoreado; objetivo inicial **<200 ms** en entorno local de referencia con dataset actual.

4. **Tamaño bundle cliente (gzip transferido)**
   - Baseline: **no instrumentado**.
   - Meta Fase 3: reducir baseline medido en **15–25%** tras lazy-loading y limpieza de dependencias.

5. **Número de dependencias directas**
   - Baseline: manifiesto raíz con alta densidad UI (incluye >25 paquetes Radix).
   - Meta Fase 3: eliminar paquetes no usados y dejar inventario justificado con reducción neta medible.

Métricas complementarias sugeridas:

- % endpoints con validación zod: baseline 0% → meta F1 100% (sobre endpoints con params/body).
- % respuestas de error con contrato unificado: baseline 0% → meta F1 100%.
- % requests con request-id: baseline 0% → meta F3 100%.

---

## Paso 5 — Orden de ejecución sugerido (checklist secuencial, 40 tareas)

> Cada tarea está pensada para ejecutarse en bloques de ≤2 horas.

1. [x] Crear rama de trabajo (ej.: `feat/phase-2-refactor`, `feat/phase-3-evolution`, `feat/phase-4-contract-tests`).
2. [x] Agregar script `test` en `package.json`.
3. [x] Agregar script `test:coverage` en `package.json`.
4. [x] Agregar script `lint` y `lint:fix`.
5. [x] Instalar dependencias de ESLint TypeScript.
6. [x] Crear `eslint.config.js` con reglas base y compatibilidad Prettier.
7. [x] Crear `vitest.config.ts` con entorno node/jsdom según carpeta.
8. [x] Refactorizar `server/src/app.ts` para extraer `createApp()` testeable.
9. [x] Crear `server/src/errors/AppError.ts`.
10. [x] Crear `server/src/middleware/error.middleware.ts`.
11. [x] Integrar middleware de error global en `createApp()`.
12. [x] Definir contrato de error en documentación técnica interna.
13. [x] Añadir `zod` al backend.
14. [x] Implementar schema `id` para `/indicadores/:id`.
15. [x] Implementar schema `categoryId` para `/categorias/:categoryId/indicadores`.
16. [x] Convertir `try/catch` de rutas a `next(err)`.
17. [x] Crear primer test `GET /api/indicadores` con `supertest`.
18. [x] Crear test `404` de `/api/indicadores/:id` con contrato de error.
19. [x] Crear helper `client/src/lib/apiClient.ts`.
20. [x] Migrar `IndicatorsContext` a `apiGet<T>()`.
21. [x] Ajustar UI de error para mostrar `message` del contrato.
22. [x] Separar `shared/types/indicator-domain.ts`.
23. [x] Mover tipos genéricos a `shared/types/common.ts`.
24. [x] Reemplazar imports rotos tras separación de tipos.
25. [x] Ejecutar `pnpm run lint` en CI (GitHub Actions) y corregir errores.
26. [x] Ejecutar `pnpm run test` en CI (GitHub Actions) y dejar verde.
27. [x] Crear carpeta `client/.../components/detail/`.
28. [x] Extraer subcomponente `Hero.tsx` desde `IndicadorDetail`.
29. [x] Extraer `DashboardCard.tsx`.
30. [x] Extraer `FormulaBlock.tsx`.
31. [x] Extraer `TechnicalSheet.tsx`.
32. [x] Reducir `IndicadorDetail.tsx` a componente orquestador.
33. [x] Crear tests de render para subcomponentes críticos.
34. [x] Crear `server/src/repositories/IndicatorRepository.ts`.
35. [x] Implementar `InMemoryIndicatorRepository.ts`.
36. [x] Refactorizar `indicatorService` para inyección de repositorio.
37. [x] Extraer normalizadores a `normalizers.ts`.
38. [x] Escribir tests unitarios de `mapItem`, `groupByCategory`, `resolveIframe`.
39. [x] Implementar `pino` + middleware request-id + timing.
40. [x] Implementar CSP/helmet + `frame-src` whitelisting y validar dashboards.

### Backlog extendido recomendado (si hay capacidad adicional)

41. [x] Introducir paginación opcional en `/api/indicadores` sin romper compatibilidad por defecto.
42. [x] Habilitar compresión HTTP y validar headers.
43. [x] Activar ETag y prueba condicional 304.
44. [x] Aplicar lazy-loading de rutas pesadas en cliente.
45. [x] Instrumentar análisis de bundle en CI.
46. [x] Auditar imports Radix y eliminar no usados.
47. [x] Documentar decisión del parche `wouter` con matriz de riesgos.
48. [x] Prototipar `SqliteIndicatorRepository` detrás de feature flag.
49. [x] Ejecutar prueba de coexistencia in-memory vs sqlite con suite de contrato.
50. [x] Definir SLO inicial (p95 y tasa de errores) y tablero operativo mínimo.

---

## Trade-offs clave (Pros / Contras)

### Error contract unificado

**Pros**

- Facilita trazabilidad y debugging.
- Homologa UX de errores entre vistas.

**Contras**

- Puede requerir ajuste temporal en consumidores actuales.

### Repositorio con inyección

**Pros**

- Permite migrar a DB sin reescribir API.
- Mejora testabilidad aislando persistencia.

**Contras**

- Agrega abstracciones y archivos adicionales.

### Descomposición de `IndicadorDetail`

**Pros**

- Baja complejidad cognitiva y riesgo de regresión.
- Subcomponentes reutilizables y testeables.

**Contras**

- Costo inicial de refactor visual y granularidad de props.

### CSP estricta

**Pros**

- Reduce superficie de ataque XSS/clickjacking.
- Formaliza orígenes permitidos de iframes.

**Contras**

- Requiere mantenimiento de whitelist y validación en cada embedding nuevo.

---

## Estrategia de commits atómicos sugerida

- `chore(test): bootstrap vitest and baseline scripts`
- `feat(api): add unified error contract and middleware`
- `feat(api): add zod validation for indicator routes`
- `refactor(shared): split indicator domain types from generic types`
- `refactor(client): introduce api client helper and normalized error handling`
- `refactor(client): split IndicadorDetail into subcomponents`
- `refactor(server): add IndicatorRepository and inject service dependency`
- `test(server): add normalizers and route integration tests`
- `feat(obs): add pino logging request-id and endpoint timings`
- `chore(deps): audit radix usage and evaluate wouter patch`

---

Este documento está listo para ser versionado como `OPTIMIZATION_PLAN.md` en la raíz del repositorio.
