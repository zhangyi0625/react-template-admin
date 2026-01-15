import { Card, ConfigProvider, TablePaginationConfig, TableProps } from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import React, { useState } from 'react';
import { BillManageSearchColumns } from './config';
import useParentSize from '@/hooks/useParentSize';
import { CabinResultParams } from '@/services/cabinManage/cabinManageModel';
import { filterKeys } from '@/utils/tool';
// import { getBrashBoxAccountPage } from '@/services/brashBoxManage/brashBoxList/brashBoxListApi';

const billManage: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] = useState<any>({
    page: 1,
    limit: 10,
  });
  const tableColumns: TableProps['columns'] = [
    {
      title: '提单号',
      key: 'no',
      dataIndex: 'no',
      align: 'center',
      width: 80,
    },
    {
      title: '成功箱数',
      key: 'vesselName',
      dataIndex: 'vesselName',
      align: 'center',
      width: 80,
    },
    {
      title: '扣费金额',
      key: 'vesselName',
      dataIndex: 'vesselName',
      align: 'center',
      width: 80,
    },
    {
      title: '货代',
      key: 'vesselName',
      dataIndex: 'vesselName',
      align: 'center',
      width: 80,
    },
    {
      title: '时间',
      key: 'vesselName',
      dataIndex: 'vesselName',
      align: 'center',
      width: 80,
    },
  ];

  const onUpdateSearch = (info?: CabinResultParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    );
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true);
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    });
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={BillManageSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            iconHidden={true}
            btnSeparate={false}
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
          style={{ marginTop: '10px' }}
          size="middle"
          pageIndexKey="page"
          pageSizeKey="limit"
          totalKey={'count'}
          fetchResultKey={'list'}
          isPagination={true}
          columns={tableColumns}
          bordered
          rowKey={'id'}
          scroll={{ x: 'max-content', y: height - 298 }}
          fetchData={getBrashBoxAccountPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={() => {}}
        />
      </Card>
    </>
  );
};

export default billManage;
