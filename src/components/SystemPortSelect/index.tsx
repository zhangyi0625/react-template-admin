import React, { useEffect, useImperativeHandle, useState } from 'react';
import styles from './SystemPortSelect.module.scss';
import { Select } from 'antd';
import type { PortCodeType } from './type';
import { getSystemPort } from '@/services/system/basicData/basicDataApi';
import { fetchSystemSearchData } from '@/utils/freight';
import { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';

export type SystemPortSelectPropsType = {
  type: 'POR' | 'FND';
  valueKey: 'unlocode' | 'id';
  portInfo?: PortCodeType | null;
  onSystemPortSelect: (value: string | undefined) => void;
};

export type SystemPortSelectRef = {
  init: (
    status: 'ADD' | 'EDIT' | 'VIEW',
    portInfo?: PortCodeType | null
  ) => Promise<void>;
};

const SystemPortSelect = React.forwardRef<
  SystemPortSelectRef,
  SystemPortSelectPropsType
>(({ type, valueKey, portInfo, onSystemPortSelect }, ref) => {
  const [defalueOptions, setDefaultOptions] = useState<
    Record<SystemPortSelectPropsType['type'], LocationItem[]>
  >({
    POR: [],
    FND: [],
  });

  useImperativeHandle(ref, () => ({
    init: async (status: 'ADD' | 'EDIT' | 'VIEW') => {
      status === 'ADD' && resetCache();
      // Todo 处理编辑和查看状态(暂不能通过ref回显数据)
      // for (let i in portInfo) {
      // setTimeout(() => {
      //   portInfo && handleSearch(portInfo['porCode'], 'POR');
      //   portInfo && handleSearch(portInfo['fndCode'], 'FND');
      // }, 500);
      // }
      // portInfo && handleSearch(portInfo[`${type.toLowerCase()}Code`], type);
    },
  }));

  useEffect(() => {
    if (portInfo && portInfo[`${type.toLowerCase()}Code`])
      handleSearch(portInfo[`${type.toLowerCase()}Code`] || '', type);
  }, [portInfo]);

  const resetCache = () => {
    setDefaultOptions({
      POR: [],
      FND: [],
    });
  };

  const handleSelect = (value: string | undefined) => {
    onSystemPortSelect(value);
  };

  const getPortSelect = (type: 'POR' | 'FND') => {
    return (
      <Select
        allowClear
        placeholder={`请输入${type === 'POR' ? '起运' : '目的'}港`}
        showSearch
        defaultActiveFirstOption={false}
        suffixIcon={null}
        notFoundContent={null}
        filterOption={false}
        value={portInfo?.[`${type.toLowerCase()}Code`]}
        className={styles['system-port-select']}
        onSearch={(value: string) => handleSearch(value, type)}
        onSelect={(value: string) => handleSelect(value)}
        onClear={() => handleSelect(undefined)}
        options={(defalueOptions[type] || []).map((d) => ({
          label: (
            <div className={styles['system-port-select-item']}>
              <p>
                {d.localName} - {d.name}
              </p>
              <p>
                {d.countryLocalName} - {d.countryName}
              </p>
            </div>
          ),
          value: d[valueKey],
        }))}
      />
    );
  };

  const handleSearch = (newValue: string, type: 'POR' | 'FND' | string) => {
    if (!newValue || !newValue.trim()) return;
    fetchSystemSearchData(newValue, type, setDefaultOptions, getSystemPort);
  };

  return <>{getPortSelect(type)}</>;
});

export default SystemPortSelect;
