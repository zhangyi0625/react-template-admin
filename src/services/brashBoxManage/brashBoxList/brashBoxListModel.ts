import { LocationItem } from '@/services/cabinManage/cabinManageModel';
import type { DefaultPaging } from '@/types/global';

export interface BrashBoxListSearchParams extends DefaultPaging {
  createTimeStart?: string;
  createTimeEnd?: string;
  billNo?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface BrashBoxListType {
  details: BrashBoxListDetailType[];
  task: BrashBoxListTaskType;
}

export interface BrashBoxListDetailType {
  barcodes: string;
  billNo: string;
  carrier: string;
  ctnNumber: number;
  ctnType: string;
  execTime: string;
  id: string;
  isSuccess: boolean;
  successCount: number;
  transit: string | null;
  vesselName: string | null;
  voyNo: string | null;
}

export interface BrashBoxListTaskType
  extends Omit<BrashBoxListDetailType, 'barcodes'> {
  por: LocationItem;
  fnd: LocationItem;
}
