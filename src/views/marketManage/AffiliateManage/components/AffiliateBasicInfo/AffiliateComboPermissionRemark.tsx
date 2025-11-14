import React, { useImperativeHandle, useState } from 'react';
import { type TableProps } from 'antd';
import DragModal from '@/components/modal/DragModal';
import {
  getEquityRightsBase,
  getEquityRightsExtra,
} from '@/services/otherSetting/queryRightsSettings/queryRightsSettingsModel';
import { SearchTable } from 'customer-search-form-table';
import { ComboPermission } from '@/enums/setting';

export type AffiliateComboPermissionRemarkProps = {
  visible: boolean;
  source: 'affiliate' | 'staff';
  onCancel: () => void;
};

export type AffiliateComboPermissionRemarkRef = {
  onLoadReamrk: () => void;
};

export const AffiliateComboPermissionRemark = React.forwardRef<
  AffiliateComboPermissionRemarkRef,
  AffiliateComboPermissionRemarkProps
>(({ visible, source, onCancel }, ref) => {
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  const filterExtraKeys = [
    'RATE_SUBSCRIBE',
    'TRUCK_TRAJECTORY',
    'US_CLEARANCE',
  ];

  const filterBaseKeys = [
    'NA_TRUCK_RATE',
    'US_HTS_CODE',
    'CARRIER_ZONE',
    'PORT_WIKI',
    'HSCODE_QUERY',
  ];

  useImperativeHandle(ref, () => ({
    onLoadReamrk: () => setTableLoading(false),
  }));

  const baseEquityColumns: TableProps['columns'] = [
    {
      title: '功能',
      width: 100,
      align: 'center',
      render(value: { module: keyof typeof ComboPermission }) {
        return <div>{ComboPermission[value.module]}</div>;
      },
    },
    {
      title: '普通用户',
      width: 100,
      align: 'center',
      hidden: source === 'affiliate',
      render(value) {
        return <div>{getBaseValue(value.L0Limit, value.module)}</div>;
      },
    },
    {
      title: '新用户',
      width: 100,
      align: 'center',
      hidden: source === 'affiliate',
      render(value) {
        return <div>{getBaseValue(value.L1Limit, value.module)}</div>;
      },
    },
    {
      title: '周卡',
      width: 100,
      align: 'center',
      hidden: source === 'affiliate',
      render(value) {
        return <div>{getBaseValue(value.L5Limit, value.module)}</div>;
      },
    },
    {
      title: '年卡',
      width: 100,
      align: 'center',
      hidden: source === 'affiliate',
      render(value) {
        return <div>{getBaseValue(value.L7Limit, value.module)}</div>;
      },
    },
    {
      title: '查询会员',
      width: 100,
      align: 'center',
      hidden: source === 'staff',
      render(value) {
        return <div>{getBaseValue(value.L11Limit, value.module)}</div>;
      },
    },
    {
      title: '认证买家',
      width: 100,
      align: 'center',
      hidden: source === 'staff',
      render(value) {
        return <div>{getBaseValue(value.L12Limit, value.module)}</div>;
      },
    },
    {
      title: '认证卖家',
      width: 100,
      hidden: source === 'staff',
      align: 'center',
      render(value) {
        return <div>{getBaseValue(value.L13Limit, value.module)}</div>;
      },
    },
  ];

  const extraEquityColumns: TableProps['columns'] = [
    {
      title: '功能',
      width: 100,
      align: 'center',
      render(value: { module: keyof typeof ComboPermission }) {
        return <div>{ComboPermission[value.module]}</div>;
      },
    },
    {
      title: '普通用户',
      width: 100,
      align: 'center',
      hidden: source === 'affiliate',
      render(value) {
        return (
          <div>
            {value.module === 'RATE_SUBSCRIBE'
              ? '禁用'
              : getExtraValue(value.L0Price, value.module)}
          </div>
        );
      },
    },
    {
      title: '新用户',
      width: 100,
      align: 'center',
      hidden: source === 'affiliate',
      render(value) {
        return (
          <div>
            {value.module === 'RATE_SUBSCRIBE'
              ? '禁用'
              : getExtraValue(value.L1Price, value.module)}
          </div>
        );
      },
    },
    {
      title: '周卡',
      width: 100,
      align: 'center',
      hidden: source === 'affiliate',
      render(value) {
        return <div>{getExtraValue(value.L5Price, value.module)}</div>;
      },
    },
    {
      title: '年卡',
      width: 100,
      align: 'center',
      hidden: source === 'affiliate',
      render(value) {
        return <div>{getExtraValue(value.L7Price, value.module)}</div>;
      },
    },
    {
      title: '查询会员',
      width: 100,
      align: 'center',
      hidden: source === 'staff',
      render(value) {
        return <div>{getExtraValue(value.L11Price, value.module)}</div>;
      },
    },
    {
      title: '认证买家',
      width: 100,
      align: 'center',
      hidden: source === 'staff',
      render(value) {
        return <div>{getExtraValue(value.L12Price, value.module)}</div>;
      },
    },
    {
      title: '认证卖家',
      width: 100,
      align: 'center',
      hidden: source === 'staff',
      render(value) {
        return <div>{getExtraValue(value.L13Price, value.module)}</div>;
      },
    },
  ];

  const getBaseValue = (
    limit: string,
    module: keyof typeof ComboPermission
  ) => {
    return limit ? (
      <div>
        {limit}
        {module === 'RATE_SUBSCRIBE' ? '条' : ' / 天'}
      </div>
    ) : filterBaseKeys.includes(module) ? (
      '未限制'
    ) : (
      0 + (module === 'RATE_SUBSCRIBE' ? ' 条' : ' / 天')
    );
  };

  const getExtraValue = (
    level: string,
    module: keyof typeof ComboPermission
  ) => {
    return '¥' + level + (filterExtraKeys.includes(module) ? ' / 条' : ' / 次');
  };

  return (
    <>
      <DragModal
        open={visible}
        onCancel={onCancel}
        title="套餐内权限及额外购买费用"
        width={{ xl: 900, xxl: 1000 }}
        footer={null}
      >
        <p>企业会员套餐内权限</p>
        <SearchTable
          size="small"
          columns={baseEquityColumns}
          style={{ marginTop: '10px' }}
          immediate={tableLoading}
          scroll={{ x: 'max-content', y: 150 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="data"
          isPagination={false}
          fetchData={getEquityRightsBase}
          searchFilter={{}}
          isSelection={false}
          selectionParentType="checkbox"
          onUpdatePagination={() => {}}
        />
        <p className="mt-[40px]">额外单次购买费用</p>
        <SearchTable
          size="small"
          columns={extraEquityColumns}
          style={{ marginTop: '10px' }}
          immediate={tableLoading}
          scroll={{ x: 'max-content', y: 150 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="data"
          isPagination={false}
          fetchData={getEquityRightsExtra}
          searchFilter={{}}
          isSelection={false}
          selectionParentType="checkbox"
          onUpdatePagination={() => {}}
        />
      </DragModal>
    </>
  );
});
