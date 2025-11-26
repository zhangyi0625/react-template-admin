import React, { useImperativeHandle, useState } from 'react';
import { Button, Space, type TableProps } from 'antd';
import { SearchTable } from 'customer-search-form-table';
import { getRegularBookingByPage } from '@/services/orderManage/regularBooking/regularBookingApi';
import type { RegularBookingSearchParams } from '@/services/orderManage/regularBooking/regularBookingModel';
import { store } from '@/stores/store';
import { useNavigate } from 'react-router-dom';

export type OrderTabsItemProps = {
  type: 'affiliate' | 'staff';
  customerId: string | null;
  affiliateId: string | null;
};

export type OrderTabsItemRef = {
  onRefresh: () => void;
};

const OrderTabsItem = React.forwardRef<OrderTabsItemRef, OrderTabsItemProps>(
  ({ type, customerId, affiliateId }, ref) => {
    const { publicSetting } = store.getState()?.publicSetting;

    const navigate = useNavigate();

    const [searchDefaultForm, setSearchDefaultForm] =
      useState<RegularBookingSearchParams>({
        pageIndex: 1,
        pageSize: 10,
        filter: {
          affiliateId: type === 'affiliate' ? affiliateId : null,
          customerId: type === 'staff' ? customerId : null,
        },
      });

    useImperativeHandle(ref, () => ({
      onRefresh: () => {
        setSearchDefaultForm({
          ...searchDefaultForm,
          filter: {
            affiliateId: type === 'affiliate' ? affiliateId : null,
            customerId: type === 'staff' ? customerId : null,
          },
        });
      },
    }));

    const columns: TableProps['columns'] = [
      {
        title: '订单号',
        width: 120,
        align: 'center',
        dataIndex: 'orderNo',
      },
      {
        title: '起运港',
        width: 150,
        align: 'center',
        render(value) {
          return (
            <div>
              {value.por?.localName}-{value.por?.name}
            </div>
          );
        },
      },
      {
        title: '目的港',
        width: 150,
        align: 'center',
        render(value) {
          return (
            <div>
              {value.fnd?.localName}-{value.fnd?.name}
            </div>
          );
        },
      },
      {
        title: '订单状态',
        width: 100,
        align: 'center',
        render(value) {
          return <div>{publicSetting['frtOrderStatus'][value.status]}</div>;
        },
      },
      {
        title: '操作',
        width: 120,
        fixed: 'right',
        align: 'center',
        render(_) {
          return (
            <Space>
              <Button
                color="default"
                variant="outlined"
                size="small"
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                }}
                onClick={() => navigate(`/orderManage/regularBooking/${_.id}`)}
              >
                查看
              </Button>
            </Space>
          );
        },
      },
    ];
    return (
      <>
        <div className="flex items-center justify-end mb-[20px]">
          <Button
            size="small"
            color="primary"
            variant="outlined"
            style={{
              fontSize: '12px',
              fontWeight: 500,
            }}
            onClick={() =>
              navigate(
                `/orderManage/regularBooking?affiliateId=${affiliateId}&type=affiliate`
              )
            }
          >
            查看更多订单 {'>'}
          </Button>
        </div>
        <SearchTable
          size="small"
          columns={columns}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={false}
          fetchData={getRegularBookingByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={() => {}}
        />
      </>
    );
  }
);

export default OrderTabsItem;
