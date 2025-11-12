import React, { useEffect, useRef, useState } from 'react';
import { Tabs, type TabsProps } from 'antd';
import OrderTabsItem, { OrderTabsItemRef } from './OrderTabsItem';
import StatisticsTabsItem, {
  StatisticsTabsItemRef,
} from './StatisticsTabsItem';
import RecordTabsItem, { RecordTabsItemRef } from './RecordTabsItem';

export type AffiliateSearchRecordProps = {
  affiliateId: string;
};

const AffiliateSearchRecord: React.FC<AffiliateSearchRecordProps> = ({
  affiliateId,
}) => {
  const [selectedkey, setSelectedKey] = useState<string>('order');

  const RecordTabsItemRef = useRef<RecordTabsItemRef>(null);

  const StatisticsTabsItemRef = useRef<StatisticsTabsItemRef>(null);

  const OrderTabsItemRef = useRef<OrderTabsItemRef>(null);

  useEffect(() => {
    // affiliateId && OrderTabsItemRef.current?.onRefresh();
  }, [affiliateId]);

  const tabsItems: TabsProps['items'] = [
    {
      key: 'order',
      label: '订单列表',
      children: (
        <OrderTabsItem affiliateId={affiliateId} ref={OrderTabsItemRef} />
      ),
    },
    {
      key: 'statistics',
      label: '查询统计',
      children: (
        <StatisticsTabsItem
          affiliateId={affiliateId}
          ref={StatisticsTabsItemRef}
        />
      ),
    },
    {
      key: 'record',
      label: '套餐外权限变更记录',
      children: (
        <RecordTabsItem affiliateId={affiliateId} ref={RecordTabsItemRef} />
      ),
    },
  ];

  const changeTab = (key: string) => {
    setSelectedKey(key);
    key === 'order' && OrderTabsItemRef.current?.onRefresh();
    key === 'statistics' && StatisticsTabsItemRef.current?.onRefresh();
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

export default AffiliateSearchRecord;
