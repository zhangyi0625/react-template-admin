export interface ShippingAccounType {
  id?: string | null
  type: string | 'QUERY' | 'ORDER'
  carrier: string | null
  customerId: string | null
  account: string | null
  accountHead: string
  loginPassword: string
  payPassword: string
}

export interface ShippingAccounParams
  extends Pick<ShippingAccounType, 'carrier' | 'account' | 'customerId'> {
  page: number
  limit: number
  isOrder: boolean | null
  isQuery: boolean | null
}
