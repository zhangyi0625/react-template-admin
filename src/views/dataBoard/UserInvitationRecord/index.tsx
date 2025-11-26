import { useState } from 'react';
import {
  Card,
  ConfigProvider,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { UserInvitationRecordSearchColumns } from '../config';
import type {
  UserInvitationRecordSearchFilterParams,
  UserInvitationRecordSearchParams,
} from '@/services/dataBoard/userInvitationRecord/userInvitationRecordModel';
import { getUserInvitationRecordListByPage } from '@/services/dataBoard/userInvitationRecord/userInvitationRecordApi';
import useParentSize from '@/hooks/useParentSize';
import { filterKeys } from '@/utils/tool';

const UserInvitationRecord: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<UserInvitationRecordSearchParams>({
      pageIndex: 1,
      pageSize: 20,
      filter: undefined,
    });

  const columns: TableProps['columns'] = [
    {
      title: '邀请人',
      children: [
        {
          title: '用户名',
          dataIndex: 'inviterName',
          align: 'center',
          width: 150,
        },
        {
          title: '手机号',
          dataIndex: 'inviterPhone',
          align: 'center',
          width: 150,
        },
      ],
    },
    {
      title: '被邀请人',
      children: [
        {
          title: '用户名',
          dataIndex: 'inviteeName',
          align: 'center',
          width: 150,
        },
        {
          title: '手机号',
          dataIndex: 'inviteePhone',
          align: 'center',
          width: 150,
        },
        {
          title: '注册时间',
          dataIndex: 'created',
          align: 'center',
          width: 150,
        },
      ],
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remarks',
    },
  ];

  const onUpdateSearch = (
    info?: UserInvitationRecordSearchFilterParams | unknown
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
            columns={UserInvitationRecordSearchColumns}
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
          fetchData={getUserInvitationRecordListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  );
};

export default UserInvitationRecord;
