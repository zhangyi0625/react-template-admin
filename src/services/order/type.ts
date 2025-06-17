import { TablePaginationConfig } from 'antd'

type OrderSearchFilter = {
  genres: string
  porCode: string
  fndCode: string
  type: string
  status: string
  affiliateId: string
}

export interface OrderSearchParams {
  pageIndex: number
  pageSize: number
  filter: Partial<OrderSearchFilter>
}
