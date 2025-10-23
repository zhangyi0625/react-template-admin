import type { DefaultPaging } from '@/types/global'

export interface CarrierManageType {
  id?: string | null
  cnName: string
  code: string | null
  enName: string
  enabled?: boolean | number
  logoUrl?: string
  sort?: number
}

export interface CarrierManageParams
  extends Pick<CarrierManageType, 'code' | 'enabled'>,
    DefaultPaging {}
