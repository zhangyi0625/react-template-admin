import { HttpRequest } from '@/utils/request'
import type {
  SysDictionaryClassType,
  SysDictionaryParams,
  SysDictionaryType,
} from './dictionaryModel'

/**
 * 枚举角色相关的api
 */
export enum DictionaryApi {
  dictionaryList = '/api/system/dict/class/list',
  addDictionary = '/api/system/dict/class/add',
  updateDictonary = '/api/system/dict/class/update',
  deleteDictionary = '/api/system/dict/class/delete/',
  dictionaryById = '/api/system/dict/class/page/data/',
  addDictionaryById = '/api/system/dict/data/add',
  updateDictionaryById = '/api/system/dict/data/update',
  deleteDictionaryById = '/api/system/dict/class/page/data',
  batchDeleteDictionaryById = '/api/system/dict/data/batchDelte',
}

/**
 * 获取字典分类列表
 * @param params 字典参数
 * @returns 字典分类列表
 */
export const getDictionaryList = (params?: SysDictionaryClassType) => {
  return HttpRequest.get(
    {
      url: DictionaryApi.dictionaryList,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加字典分类
 * @param params 字典参数
 * @returns
 */
export const addDictionary = (params: SysDictionaryClassType) => {
  return HttpRequest.post(
    {
      url: DictionaryApi.addDictionary,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更新字典分类
 * @param params 字典参数
 * @returns
 */
export const updateDictionary = (params: SysDictionaryClassType) => {
  return HttpRequest.post(
    {
      url: DictionaryApi.updateDictonary,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除字典分类
 * @param id
 * @returns
 */
export const deleteDictionary = (id: string) => {
  return HttpRequest.delete(
    {
      url: DictionaryApi.deleteDictionary + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 查询字典项
 * @param id
 * @returns
 */
export const getDictionaryListById = (params: Partial<SysDictionaryParams>) => {
  return HttpRequest.get(
    {
      url: DictionaryApi.dictionaryById + params?.id,
      params: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 添加字典项
 * @param params 字典参数
 * @returns
 */
export const addDictionaryById = (params: SysDictionaryType) => {
  return HttpRequest.post(
    {
      url: DictionaryApi.addDictionaryById,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 更新字典项
 * @param params 字典参数
 * @returns
 */
export const updateDictionaryById = (params: SysDictionaryType) => {
  return HttpRequest.post(
    {
      url: DictionaryApi.updateDictionaryById,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 删除字典项
 * @param id
 * @returns
 */
export const deleteDictionaryById = (id: string) => {
  return HttpRequest.delete(
    {
      url: DictionaryApi.deleteDictionaryById + id,
    },
    {
      successMessageMode: 'none',
    }
  )
}

/**
 * 批量删除字典项
 * @param params 字典参数
 * @returns
 */
export const batchDeleteDictionaryById = (params: { ids: string[] }) => {
  return HttpRequest.post(
    {
      url: DictionaryApi.batchDeleteDictionaryById,
      data: params,
    },
    {
      successMessageMode: 'none',
    }
  )
}
