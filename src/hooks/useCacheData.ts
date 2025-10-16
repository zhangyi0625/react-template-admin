import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { App } from 'antd';
import { RootState, setEssentail } from '@/stores/store';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { getRouteManageList } from '@/services/customerInformation/routeManage/routeManageApi';
import { getCarrierManageList } from '@/services/essential/carrierManage/carrierManageApi';
import {
  getFndPortManageList,
  getPorPortManageList,
} from '@/services/essential/portManage/portManageModel';
import { getCustomerManageList } from '@/services/essential/customerManage/customerManageApi';
import type { RouteMangeParams } from '@/services/customerInformation/routeManage/routeManageModel';
import type { CarrierManageParams } from '@/services/essential/carrierManage/carrierManageModel';

type CachePromiseFilter = {
  enabled: number;
};

type CacheMergeParams = RouteMangeParams & Partial<CarrierManageParams>;

const cachePromiseList: Record<
  string,
  (params: CacheMergeParams | any) => Promise<any>
> = {
  routeData: getRouteManageList,
  porPortData: getPorPortManageList,
  fndPortData: getFndPortManageList,
  carrierData: getCarrierManageList,
  customerData: getCustomerManageList,
  // relevanceService: ServiceSettingType[] | undefined
};

const formKeysMap: { [key: string]: string } = {
  carrier: 'carrierData',
  routeFndIds: 'routeData',
  fnds: 'fndPortData',
  customerId: 'customerData',
  porCode: 'porPortData',
  fndCode: 'fndPortData',
};

export default function useCacheData(params: {
  cacheEssentialKeys: string[];
  formMap?: CustomColumn[];
  promiseFilter?: Record<string, Partial<CachePromiseFilter>>;
}) {
  const dispatch = useDispatch();

  const essential = useSelector((state: RootState) => state.essentail);

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
            promiseFilter ? promiseFilter[key] : {}
          ) as unknown as Promise<any>
        );
    });
    promiseList.length &&
      Promise.all(promiseList)
        .then((resp) => {
          cacheEssentialKeys.map(async (_, index: number) => {
            await dispatch(
              setEssentail({
                value: resp[index],
                key: cacheEssentialKeys[index],
              })
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
