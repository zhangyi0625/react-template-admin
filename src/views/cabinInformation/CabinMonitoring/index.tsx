import { useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  Tooltip,
  type TablePaginationConfig,
  type TableProps,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { IconTooltip } from '@/assets/icon';
import {
  CabinMonitoringCarrierType,
  CabinMonitoringSearchColumns,
} from './config';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import useParentSize from '@/hooks/useParentSize';
import CabinMonitoringExtraSetting from './CabinMonitoringExtraSetting';
import CabinMonitoringDetail from './CabinMonitoringDetail';
import CabinMonitoringCron from './CabinMonitoringCron';
import type {
  CabinMonitoringSearchParams,
  CabinMonitoringSearchFilterParams,
  CabinMonitoringDetailType,
} from '@/services/cabinInformation/cabinMonitoring/cabinMonitoringModel';
import { getCabinMonitoringListByPage } from '@/services/cabinInformation/cabinMonitoring/cabinMonitoringApi';
import { postStaffSearchStatistic } from '@/services/marketManage/staffManage/staffManageApi';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';

const CabinMonitoring: React.FC = () => {
  const { message } = App.useApp();

  const { parentRef, height } = useParentSize();

  const API = process.env.RS_CONSOLE_API;

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: CabinMonitoringDetailType | null;
  }>({ visible: false, currentRow: null });

  const [visible, setVisible] = useState<boolean>(false);

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<CabinMonitoringSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });

  const [cronParams, setCronParams] = useState<{
    visible: boolean;
    executeCron: string | null;
  }>({ visible: false, executeCron: null });

  const columns: TableProps['columns'] = [
    {
      title: '任务编号',
      dataIndex: 'taskId',
      width: 150,
      align: 'center',
    },
    {
      title: '公司名称',
      dataIndex: 'affiliateName',
      width: 150,
      align: 'center',
    },
    {
      title: '用户名称',
      dataIndex: 'customerName',
      width: 150,
      align: 'center',
    },
    {
      title: '船公司',
      dataIndex: 'carrier',
      width: 100,
      align: 'center',
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      width: 200,
      align: 'center',
    },
    {
      title: '业务类型',
      width: 150,
      align: 'center',
      render(value) {
        return (
          <div>
            {value.carrier}
            {
              CabinMonitoringCarrierType.find(
                (item) => item.value === value.carrierType,
              )?.label
            }
          </div>
        );
      },
    },
    {
      title: '状态',
      width: 150,
      align: 'center',
      render(value) {
        return <div>{value.status === 'STOP' ? '关闭' : '开启'}</div>;
      },
    },
    {
      title: 'ETD起止日期',
      width: 150,
      align: 'center',
      render(value) {
        return (
          (value.etdRange as CabinMonitoringDetailType['etdRange']) || []
        ).map((i, index: number) => (
          <div key={index}>
            {formatTime(i.startDate, 'M-D') +
              ' ~ ' +
              formatTime(i.endDate, 'M-D')}
          </div>
        ));
      },
    },
    {
      title: '箱型',
      width: 120,
      align: 'center',
      render(value) {
        return <div>{value.ctnType.join(',')}</div>;
      },
    },
    {
      title: '港口',
      width: 220,
      align: 'center',
      render(value) {
        return (
          <div className="flex items-center justify-center">
            <Tooltip
              title={(
                (value.portConfig as CabinMonitoringDetailType['portConfig']) ||
                []
              ).map((i, index: number) => (
                <div key={index}>{i.por.name + '-' + i.fnd.name}</div>
              ))}
            >
              {(
                (value.portConfig as CabinMonitoringDetailType['portConfig']) ||
                []
              )
                .slice(0, 3)
                .map((i, index: number) => (
                  <div key={index}>{i.por.name + '-' + i.fnd.name}</div>
                ))}
            </Tooltip>
            <IconTooltip width={17} height={16} />
          </div>
        );
      },
    },
    {
      title: '通知邮箱',
      width: 180,
      align: 'center',
      render(value) {
        return (
          <div className="flex items-center justify-center">
            <Tooltip
              title={value.email.map((i: string) => (
                <div key={i}>{i}</div>
              ))}
            >
              {value.email.slice(0, 3).join('/')}
            </Tooltip>
            <IconTooltip width={17} height={16} />
          </div>
        );
      },
    },
    {
      title: '设置频率(CRON表达式)',
      width: 180,
      align: 'center',
      dataIndex: 'executeCron',
    },
    {
      title: '下次执行时间',
      width: 180,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.nextExecuteDate, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: '更新日期',
      width: 180,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.modifyTime, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: '操作',
      width: 250,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space direction="vertical" size={0}>
            <Button
              type="link"
              onClick={() =>
                setCronParams({ visible: true, executeCron: _.executeCron })
              }
            >
              设置频率
            </Button>
            <Button
              type="link"
              onClick={() => setParams({ visible: true, currentRow: _ })}
            >
              任务详情
            </Button>
            <Button type="link" onClick={() => openEitherWindow(_.customerId)}>
              登陆
            </Button>
          </Space>
        );
      },
    },
  ];

  const openEitherWindow = async (id: string) => {
    try {
      const resp = await postStaffSearchStatistic(id);
      resp.token &&
        window.open(
          `${API}/customer/index.html#/cabinBooking?token=${resp.token}`,
        );
    } catch {
      message.error('登录失败，联系第三方人员客户～');
    }
  };

  const onUpdateSearch = (
    info?: CabinMonitoringSearchFilterParams | unknown,
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
            columns={CabinMonitoringSearchColumns}
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
            color="primary"
            variant="solid"
            icon={<PlusOutlined />}
            onClick={() => setVisible(true)}
          >
            额外参数设置
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
          fetchData={getCabinMonitoringListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <CabinMonitoringDetail
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
      />
      <CabinMonitoringExtraSetting
        visible={visible}
        onCancel={() => setVisible(false)}
      />
      <CabinMonitoringCron
        params={cronParams}
        onCancel={() => setCronParams({ visible: false, executeCron: null })}
      />
    </>
  );
};

export default CabinMonitoring;
