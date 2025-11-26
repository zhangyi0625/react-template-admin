import { useState } from 'react';
import {
  Card,
  ConfigProvider,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { DailyActiveUserRecordSearchColumns } from '../config';
import useParentSize from '@/hooks/useParentSize';
import { getDailyActiveUserRecordListByPage } from '@/services/dataBoard/dailyActiveUserRecord/dailyActiveUserRecordApi';
import type {
  DailyActiveUserRecordSearchFilterParams,
  DailyActiveUserRecordSearchParams,
} from '@/services/dataBoard/dailyActiveUserRecord/dailyActiveUserRecordModel';
import { filterKeys } from '@/utils/tool';

const DailyActiveUserRecord: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<DailyActiveUserRecordSearchParams>({
      pageIndex: 1,
      pageSize: 20,
      filter: undefined,
    });

  const columns: TableProps['columns'] = [
    {
      title: '用户名',
      dataIndex: 'customerName',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'customerPhone',
      align: 'center',
      width: 150,
    },
    {
      title: '日期',
      align: 'center',
      dataIndex: 'date',
    },
  ];

  const onUpdateSearch = (
    info?: DailyActiveUserRecordSearchFilterParams | unknown
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(
        ([, value]) => !!value && value !== undefined
      )
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['pageIndex', 'pageSize'],
      true
    );
    setSearchDefaultForm({
      ...pageInfo,
      filter: { ...filteredObj },
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={DailyActiveUserRecordSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
            iconHidden={false}
            isShowReset={true}
            isShowExpend={false}
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <SearchTable
          size="small"
          columns={columns}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: height - 118 }}
          rowKey={'id'}
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getDailyActiveUserRecordListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  );
};

export default DailyActiveUserRecord;
