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
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { ShippingCabinPlanSearchColumns } from './config';
import type {
  ShippingCabinPlanSearchParams,
  ShippingCabinPlanType,
  ShippingCabinPlanSearchFilterParams,
} from '@/services/cabinInformation/shippingCabinPlan/shippingCabinPlanModel';
import useParentSize from '@/hooks/useParentSize';
import {
  deleteShippingCabinPlan,
  getShippingCabinPlanListByPage,
  getShippingCarrierCabinPlanByPage,
  postShippingCabinPlan,
  putShippingCabinPlan,
} from '@/services/cabinInformation/shippingCabinPlan/shippingCabinPlanApi';
import ShippingCabinPlanModal from './ShippingCabinPlanModal';
import { ShippingCabinPlanScheduleType } from '@/enums/setting';
import type { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';

const ShippingCabinPlan: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [defaultActiveTabKey, setDefaultActiveTabKey] =
    useState('shippingCabinPlan');

  const [formMaps, setFormMaps] = useState(ShippingCabinPlanSearchColumns);

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: (ShippingCabinPlanType & { por: LocationItem }) | null;
  }>({ visible: false, currentRow: null });

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<ShippingCabinPlanSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });

  useEffect(() => {
    formMaps.map((item) => {
      if (item.name === 'fndCode')
        item.hiddenItem = defaultActiveTabKey === 'preserveCabinPlan';
    });
    setFormMaps([...formMaps]);
  }, [defaultActiveTabKey]);

  const columns: TableProps['columns'] = [
    {
      title: '船公司',
      dataIndex: 'carrier',
      width: 100,
      align: 'center',
    },
    {
      title: '航线',
      dataIndex: 'carrierRoute',
      width: 100,
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
      hidden: defaultActiveTabKey === 'preserveCabinPlan',
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
      title: 'ETD',
      key: 'etd',
      align: 'center',
      width: 150,
      hidden: defaultActiveTabKey === 'preserveCabinPlan',
      render(value) {
        return <div>{formatTime(value.etd, 'Y-M-D')}</div>;
      },
    },
    {
      title: '船名航次',
      align: 'center',
      width: 220,
      hidden: defaultActiveTabKey === 'preserveCabinPlan',
      render(value) {
        return (
          <div>
            {value.vesselName} / {value.voyNo}
          </div>
        );
      },
    },
    {
      title: '中转',
      align: 'center',
      width: 100,
      dataIndex: 'transitSum',
      hidden: defaultActiveTabKey === 'preserveCabinPlan',
    },
    {
      title: '航程',
      align: 'center',
      width: 100,
      dataIndex: 'voyDays',
      hidden: defaultActiveTabKey === 'preserveCabinPlan',
    },
    {
      title: '更新时间',
      align: 'center',
      width: 200,
      render(value) {
        return <div>{formatTime(value.modifyTime, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: '预计放舱日期',
      width: 200,
      align: 'center',
      hidden: defaultActiveTabKey === 'shippingCabinPlan',
      render(value) {
        return value.planMode.type === 'DAY' ? (
          <div>{value.planMode.beforeEtd} DAYS</div>
        ) : (
          <div>
            {Object.keys(ShippingCabinPlanScheduleType).find(
              (item) =>
                (ShippingCabinPlanScheduleType as Record<string, string>)[
                  item
                ] === value.planMode.week
            )}
            &nbsp;
            {value.planMode.weekTime}
          </div>
        );
      },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={12}>
            <Button
              type="default"
              variant="solid"
              hidden={_.channel === 'CUSTOMER'}
              onClick={() => setParams({ visible: true, currentRow: _ })}
            >
              修改
            </Button>
            <Button
              color="red"
              variant="solid"
              onClick={() => delRouteManage(_.id)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const tabChange = (key: string) => {
    setDefaultActiveTabKey(key);
    setSearchDefaultForm({ ...searchDefaultForm });
  };

  const delRouteManage = (id: string) => {
    modal.confirm({
      title: '删除放舱计划',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该放舱计划吗？数据删除后将无法恢复！',
      onOk: async () => {
        await deleteShippingCabinPlan(id);
        message.success('删除成功');
        setSearchDefaultForm({ ...searchDefaultForm });
      },
    });
  };

  const onUpdateSearch = (
    info?: ShippingCabinPlanSearchFilterParams | unknown
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(
        ([, value]) => !!value && value !== undefined
      )
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['pageIndex', 'pageSize', 'sort'],
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

  const onEditOk = async (editRow: ShippingCabinPlanType) => {
    try {
      if (params.currentRow == null) {
        await postShippingCabinPlan(editRow);
      } else {
        await putShippingCabinPlan(editRow, editRow.id as string);
      }
      message.success(!params.currentRow == null ? '添加成功～' : '修改成功～');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, currentRow: null });
    }
  };
  return (
    <>
      <ConfigProvider>
        <Card
          tabList={[
            { key: 'shippingCabinPlan', tab: '船司舱位计划' },
            { key: 'preserveCabinPlan', tab: '维护放舱计划' },
          ]}
          defaultActiveTabKey={defaultActiveTabKey}
          onTabChange={tabChange}
          tabProps={{
            size: 'middle',
          }}
        >
          <SearchForm
            columns={ShippingCabinPlanSearchColumns}
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
        {defaultActiveTabKey === 'preserveCabinPlan' && (
          <Space>
            <Button
              color="primary"
              variant="solid"
              icon={<PlusOutlined />}
              onClick={() => setParams({ visible: true, currentRow: null })}
            >
              新增放舱计划
            </Button>
          </Space>
        )}
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
          fetchData={
            defaultActiveTabKey === 'shippingCabinPlan'
              ? getShippingCarrierCabinPlanByPage
              : getShippingCabinPlanListByPage
          }
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <ShippingCabinPlanModal
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
    </>
  );
};

export default ShippingCabinPlan;
