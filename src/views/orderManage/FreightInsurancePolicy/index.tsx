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
import {
  FreightInsurancePolicyOpStatusOptions,
  FreightInsurancePolicySearchColumns,
} from './config';
import type {
  FreightInsurancePolicySearchFilterParams,
  FreightInsurancePolicySearchParams,
} from '@/services/orderManage/freightInsurancePolicy/freightInsurancePolicyModel';
import { useNavigate } from 'react-router-dom';
import useParentSize from '@/hooks/useParentSize';
import { getFreightInsurancePolicyByPage } from '@/services/orderManage/freightInsurancePolicy/freightInsurancePolicyApi';
import { filterKeys } from '@/utils/tool';

const FreightInsurancePolicy: React.FC = () => {
  const { parentRef, height } = useParentSize();

  const navigate = useNavigate();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<FreightInsurancePolicySearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });

  const columns: TableProps['columns'] = [
    {
      title: '投保单号',
      dataIndex: 'applyno',
      width: 120,
      align: 'center',
    },
    {
      title: '保单号',
      dataIndex: 'policy',
      width: 120,
      align: 'center',
    },
    {
      title: '被保险人',
      dataIndex: 'insuredName',
      width: 120,
      align: 'center',
    },
    {
      title: '起运地/目的地',
      width: 150,
      align: 'center',
      render(value) {
        return (
          <div>
            <p>{value.portloading ?? '-'}</p>
            <p>{value.destination ?? '-'}</p>
          </div>
        );
      },
    },
    {
      title: '提单号/发票号',
      width: 150,
      align: 'center',
      render(value) {
        return (
          <div>
            <span>{value.billno ?? '-'}</span> / <span>{value.no ?? '-'}</span>
          </div>
        );
      },
    },
    {
      title: '提交时间',
      dataIndex: 'created',
      width: 180,
      align: 'center',
    },
    {
      title: '出单时间',
      dataIndex: 'signdate',
      width: 180,
      align: 'center',
    },
    {
      title: '出单状态',
      width: 120,
      align: 'center',
      render(value) {
        return (
          <div>
            {
              (FreightInsurancePolicyOpStatusOptions || []).find(
                (item) => item.value === value.opstatus,
              )?.label
            }
          </div>
        );
      },
    },
    {
      title: '投保人',
      dataIndex: 'customerName',
      width: 120,
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      width: 100,
      render(_) {
        return (
          <Space>
            <Button
              type="link"
              variant="solid"
              onClick={() => {
                (navigate(`/orderManage/freightInsurancePolicy/${_.id}`),
                  sessionStorage.setItem(
                    'freightInsurancePolicyDetail',
                    JSON.stringify(_),
                  ));
              }}
            >
              详情
            </Button>
          </Space>
        );
      },
    },
  ];

  const onUpdateSearch = (
    info?: FreightInsurancePolicySearchFilterParams | unknown,
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(
        ([, value]) => !!value && value !== undefined,
      ),
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['pageIndex', 'pageSize'],
      true,
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
            columns={FreightInsurancePolicySearchColumns}
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
          scroll={{ x: 'max-content', y: height - 118 }}
          rowKey={(_) => _.id}
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getFreightInsurancePolicyByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
    </>
  );
};

export default FreightInsurancePolicy;
