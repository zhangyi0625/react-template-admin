import type { DefaultPaging } from '@/types/global';

export interface ComprehensiveStatisticsSearchParams extends DefaultPaging {
  filter?: {
    dateStart: string | null;
    dateEnd: string | null;
  } | null;
}
