import type { DefaultPaging } from '@/types/global'

export interface ScheduleAccountType {
  carrier: string
  routeFndId: string
  porCode: string
  fndCode: string
}

export interface ScheduleAccountParams
  extends Partial<ScheduleAccountType>,
    DefaultPaging {}

export interface AffilateAccountType {
  carrier: string
  customerId: string
  customerName?: string
  loginTime?: string
}

export interface AffilateAccountParams
  extends Partial<AffilateAccountType>,
    DefaultPaging {}

export interface BatchLoginAccount {
  carrier: string
  customerId: string
}
