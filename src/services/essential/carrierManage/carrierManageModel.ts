export interface CarrierManageType {
  id?: string | null
  cnName: string
  code: string | null
  enName: string
  enabled: boolean | number
  logoUrl?: string
  sort?: number
}

export interface CarrierManageParams extends Pick<CarrierManageType, 'code'> {
  page: number
  limit: number
}
