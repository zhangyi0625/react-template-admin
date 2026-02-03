import type { DefaultPaging } from '@/types/global';

export interface AdvertisingManageSearchParams extends DefaultPaging {
  startDate?: string;
  endDate?: string;
  sort?: string;
}
export interface AdvertisingManageType {
  id: string;
  title: string;
  createTime: string;
  updateTime: string;
  startDate: string;
  endDate: string;
  link: string;
  imageId: string;
  imagePath: string;
}
