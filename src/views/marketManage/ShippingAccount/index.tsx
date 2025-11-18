import { useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import {
  ShippingAccountSearchColumns,
  ShippingAccountStatusOptions,
} from './config';
import { filterKeys } from '@/utils/tool';
import type {
  ShippingAccountAuditType,
  ShippingAccountManageParams,
} from '@/services/marketManage/shippingAccount/shippingAccountModel';
import useParentSize from '@/hooks/useParentSize';
import {
  auditShippingAccount,
  getShippingAccountManageByPage,
} from '@/services/marketManage/shippingAccount/shippingAccountApi';
import AuditShippingAccount from './AuditShippingAccount';

const ShippingAccount: React.FC = () => {
  const { message } = App.useApp();

  const { parentRef, height } = useParentSize();
  const [searchDefaultForm, setSearchDefaultForm] =
    useState<ShippingAccountManageParams>({
      pageIndex: 1,
      pageSize: 20,
    });

  const [params, setParams] = useState<{
    visible: boolean;
    editId: string | null;
  }>({
    visible: false,
    editId: null,
  });

  const columns: TableProps['columns'] = [
    {
      title: '用户姓名',
      dataIndex: 'customerName',
      width: 120,
      align: 'center',
    },
    {
      title: '客户姓名',
      dataIndex: 'customerAffiliateName',
      width: 120,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'customerPhone',
      width: 150,
      align: 'center',
    },
    {
      title: '船司',
      dataIndex: 'carrier',
      width: 100,
      align: 'center',
    },
    {
      title: '登录名',
      dataIndex: 'username',
      width: 150,
      align: 'center',
    },
    {
      title: '公司名称',
      dataIndex: 'affiliate',
      width: 180,
      align: 'center',
    },
    {
      title: '审核状态',
      width: 150,
      align: 'center',
      render(value) {
        return (
          <div>
            {
              ShippingAccountStatusOptions?.find(
                (item) => item.value === value.isCheck
              )?.label
            }
          </div>
        );
      },
    },
    {
      title: '是否有效',
      width: 100,
      align: 'center',
      render(value) {
        return <div>{value.valid ? '有效' : '无效'}</div>;
      },
    },
    {
      title: '创建时间',
      width: 220,
      dataIndex: 'created',
      align: 'center',
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space>
            <Button
              type="default"
              variant="outlined"
              onClick={() => setParams({ visible: true, editId: _.id })}
            >
              编辑
            </Button>
          </Space>
        );
      },
    },
  ];

  const onUpdateSearch = (info?: ShippingAccountManageParams | unknown) => {
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

  const onEdit = async (params: ShippingAccountAuditType) => {
    try {
      await auditShippingAccount(params);
      message.success('船司账号信息修改成功～');
      setParams({ visible: false, editId: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch {
      setParams({ visible: false, editId: null });
    }
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={ShippingAccountSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
            defaultFormItemLayout={{
              labelCol: {
                xs: { span: 17 },
                sm: { span: 7 },
              },
              wrapperCol: {
                xs: { span: 4 },
                sm: { span: 20 },
              },
            }}
            iconHidden={true}
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
          scroll={{ x: 'max-content', y: height - 128 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getShippingAccountManageByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AuditShippingAccount
        params={params}
        onCancel={() => setParams({ visible: false, editId: null })}
        onOk={onEdit}
      />
    </>
  );
};

export default ShippingAccount;
