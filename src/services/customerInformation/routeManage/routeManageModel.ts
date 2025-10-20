import type { DefaultPaging } from '@/types/global'

export interface RouteMangeType {
  id?: string | null
  routeName: string
  fnds: string | string[]
}

export interface RouteMangeParams
  extends Partial<RouteMangeType>,
    DefaultPaging {}
