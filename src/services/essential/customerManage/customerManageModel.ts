export interface CustomerManageType {
  id?: string | null
  customerName: string
  customer: string
  code: string
}

export interface CustomerManageParams {
  keyWord: string | null
  page: number
  size: number
}
