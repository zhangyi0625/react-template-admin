import useParentSize from '@/hooks/useParentSize';
import { CabinResultParams } from '@/services/cabinManage/cabinManageModel';
import { filterKeys } from '@/utils/tool';
import {
  TableProps,
  Space,
  Button,
  TablePaginationConfig,
  ConfigProvider,
  Card,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { useState } from 'react';
import { BrashBoxAccountSearchColumns } from '../config';
import { getAffilateAccountList } from '@/services/todayPlan/todayPlanApi';
import BrashBoxAccountModal from './BrashBoxAccountModal';
import { getBrashBoxAccountPage } from '@/services/brashBoxManage/brashBoxList/brashBoxListApi';

const BrashBoxAccount: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] = useState<any>({
    page: 1,
    limit: 10,
  });

  const [params, setParams] = useState<any>({
    visible: false,
    currentRow: null,
  });

  const tableColumns: TableProps['columns'] = [
    {
      title: '船公司',
      key: 'carrier',
      dataIndex: 'carrier',
      align: 'center',
      width: 80,
    },
    {
      title: '货代',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      width: 80,
    },
    {
      title: '用户名',
      key: 'account',
      dataIndex: 'account',
      align: 'center',
      width: 80,
    },
    {
      title: '密码',
      key: 'password',
      dataIndex: 'password',
      align: 'center',
      width: 80,
    },
    {
      title: '维护时间',
      align: 'center',
      width: 80,
      render(value) {
        return <div>{value.modifyTime}</div>;
      },
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      render(_) {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => setParams({ visible: true, currentRow: _ })}
            >
              编辑
            </Button>
            <Button
              type="link"
              onClick={() => setParams({ visible: true, currentRow: _ })}
              color="danger"
            >
              删除
            </Button>
          </Space>
        );
      },
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

  const onEditOk = () => {};

  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={BrashBoxAccountSearchColumns}
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
        <Space>
          <Button
            type="primary"
            onClick={() => setParams({ ...params, visible: true })}
          >
            新增
          </Button>
        </Space>
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
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={() => {}}
        />
      </Card>
      <BrashBoxAccountModal
        params={params}
        onCancel={() => setParams({ ...params, visible: false })}
        onOk={onEditOk}
      />
    </>
  );
};

export default BrashBoxAccount;
