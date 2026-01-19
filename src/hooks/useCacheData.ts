import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { App } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { RootState, setEssential } from '@/stores/store';
import {
  getSystemAreaOptions,
  getSystemCountryOptions,
  getSystemOrderCarrier,
  getSystemPort,
} from '@/services/system/basicData/basicDataApi';
import { getOurCompanyPortListByPage } from '@/services/portManage/ourCompanyPort/ourCompanyPortApi';
import type { OurCompanyPortSearchParams } from '@/services/portManage/ourCompanyPort/ourCompanyPortModel';
import { isArray } from 'lodash-es';

type CachePromiseFilter =
  | { parentId: number }
  | {
      keyword?: string;
      tag?: string;
    }
  | OurCompanyPortSearchParams;

type CacheMergeParams = Partial<CachePromiseFilter>;

const cachePromiseList: Record<
  string,
  (params: CacheMergeParams | any) => Promise<any>
> = {
  routeData: getSystemAreaOptions,
  carrierData: getSystemOrderCarrier,
  portData: getSystemPort,
  countryData: getSystemCountryOptions,
  ourCompanyPort: getOurCompanyPortListByPage,
};

// 配置formMap 中 options 回显key值
const formKeysMap: { [key: string]: string } = {
  router: 'routeData',
  carrier: 'carrierData',
  carrierCode: 'carrierData',
  portCode: 'portData',
  countryCode: 'countryData',
  ourCompanyPort: 'ourCompanyPort',
};

/**
 * useCacheData 缓存系统公共数据 -- basicDataApi
 * @param params
 * @returns
 */
export default function useCacheData(params: {
  cacheEssentialKeys: string[];
  formMap?: CustomColumn[];
  promiseFilter?: Record<string, Partial<CachePromiseFilter>>;
}) {
  const dispatch = useDispatch();

  const essential = useSelector((state: RootState) => state.essential);

  const { cacheEssentialKeys, promiseFilter, formMap = [] } = params;

  const [loading, setLoading] = useState(false);

  const { message } = App.useApp();

  useEffect(() => {
    if (cacheEssentialKeys.find((key) => !essential[key]?.length)) {
      loadSearchList();
    } else {
      getReduxData();
    }
  }, [essential]);

  // 重新更新查询部分数据 并存储进redux
  const loadSearchList = () => {
    setLoading(true);
    const promiseList: Promise<any>[] = [];
    cacheEssentialKeys.map((key) => {
      if (cachePromiseList[key])
        promiseList.push(
          cachePromiseList[key](
            promiseFilter ? promiseFilter[key] : {},
          ) as unknown as Promise<any>,
        );
    });
    promiseList.length &&
      Promise.all(promiseList)
        .then((resp) => {
          cacheEssentialKeys.map(async (_, index: number) => {
            await dispatch(
              setEssential({
                value: isArray(resp[index])
                  ? resp[index]
                  : resp[index]?.entries,
                key: cacheEssentialKeys[index],
              }),
            );
          });
        })
        .catch(() => {
          message.error('缓存数据查询异常，请检查useCacheData Hooks');
        });
    // getReduxData();
  };

  const getReduxData = () => {
    formMap.map((item) => {
      if (
        item.formType === 'normalSelect' &&
        item.options &&
        formKeysMap[item.name]
      ) {
        item.options = essential[formKeysMap[item.name]];
      }
    });
    setLoading(false);
  };

  return { essential: essential, loading: loading, formMaps: [...formMap] };
}
