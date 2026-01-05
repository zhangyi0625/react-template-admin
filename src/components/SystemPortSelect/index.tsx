import React, { useEffect, useImperativeHandle, useState } from 'react';
import styles from './systemPortSelect.module.scss';
import { Select } from 'antd';
import type { PortCodeType, PortInfoType } from './type';
import { getSystemPort } from '@/services/system/basicData/basicDataApi';
import type { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';
import { isArray } from 'lodash-es';
import { fetchSystemSearchData } from '@/utils/freight';

export type SystemPortSelectPropsType = {
  type: 'POR' | 'FND';
  portInfo: PortInfoType | null;
  valueKey?: 'unlocode' | 'id';
  isMultiple?: boolean;
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
>((props, ref) => {
  const {
    type,
    portInfo,
    valueKey = 'unlocode',
    isMultiple = false,
    onSystemPortSelect,
  } = props;
  const [defaultOptions, setDefaultOptions] = useState<
    Record<SystemPortSelectPropsType['type'], LocationItem[]>
  >({
    POR: [],
    FND: [],
  });

  const [portDefaultValue, setPortDefaultValue] = useState<PortCodeType>({
    porCode: undefined,
    fndCode: undefined,
  });

  const [isSearch, setIsSearch] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    init: async (status: 'ADD' | 'EDIT' | 'VIEW') => {
      status === 'ADD' && resetCache();
    },
  }));

  useEffect(() => {
    initPort();
  }, [portInfo]);

  useEffect(() => {
    if (isSearch)
      setPortDefaultValue({
        porCode: defaultOptions['POR']?.[0]?.[valueKey] as string,
        fndCode: defaultOptions['FND']?.[0]?.[valueKey] as string,
      });
  }, [defaultOptions, isSearch]);

  const initPort = async () => {
    if (portInfo && (portInfo['fndInfo'] || portInfo['fndInfo'])) {
      /**
       * 通过portInfo类型判断是否是unlocode、id、name(默认使用porInfo判断)
       * 默认五字码：unlocode 查询
       * 其他：id 查询 通常为string[] 多选情况下
       * 其他：name 查询 通常为string 表现为通过name查询
       */
      let judgeValue = portInfo['porInfo'] ?? portInfo['fndInfo'];
      let filedType = isArray(judgeValue)
        ? 'id'
        : /[A-Z]+/g.test(judgeValue as string) &&
          (judgeValue as string).length === 5
        ? 'unlocode'
        : 'name';
      if (filedType === 'unlocode') {
        handleSearch(portInfo[`${type.toLowerCase()}Info`] as string, type);
        setPortDefaultValue({
          porCode: (portInfo['porInfo'] as string) ?? undefined,
          fndCode: (portInfo['fndInfo'] as string) ?? undefined,
        });
      } else if (filedType === 'name') {
        // Todo 处理name查询 暂时无法通过普通handleSearch方式回显数据
        handleSearch(portInfo[`${type.toLowerCase()}Info`] as string, type);
        setIsSearch(true);
      } else if (filedType === 'id') {
        setPortDefaultValue({
          porCode: (portInfo['porInfo'] as string[]) ?? undefined,
          fndCode: (portInfo['fndInfo'] as string[]) ?? undefined,
        });
      }
    }
  };

  const resetCache = () => {
    setDefaultOptions({
      POR: [],
      FND: [],
    });
    setPortDefaultValue({
      porCode: undefined,
      fndCode: undefined,
    });
  };

  const handleSelect = (value: string | undefined, key: string) => {
    onSystemPortSelect(value);
    valueKey === 'unlocode' &&
      setPortDefaultValue({
        ...portDefaultValue,
        [key]: value,
      });
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
        value={portDefaultValue[`${type.toLowerCase()}Code`]}
        className={styles['system-port-select']}
        onSearch={(value: string) => handleSearch(value, type)}
        onSelect={(value: string) =>
          handleSelect(value, `${type.toLowerCase()}Code`)
        }
        loading={true}
        onClear={() => handleSelect(undefined, `${type.toLowerCase()}Code`)}
        mode={isMultiple ? 'multiple' : undefined}
        options={(defaultOptions[type] || []).map((d) => ({
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
    setIsSearch(false);
    fetchSystemSearchData(newValue, type, setDefaultOptions, getSystemPort);
  };

  return <>{getPortSelect(type)}</>;
});

export default SystemPortSelect;
