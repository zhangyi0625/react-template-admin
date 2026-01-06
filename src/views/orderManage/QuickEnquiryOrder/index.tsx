import { useState } from 'react';
import {
  Button,
  Card,
  ConfigProvider,
  Space,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { getQuickEnquiryOrderByPage } from '@/services/orderManage/quickEnquiryOrder/quickEnquiryOrderApi';
import {
  QuickEnquiryOrderSearchColumns,
  QuickEnquiryOrderStatusOptions,
} from './config';
import useParentSize from '@/hooks/useParentSize';
import type {
  QuickEnquiryOrderSearchFilterParams,
  QuickEnquiryOrderSearchParams,
} from '@/services/orderManage/quickEnquiryOrder/quickEnquiryOrderModel';
import { filterKeys } from '@/utils/tool';
import { useNavigate } from 'react-router-dom';

const QuickEnquiryOrder: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const navigate = useNavigate();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<QuickEnquiryOrderSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });

  const columns: TableProps['columns'] = [
    {
      title: '找舱编号',
      dataIndex: 'no',
      width: 120,
      align: 'center',
    },
    {
      title: '客户名称',
      dataIndex: 'affiliateName',
      width: 120,
      align: 'center',
    },
    {
      title: '用户名称',
      dataIndex: 'customerName',
      width: 120,
      align: 'center',
    },
    {
      title: '起运港名称',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div>
            <p>{value.por?.localName ?? '-'}</p>
            <p>{value.por?.name ?? '-'}</p>
          </div>
        );
      },
    },
    {
      title: '目的港名称',
      align: 'center',
      width: 200,
      render(value) {
        return (
          <div>
            <p>{value.fnd?.localName ?? '-'}</p>
            <p>{value.fnd?.name ?? '-'}</p>
          </div>
        );
      },
    },
    {
      title: '状态',
      width: 120,
      align: 'center',
      render(value) {
        return (
          <div>
            {
              (QuickEnquiryOrderStatusOptions || []).find(
                (item) => item.value === value.status
              )?.label
            }
          </div>
        );
      },
    },
    {
      title: '箱型数量',
      width: 150,
      align: 'center',
      render(value) {
        return Object.keys(value.containers).map((key) => (
          <p key={key}>{`${key} * ${value.containers[key]}`}</p>
        ));
      },
    },
    {
      title: '运输方式',
      width: 150,
      align: 'center',
      render(_) {
        return <div>海运</div>;
      },
    },
    {
      title: '预计货好时间',
      dataIndex: 'delivery',
      width: 150,
      align: 'center',
    },
    {
      title: '预计货好时间',
      dataIndex: 'delivery',
      width: 150,
      align: 'center',
    },
    {
      title: '预计开航时间',
      dataIndex: 'etd',
      width: 150,
      align: 'center',
    },
    {
      title: '找舱截止时间',
      dataIndex: 'validTo',
      width: 150,
      align: 'center',
    },
    {
      title: '订单创建时间',
      dataIndex: 'created',
      width: 150,
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 150,
      render(_) {
        return (
          <Space>
            <Button
              type="link"
              variant="solid"
              onClick={() => {
                navigate(`/orderManage/quickEnquiryOrder/${_.no}`),
                  sessionStorage.setItem(
                    'quickEnquiryOrderDetail',
                    JSON.stringify(_)
                  );
              }}
            >
              找舱详情
            </Button>
          </Space>
        );
      },
    },
  ];

  const onUpdateSearch = (
    info?: QuickEnquiryOrderSearchFilterParams | unknown
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
            columns={QuickEnquiryOrderSearchColumns}
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
          rowKey={(_) => _.no}
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getQuickEnquiryOrderByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  );
};

export default QuickEnquiryOrder;
