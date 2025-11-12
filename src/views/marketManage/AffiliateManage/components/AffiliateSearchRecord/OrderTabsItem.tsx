import React, { useImperativeHandle, useState } from 'react';
import { Button, Space, type TableProps } from 'antd';
import { SearchTable } from 'customer-search-form-table';
import { getOrderOptions } from '@/services/orderManage/regularBooking/regularBookingApi';
import { OrderSearchParams } from '@/services/orderManage/regularBooking/regularBookingModel';
import { store } from '@/stores/store';
import { useNavigate } from 'react-router-dom';

export type OrderTabsItemProps = {
  affiliateId: string;
};

export type OrderTabsItemRef = {
  onRefresh: () => void;
};

const OrderTabsItem = React.forwardRef<OrderTabsItemRef, OrderTabsItemProps>(
  ({ affiliateId }, ref) => {
    const { publicSetting } = store.getState()?.publicSetting;

    const navigate = useNavigate();

    const [searchDefaultForm, setSearchDefaultForm] =
      useState<OrderSearchParams>({
        pageIndex: 1,
        pageSize: 10,
        filter: {
          affiliateId: affiliateId,
        },
      });

    useImperativeHandle(ref, () => ({
      onRefresh: () => {
        setSearchDefaultForm({
          ...searchDefaultForm,
          filter: {
            affiliateId: affiliateId,
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
          fetchData={getOrderOptions}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={() => {}}
        />
      </>
    );
  }
);

export default OrderTabsItem;
