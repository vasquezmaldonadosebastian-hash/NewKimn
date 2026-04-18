import type { GroupedReport, Indicator, IndicatorCategory } from "../../../shared/types/indicators";
import type { IndicatorRepository } from "../repositories/IndicatorRepository";

export class IndicatorService {
  constructor(private readonly repository: IndicatorRepository) {}

  getIndicators(): Indicator[] {
    return this.repository.getIndicators();
  }

  getIndicator(id: string): Indicator | undefined {
    return this.repository.getIndicator(id);
  }

  getCategories(): IndicatorCategory[] {
    return this.repository.getCategories();
  }

  getIndicatorsByCategory(categoryId: string): Indicator[] {
    return this.repository.getIndicatorsByCategory(categoryId);
  }

  getGroupedReports(): GroupedReport[] {
    return this.repository.getGroupedReports();
  }
}
