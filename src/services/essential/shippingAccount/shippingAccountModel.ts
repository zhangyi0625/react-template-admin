export interface ShippingAccounType {
  type: string
  carrier: string | null
  customer: string
  account: string | null
  accountHeader: string
  password: string
  payPassword: string
}

export interface ShippingAccounParams
  extends Pick<ShippingAccounType, 'carrier' | 'account'> {
  page: number
  size: number
}
