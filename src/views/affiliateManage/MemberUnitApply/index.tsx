import { useState } from 'react';
import { Card, type TablePaginationConfig, type TableProps } from 'antd';
import { SearchTable } from 'customer-search-form-table';
import useParentSize from '@/hooks/useParentSize';
import { getMemberUnitApplyListByPage } from '@/services/affiliateManage/memberUnitApply/memberUnitApplyApi';
import type { MemberUnitApplySearchParams } from '@/services/affiliateManage/memberUnitApply/memberUnitApplyModel';

const MemberUnitApply: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<MemberUnitApplySearchParams>({
      page: 1,
      limit: 10,
    });

  const columns: TableProps['columns'] = [
    {
      title: '申请人',
      dataIndex: 'contactName',
      align: 'center',
      width: 120,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      align: 'center',
      width: 120,
    },
    {
      title: '企业名称',
      dataIndex: 'companyName',
      align: 'center',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
      align: 'center',
      width: 120,
    },
    {
      title: '申请日期',
      dataIndex: 'createTime',
      align: 'center',
      width: 120,
    },
  ];

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    });
  };
  return (
    <Card
      style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
      styles={{ body: { height: '100%' } }}
      ref={parentRef}
    >
      <SearchTable
        size="middle"
        columns={columns}
        rowKey="id"
        isPagination={true}
        fetchResultKey="list"
        totalKey="count"
        pageIndexKey="page"
        pageSizeKey="limit"
        scroll={{ x: 'max-content', y: height - 158 }}
        fetchData={getMemberUnitApplyListByPage}
        searchFilter={searchDefaultForm}
        isSelection={false}
        onUpdatePagination={onUpdatePagination}
      />
    </Card>
  );
};

export default MemberUnitApply;
