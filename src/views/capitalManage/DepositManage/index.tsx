import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownloadOutlined } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import {
  DepositManageSearchColumns,
  DepositManageStatusOptions,
} from './config';
import useParentSize from '@/hooks/useParentSize';
import type {
  DepositManageSearchFilterParams,
  DepositManageSearchParams,
  DepositManageType,
} from '@/services/capitalManage/depositManage/depositManageModel';
import {
  getDepositManageListByPage,
  postAcceptDepositManage,
  postRejectDepositManage,
} from '@/services/capitalManage/depositManage/depositManageApi';
import DepositManageRemark from './DepositManageRemark';
import FinancialDetailsParticulars from '../FinancialDetails/FinancialDetailsParticulars';
import { RootState } from '@/stores/store';
import { filterKeys } from '@/utils/tool';
import { ExportTableDataByXLSX } from '@/utils/export';

import { formatTime } from '@/utils/format';

const DepositManage: React.FC = () => {
  const { message } = App.useApp();

  const dispatch = useDispatch();

  const { parentRef, height } = useParentSize();

  const { publicData } = useSelector((state: RootState) => state.publicSetting);

  const [formMaps, setFormMaps] = useState(DepositManageSearchColumns);

  const [downLoading, setDownLoading] = useState<boolean>(false);

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<DepositManageSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });

  const [params, setParams] = useState<{
    visible: boolean;
    type: 'add' | 'view';
    viewSource: 'DepositManage';
    financialDetailsId: string;
  }>({
    visible: false,
    type: 'add',
    financialDetailsId: '',
    viewSource: 'DepositManage',
  });

  const [depositRemark, setDepositRemark] = useState<{
    visible: boolean;
    currentRow: DepositManageType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const columns: TableProps['columns'] = [
    {
      title: '客户名',
      dataIndex: 'affiliateName',
      key: 'affiliateName',
      width: 150,
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
      width: 120,
      align: 'center',
    },
    {
      title: '提现金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'center',
    },
    {
      title: '业务归属',
      width: 180,
      align: 'center',
      render(value) {
        let fundSource = publicData['fundSource'];
        return <div>{fundSource[value.fund] ?? value.fundTitile}</div>;
      },
    },
    {
      title: '提现发起时间',
      width: 180,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.created, 'Y/M/D h:m:s')}</div>;
      },
    },
    {
      title: '提现处理时间',
      width: 180,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.handled, 'Y/M/D h:m:s')}</div>;
      },
    },
    {
      title: '提现处理状态',
      width: 150,
      align: 'center',
      render(value) {
        return (
          <div>
            {DepositManageStatusOptions?.find(
              (item) => item.value === value.status
            )?.label ?? ''}
          </div>
        );
      },
    },
    {
      title: '提现处理人',
      dataIndex: 'handledBy',
      key: 'handledBy',
      width: 150,
      align: 'center',
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
              onClick={() =>
                setParams({
                  visible: true,
                  type: 'view',
                  viewSource: 'DepositManage',
                  financialDetailsId: _.id,
                })
              }
            >
              查看
            </Button>
            <Button
              type="primary"
              variant="outlined"
              onClick={() => setDepositRemark({ visible: true, currentRow: _ })}
            >
              操作
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    console.log(publicData);
    formMaps.map((item) => {
      if (item.name === 'fund') {
        item.options = Object.keys(publicData['fundSource'])
          .map((item) => {
            if (item === 'WITHDRAW_ACCOUNT_FUND' || item === 'WITHDRAW_BOND') {
              return {
                label: publicData['fundSource'][item],
                value: item,
              };
            }
          })
          .filter((key) => !!key);
      }
    });
    setFormMaps([...formMaps]);
  }, []);

  const onUpdateSearch = (info?: DepositManageSearchFilterParams | unknown) => {
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

  const onEditOk = async (
    customerRow: DepositManageType,
    disposeStatus: string
  ) => {
    try {
      if (disposeStatus === 'accpet') {
        await postAcceptDepositManage(customerRow);
      } else {
        await postRejectDepositManage(customerRow);
      }
      message.success(
        disposeStatus === 'accpet' ? '接受已提现~' : '提现已驳回~'
      );
      // 操作成功，关闭弹窗，刷新数据
      setDepositRemark({ visible: false, currentRow: null });
      onUpdateSearch({ searchDefaultForm });
    } catch (error) {}
  };

  const downloadData = async () => {
    setDownLoading(true);
    try {
      const resp = await getDepositManageListByPage({
        ...searchDefaultForm,
        pageIndex: 1,
        pageSize: 9999,
      });
      ExportTableDataByXLSX(
        resp.entries,
        columns.splice(0, columns.length - 1),
        '提现管理导出列表'
      );
      setDownLoading(false);
    } catch {
      message.error('导出列表异常，请联系相关人员～');
      setDownLoading(false);
    }
  };

  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={formMaps}
            gutterWidth={24}
            labelPosition="left"
            defaultFormItemLayout={{
              labelCol: {
                xs: { span: 16 },
                sm: { span: 8 },
              },
              wrapperCol: {
                xs: { span: 2 },
                sm: { span: 22 },
              },
            }}
            btnSeparate={true}
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
        <Space>
          <Button
            color="blue"
            variant="outlined"
            icon={<DownloadOutlined />}
            onClick={downloadData}
            loading={downLoading}
          >
            导出列表
          </Button>
        </Space>
        <SearchTable
          size="small"
          columns={columns}
          style={{ marginTop: '10px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: height - 158 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getDepositManageListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <DepositManageRemark
        params={depositRemark}
        onCancel={() => setDepositRemark({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
      <FinancialDetailsParticulars
        params={params}
        onCancel={() =>
          setParams({
            visible: false,
            type: 'add',
            financialDetailsId: '',
            viewSource: 'DepositManage',
          })
        }
        onOk={() => {}}
      />
    </>
  );
};

export default DepositManage;
