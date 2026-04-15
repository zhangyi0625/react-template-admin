import { useState } from 'react';
import {
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd';
import { InvoiceApplySearchColumns } from './config';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { getInvoiceApplyListByPage } from '@/services/capitalManage/invoiceApply/invoiceApplyApi';
import useParentSize from '@/hooks/useParentSize';
import type {
  InvoiceApplySearchFilterParams,
  InvoiceApplySearchParams,
} from '@/services/capitalManage/invoiceApply/invoiceApplyModel';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '@/utils/format';
import { updateSearchFilter } from '@/utils/filter';

const InvoiceApply: React.FC = () => {
  const navigate = useNavigate();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<InvoiceApplySearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });
  const columns: TableProps['columns'] = [
    {
      title: '客户名',
      dataIndex: 'affiliateName',
      width: 150,
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'customerName',
      width: 150,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'customerPhone',
      width: 120,
      align: 'center',
    },
    {
      title: '开票金额',
      dataIndex: 'amount',
      width: 120,
      align: 'center',
    },
    {
      title: '开票状态',
      width: 100,
      align: 'center',
      render(value) {
        let options =
          InvoiceApplySearchColumns.find((item) => item.name === 'status')
            ?.options ?? [];
        return (
          <div>
            {options.find((item) => item.value === value.status)?.label}
          </div>
        );
      },
    },
    {
      title: '开票抬头',
      dataIndex: 'invoiceTitle',
      width: 150,
      align: 'center',
    },
    {
      title: '开票税号',
      dataIndex: 'taxId',
      width: 150,
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 150,
      align: 'center',
    },
    {
      title: '申请时间',
      width: 180,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.created, 'Y/M/D h:m:s')}</div>;
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
              type="primary"
              variant="outlined"
              onClick={() => navigate(`/capitalManage/invoiceApply/${_.id}`)}
            >
              详情
            </Button>
          </Space>
        );
      },
    },
  ];

  const onUpdateSearch = (info?: InvoiceApplySearchFilterParams | unknown) => {
    updateSearchFilter(
      searchDefaultForm,
      setSearchDefaultForm,
      ['pageIndex', 'pageSize'],
      info,
    );
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
            columns={InvoiceApplySearchColumns}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
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
          scroll={{ x: 'max-content', y: height - 108 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getInvoiceApplyListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  );
};

export default InvoiceApply;
