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
import { ExclamationCircleFilled } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { HplQQCabinPlanSearchColumns } from './config';
import {
  deleteHplQQCabinPlan,
  getHplQQCabinPlanListByPage,
  putHplQQCabinPlanUpdate,
} from '@/services/cabinInformation/hplQQCabinPlan/hplQQCabinPlanApi';
import useParentSize from '@/hooks/useParentSize';
import type {
  HplQQCabinPlanSearchFilterParams,
  HplQQCabinPlanSearchParams,
  HplQQCabinPlanSearchResultType,
} from '@/services/cabinInformation/hplQQCabinPlan/hplQQCabinPlanModel';
import CabinMonitoringCron from '../CabinMonitoring/CabinMonitoringCron';
import HplQQCabinPlanSchedule from './HplQQCabinPlanSchedule';
import HplQQCabinPlanResult from './HplQQCabinPlanResult';
import { filterKeys } from '@/utils/tool';

const HplQQCabinPlan: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<HplQQCabinPlanSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: HplQQCabinPlanSearchResultType | null;
    source: 'schedule' | 'result';
  }>({ visible: false, currentRow: null, source: 'schedule' });

  const [cronParams, setCronParams] = useState<{
    visible: boolean;
    executeCron: string | null;
  }>({ visible: false, executeCron: null });

  const columns: TableProps['columns'] = [
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
      title: '箱型数量',
      width: 150,
      align: 'center',
      render(value) {
        return (
          <div>
            {value.booking.ctnType} * {value.booking.ctnNum}
          </div>
        );
      },
    },
    {
      title: '状态',
      width: 150,
      align: 'center',
      render(value) {
        let statusOptions = HplQQCabinPlanSearchColumns.find(
          (item) => item.name === 'status'
        )?.options;
        return (
          <div>
            {statusOptions?.find((i) => i.value === value.status)?.label ?? '-'}
          </div>
        );
      },
    },
    {
      title: '创建时间',
      align: 'center',
      width: 200,
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      width: 250,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={6}>
            <Button
              type="link"
              variant="solid"
              onClick={() =>
                setParams({ visible: true, currentRow: _, source: 'schedule' })
              }
            >
              同步船期
            </Button>
            <Button
              type="link"
              variant="solid"
              hidden={_.status !== 'SUBMITTED'}
              onClick={() =>
                setCronParams({ visible: true, executeCron: _.executeCron })
              }
            >
              设置频率
            </Button>
            <Button
              type="link"
              variant="solid"
              hidden={_.status !== 'SUBMITTED'}
              onClick={() => delHplQQCabinPlan(_.id)}
            >
              结束任务
            </Button>
            <Button
              type="link"
              variant="solid"
              hidden={_.status !== 'SUCCESS'}
              onClick={() =>
                setParams({ visible: true, currentRow: _, source: 'result' })
              }
            >
              订舱结果
            </Button>
          </Space>
        );
      },
    },
  ];

  const delHplQQCabinPlan = (id: string) => {
    modal.confirm({
      title: '取消',
      icon: <ExclamationCircleFilled />,
      content: '确定取消HPLQQ订舱任务吗？',
      onOk: async () => {
        await deleteHplQQCabinPlan(id);
        message.success('操作成功');
        setSearchDefaultForm({ ...searchDefaultForm });
      },
    });
  };

  const onEditOk = async (editRow: { vesselIds: string[]; type: 'VESSEL' }) => {
    try {
      await putHplQQCabinPlanUpdate(editRow, params.currentRow?.id as string);
      message.success('修改成功～');
      setParams({ visible: false, currentRow: null, source: 'schedule' });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, currentRow: null });
    }
  };

  const onUpdateSearch = (
    info?: HplQQCabinPlanSearchFilterParams | unknown
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
            columns={HplQQCabinPlanSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
            defaultFormItemLayout={{
              labelCol: {
                xs: { span: 17 },
                sm: { span: 7 },
              },
              wrapperCol: {
                xs: { span: 2 },
                sm: { span: 22 },
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
          style={{ marginTop: '10px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          scroll={{ x: 'max-content', y: height - 158 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getHplQQCabinPlanListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      {params.source === 'schedule' ? (
        <HplQQCabinPlanSchedule
          params={params}
          onOk={onEditOk}
          onCancel={() =>
            setParams({ visible: false, currentRow: null, source: 'schedule' })
          }
        />
      ) : (
        <HplQQCabinPlanResult
          params={params}
          onCancel={() =>
            setParams({ visible: false, currentRow: null, source: 'result' })
          }
        />
      )}
      <CabinMonitoringCron
        params={cronParams}
        onCancel={() => setCronParams({ visible: false, executeCron: null })}
      />
    </>
  );
};

export default HplQQCabinPlan;
