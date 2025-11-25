import type { DefaultPaging } from '@/types/global';

export type FastBookingOrderSearchFilter = {
  genres: string;
  porId: string;
  fndId: string;
  type: string;
  status: number;
  affiliateId: string | null;
  orderId: string | null;
  customerId: string;
};

export interface FastBookingOrderSearchParams extends DefaultPaging {
  filter?: Partial<FastBookingOrderSearchFilter> | null;
}

export interface FastBookingOrderAccountParams {
  brand: string;
  usernames: string;
  customerId: string;
}

export interface FastBookingCabinResultParams extends DefaultPaging {
  orderId: string;
}
