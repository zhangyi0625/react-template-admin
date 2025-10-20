import type { DefaultPaging } from '@/types/global'

export interface ShippingAccounType {
  id?: string | null
  type: string | 'QUERY' | 'ORDER'
  carrier: string | null
  customerId: string | null
  account: string | null
  accountHead: string
  loginPassword: string
  payPassword: string
  isValid: boolean | null
}

export interface ShippingAccounParams
  extends Pick<ShippingAccounType, 'carrier' | 'account' | 'customerId'>,
    DefaultPaging {
  sort: string
  isOrder: boolean | null
  isQuery: boolean | null
}
