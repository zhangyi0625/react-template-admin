import { useEffect, useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { useDispatch, useSelector } from 'react-redux';
import useParentSize from '@/hooks/useParentSize';
import { getClientsCapitalListByPage } from '@/services/capitalManage/clientsCapital/clientsCapitalApi';
import { RootState, setPublicData } from '@/stores/store';
import type {
  ClientsCapitalSearchFilterParams,
  ClientsCapitalSearchParams,
} from '@/services/capitalManage/clientsCapital/clientsCapitalModel';
import { getPublicData, getPublicSetting } from '@/services/system/setting';
import FinancialDetailsParticulars from '../FinancialDetails/FinancialDetailsParticulars';
import { ClientsCapitalSearchColumns } from './config';
import { filterKeys } from '@/utils/tool';
import { ExportTableDataByXLSX } from '@/utils/export';
import { formatTime } from '@/utils/format';

const ClientsCapital: React.FC = () => {
  const { message } = App.useApp();

  const dispatch = useDispatch();

  const { parentRef, height } = useParentSize();

  const { publicData } = useSelector((state: RootState) => state.publicSetting);

  const [formMaps, setFormMaps] = useState(ClientsCapitalSearchColumns);

  const [downLoading, setDownLoading] = useState<boolean>(false);

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<ClientsCapitalSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });

  const [params, setParams] = useState<{
    visible: boolean;
    type: 'add' | 'view';
    viewSource: 'ClientsCapital';
    financialDetailsId: string;
  }>({
    visible: false,
    type: 'add',
    financialDetailsId: '',
    viewSource: 'ClientsCapital',
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
      title: '交易金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'center',
    },
    {
      title: '资金类型',
      width: 180,
      align: 'center',
      render(value) {
        let fundSource = publicData['fundSource'];
        return <div>{fundSource[value.fund] ?? value.fundTitle}</div>;
      },
    },
    {
      title: '付款方式',
      width: 180,
      align: 'center',
      render(value) {
        let paymentWay = publicData['paymentWay'];
        return <div>{paymentWay[value.type] ?? ''}</div>;
      },
    },
    {
      title: '交易创建时间',
      width: 180,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.created, 'Y/M/D h:m:s')}</div>;
      },
    },
    {
      title: '交易订单号',
      dataIndex: 'tradeNo',
      key: 'tradeNo',
      width: 150,
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 180,
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
                  viewSource: 'ClientsCapital',
                  financialDetailsId: _.id,
                })
              }
            >
              查看
            </Button>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    Promise.all([getPublicData(), getPublicSetting()]).then((res) => {
      dispatch(setPublicData(res));
    });
    formMaps.map((item) => {
      if (item.name === 'fund')
        item.options = Object.keys(publicData['fundSource']).map(
          (item: string) => {
            return {
              label: publicData['fundSource'][item],
              value: item,
            };
          }
        );
    });
    setFormMaps([...formMaps]);
  }, []);

  const onUpdateSearch = (
    info?: ClientsCapitalSearchFilterParams | unknown
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

  const downloadData = async () => {
    setDownLoading(true);
    try {
      const resp = await getClientsCapitalListByPage({
        ...searchDefaultForm,
        pageIndex: 1,
        pageSize: 9999,
      });
      ExportTableDataByXLSX(
        resp.entries,
        columns.splice(0, columns.length - 1),
        '客户资金管理导出列表'
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
          fetchData={getClientsCapitalListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <FinancialDetailsParticulars
        params={params}
        onCancel={() =>
          setParams({
            visible: false,
            type: 'add',
            financialDetailsId: '',
            viewSource: 'ClientsCapital',
          })
        }
        onOk={() => {}}
      />
    </>
  );
};

export default ClientsCapital;
