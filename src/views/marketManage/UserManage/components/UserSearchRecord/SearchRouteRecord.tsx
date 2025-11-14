import React, { useEffect, useImperativeHandle, useState } from 'react';
import { TableProps } from 'antd';
import { SearchTable } from 'customer-search-form-table';
import { getSearchRoutePage } from '@/services/orderManage/regularBooking/regularBookingApi';
import { formatTime } from '@/utils/format';
import type { SearchRoutePageType } from '@/services/orderManage/regularBooking/regularBookingModel';

export type SearchRouteRecordProps = {
  customerId: string;
};

export type SearchRouteRecordRef = {
  onRefresh: () => void;
};

const SearchRouteRecord = React.forwardRef<
  SearchRouteRecordRef,
  SearchRouteRecordProps
>(({ customerId }, ref) => {
  const [searchDefaultForm, setSearchDefaultForm] =
    useState<SearchRoutePageType>({
      pageIndex: 1,
      pageSize: 10,
      filter: {
        customerId: customerId,
      },
    });

  useEffect(() => {
    // init();
  }, []);

  useImperativeHandle(ref, () => ({
    onRefresh: () => init(),
  }));

  const init = () => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      filter: {
        customerId: customerId,
      },
    });
  };

  const columns: TableProps['columns'] = [
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
      title: '航线归属范围',
      width: 150,
      align: 'center',
      dataIndex: 'route',
    },
    {
      title: '开航起始日期',
      width: 180,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.etdStart, 'Y-M-D')}</div>;
      },
    },
    {
      title: '开航截止日期',
      width: 180,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.etdEnd, 'Y-M-D')}</div>;
      },
    },
    {
      title: '命中率',
      align: 'center',
      dataIndex: 'found',
    },
    {
      title: '查询时间',
      width: 120,
      align: 'center',
      dataIndex: 'created',
    },
  ];

  return (
    <>
      <SearchTable
        size="small"
        columns={columns}
        style={{ marginTop: '10px' }}
        pageIndexKey="pageIndex"
        pageSizeKey="pageSize"
        rowKey="id"
        totalKey="total"
        fetchResultKey="entries"
        isPagination={false}
        fetchData={getSearchRoutePage}
        searchFilter={searchDefaultForm}
        isSelection={false}
        onUpdatePagination={() => {}}
      />
    </>
  );
});

export default SearchRouteRecord;
