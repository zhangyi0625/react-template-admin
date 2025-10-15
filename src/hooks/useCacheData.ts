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

export type CachePromiseFilter = {
  enabled: number;
};

const cachePromiseList: Record<string, (params?: any) => Promise<any>> = {
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
  }, []);

  // 重新更新查询部分数据 并存储进redux
  const loadSearchList = () => {
    setLoading(true);
    cacheEssentialKeys.map(async (key: string) => {
      if (!cachePromiseList[key] || essential[key]?.length) {
        // message.error('缓存数据查询异常，请检查useCacheData Hooks')
        return;
      }
      try {
        const resp = await cachePromiseList[key](
          promiseFilter ? promiseFilter[key] : {}
        );
        dispatch(setEssentail({ value: resp, key: key }));
        getReduxData();
      } catch {
        message.error('缓存数据查询异常，请检查useCacheData Hooks');
      }
    });
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
