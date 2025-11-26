import { useState } from 'react';
import {
  Card,
  ConfigProvider,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { ComprehensiveStatisticsSearchColumns } from '../config';
import useParentSize from '@/hooks/useParentSize';
import { getComprehensiveStatisticsListByPage } from '@/services/dataBoard/comprehensiveStatistics/comprehensiveStatisticsApi';
import type { ComprehensiveStatisticsSearchParams } from '@/services/dataBoard/comprehensiveStatistics/comprehensiveStatisticsModel';
import { filterKeys } from '@/utils/tool';

const ComprehensiveStatistics: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<ComprehensiveStatisticsSearchParams>({
      pageIndex: 1,
      pageSize: 20,
      filter: {
        dateStart: null,
        dateEnd: null,
      },
    });

  const columns: TableProps['columns'] = [
    {
      title: '日期',
      dataIndex: 'date',
      align: 'center',
    },
    {
      title: '日活用户量',
      dataIndex: 'active',
      align: 'center',
      width: 150,
    },
    {
      title: '总用户量',
      dataIndex: 'total',
      align: 'center',
      width: 150,
    },
    {
      title: '新增用户量',
      dataIndex: 'registered',
      align: 'center',
      width: 180,
    },
    {
      title: '主页分享次数',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{value?.share?.WAHM ?? 0}</div>;
      },
    },
    {
      title: '航线查询次数',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{value?.share?.WAPL ?? 0}</div>;
      },
    },
    {
      title: '航线结果分享次数',
      align: 'center',
      width: 180,
      render(value) {
        return <div>{value?.share?.WAPD ?? 0}</div>;
      },
    },
  ];

  const onUpdateSearch = (
    info?: ComprehensiveStatisticsSearchParams | unknown
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
            columns={ComprehensiveStatisticsSearchColumns}
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
          fetchData={getComprehensiveStatisticsListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  );
};

export default ComprehensiveStatistics;
