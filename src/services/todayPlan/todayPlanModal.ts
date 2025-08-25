export interface ScheduleAccountType {
  carrier: string
  routeFndId: string
  porCode: string
  fndCode: string
}

export interface ScheduleAccountParams extends Partial<ScheduleAccountType> {
  page: number
  limit: number
}

export interface AffilateAccountType {
  carrier: string
  customerId: string
  customerName?: string
  loginTime?: string
}

export interface AffilateAccountParams extends Partial<AffilateAccountType> {
  page: number
  limit: number
}

export interface BatchLoginAccount {
  carrier: string
  customerId: string
}
