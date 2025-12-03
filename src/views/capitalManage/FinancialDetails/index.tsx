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
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { FinancialDetailsSearchColumns } from './config';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import useParentSize from '@/hooks/useParentSize';
import type {
  FinancialDetailsSearchFilterParams,
  FinancialDetailsSearchParams,
  FinancialDetailsType,
} from '@/services/capitalManage/financialDetails/financialDetailsModel';
import {
  addFinancialDetails,
  getFinancialDetailsListByPage,
} from '@/services/capitalManage/financialDetails/financialDetailsApi';
import { getPublicData, getPublicSetting } from '@/services/system/setting';
import FinancialDetailsParticulars from './FinancialDetailsFinancialDetailsParticulars';
import { RootState, setPublicData } from '@/stores/store';
import { useDispatch, useSelector } from 'react-redux';
import { filterKeys } from '@/utils/tool';
import { ExportTableDataByXLSX } from '@/utils/export';
import { formatTime } from '@/utils/format';

const FinancialDetails: React.FC = () => {
  const { message } = App.useApp();

  const dispatch = useDispatch();

  const { parentRef, height } = useParentSize();

  const { publicData } = useSelector((state: RootState) => state.publicSetting);

  const [formMaps, setFormMaps] = useState(FinancialDetailsSearchColumns);

  const [downLoading, setDownLoading] = useState<boolean>(false);

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<FinancialDetailsSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });

  const [params, setParams] = useState<{
    visible: boolean;
    type: 'add' | 'view';
    financialDetailsId: string;
  }>({ visible: false, type: 'add', financialDetailsId: '' });

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
        return <div>{fundSource[value.fund] ?? value.fundTitile}</div>;
      },
    },
    {
      title: '创建时间',
      width: 180,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.created, 'Y/M/D h:m:s')}</div>;
      },
    },
    {
      title: '付款时间',
      width: 180,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.accomplished, 'Y/M/D h:m:s')}</div>;
      },
    },
    {
      title: '付款方式',
      dataIndex: 'paymentTitle',
      key: 'paymentTitle',
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
    info?: FinancialDetailsSearchFilterParams | unknown
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

  const onEditOk = async (customerRow: FinancialDetailsType) => {
    try {
      if (params.financialDetailsId == null) {
        await addFinancialDetails(customerRow);
      } else {
        // await putSendCustomizationFreight(customerRow);
      }
      message.success(!params.financialDetailsId ? '新增成功~' : '修改成功~');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, financialDetailsId: '', type: 'add' });
      onUpdateSearch({ searchDefaultForm });
    } catch (error) {}
  };

  const downloadData = async () => {
    setDownLoading(true);
    try {
      const resp = await getFinancialDetailsListByPage({
        pageIndex: 1,
        pageSize: 9999,
      });
      ExportTableDataByXLSX(
        resp.entries,
        columns.splice(0, columns.length - 1),
        '资金明细导出列表'
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
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              setParams({ visible: true, type: 'add', financialDetailsId: '' })
            }
          >
            新增线下转账
          </Button>
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
          fetchData={getFinancialDetailsListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <FinancialDetailsParticulars
        params={params}
        onCancel={() =>
          setParams({ visible: false, type: 'add', financialDetailsId: '' })
        }
        onOk={onEditOk}
      />
    </>
  );
};

export default FinancialDetails;
