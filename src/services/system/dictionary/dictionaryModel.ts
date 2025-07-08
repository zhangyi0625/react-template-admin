export interface SysDictionaryClassType {
  dictName: string
  id?: string | null
  notes?: string
  sort: number
}

export interface SysDictionaryType extends SysDictionaryClassType {
  dictCode: string
  mainId: string
}

export interface SysDictionaryParams
  extends Pick<SysDictionaryClassType, 'dictName' | 'id'> {}
