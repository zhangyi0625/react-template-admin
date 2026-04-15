import { filterKeys } from '../tool';
import React from 'react';

/**
 * 搜索条件查询重置
 * @param searchDefaultInfo
 * @param callback
 * @param filterKeyArray
 * @param searchParams
 */
export function updateSearchFilter(
  searchDefaultInfo: any,
  callback: (value: React.SetStateAction<any>) => void,
  filterKeyArray: string[] = ['pageIndex', 'pageSize'],
  searchParams?: unknown,
) {
  const filteredObj = Object.fromEntries(
    Object.entries(searchParams ?? {}).filter(
      ([, value]) => !!value && value !== undefined,
    ),
  );
  let pageInfo = filterKeys(searchDefaultInfo, filterKeyArray, true);
  callback({
    ...pageInfo,
    filter: { ...filteredObj },
  });
}
