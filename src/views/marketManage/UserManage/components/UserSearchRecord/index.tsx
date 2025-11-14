import React, { useEffect, useRef, useState } from 'react';
import { Tabs, type TabsProps } from 'antd';
import OrderTabsItem, {
  OrderTabsItemRef,
} from '../../../AffiliateManage/components/AffiliateSearchRecord/OrderTabsItem';
import SearchRouteRecord, { SearchRouteRecordRef } from './SearchRouteRecord';
import RecordTabsItem, {
  RecordTabsItemRef,
} from '../../../AffiliateManage/components/AffiliateSearchRecord/RecordTabsItem';

export type UserSearchRecordProps = {
  customerId: string;
};

const UserSearchRecord: React.FC<UserSearchRecordProps> = ({ customerId }) => {
  const [selectedkey, setSelectedKey] = useState<string>('order');

  const RecordTabsItemRef = useRef<RecordTabsItemRef>(null);

  const SearchRouteRecordRef = useRef<SearchRouteRecordRef>(null);

  const OrderTabsItemRef = useRef<OrderTabsItemRef>(null);

  useEffect(() => {
    // customerId && OrderTabsItemRef.current?.onRefresh();
  }, [customerId]);

  const tabsItems: TabsProps['items'] = [
    {
      key: 'order',
      label: '订单列表',
      children: (
        <OrderTabsItem
          type="staff"
          customerId={customerId}
          affiliateId={null}
          ref={OrderTabsItemRef}
        />
      ),
    },
    {
      key: 'route',
      label: '查询航线列表',
      children: (
        <SearchRouteRecord customerId={customerId} ref={SearchRouteRecordRef} />
      ),
    },
    {
      key: 'record',
      label: '套餐外权限变更记录',
      children: (
        <RecordTabsItem
          type="staff"
          customerId={customerId}
          affiliateId={null}
          ref={RecordTabsItemRef}
        />
      ),
    },
  ];

  const changeTab = (key: string) => {
    setSelectedKey(key);
    key === 'order' && OrderTabsItemRef.current?.onRefresh();
    key === 'route' && SearchRouteRecordRef.current?.onRefresh();
    key === 'record' && RecordTabsItemRef.current?.onRefresh();
  };
  return (
    <>
      <div className="px-[20px] py-[12px] bg-white rounded-[6px] w-full mt-[16px]">
        <Tabs
          activeKey={selectedkey}
          items={tabsItems}
          tabBarStyle={{ marginBottom: '20px' }}
          onChange={changeTab}
        />
      </div>
    </>
  );
};

export default UserSearchRecord;
