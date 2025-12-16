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
import {
  DownloadOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { ReleaseShippingHistorySearchColumns } from './config';
import useParentSize from '@/hooks/useParentSize';
import type {
  ReleaseShippingHistorySearchParams,
  ReleaseShippingHistoryMonitoringPortType,
  ReleaseShippingHistorySearchFilterParams,
} from '@/services/cabinInformation/releaseShippingHistory/releaseShippingHistoryModel';
import {
  deleteReleaseShippingHistoryDeletePort,
  getReleaseShippingHistoryListByPage,
  getReleaseShippingHistoryMonitoringPortByPage,
  postReleaseShippingHistoryAddPort,
  putReleaseShippingHistoryAddPort,
} from '@/services/cabinInformation/releaseShippingHistory/releaseShippingHistoryApi';
import MonitoringPortModal from './MonitoringPortModal';
import { getSystemAreaOptions } from '@/services/system/basicData/basicDataApi';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';
import { ExportTableDataByXLSX } from '@/utils/export';

const ReleaseShippingHistory: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [defaultActiveTabKey, setDefaultActiveTabKey] = useState(
    'shippingHistoryList'
  );

  const [formMaps, setFormMaps] = useState(ReleaseShippingHistorySearchColumns);

  const [downLoading, setDownLoading] = useState<boolean>(false);

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: ReleaseShippingHistoryMonitoringPortType | null;
  }>({ visible: false, currentRow: null });

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<ReleaseShippingHistorySearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: undefined,
    });

  useEffect(() => {
    init();
  }, [defaultActiveTabKey]);

  const columns: TableProps['columns'] = [
    {
      title: '船公司',
      dataIndex: 'carrier',
      key: 'carrier',
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
      title: '航线',
      dataIndex: 'areaName',
      key: 'areaName',
      width: 100,
      align: 'center',
    },
    {
      title: 'ETD',
      align: 'center',
      width: 150,
      hidden: defaultActiveTabKey === 'monitoringPort',
      render(value) {
        return <div>{formatTime(value.etd, 'Y-M-D')}</div>;
      },
    },
    {
      title: '箱型',
      key: 'ctnType',
      dataIndex: 'ctnType',
      align: 'center',
      width: 150,
    },
    {
      title: '船名航次',
      align: 'center',
      width: 220,
      hidden: defaultActiveTabKey === 'monitoringPort',
      render(value) {
        return (
          <div>
            {value.vesselName} / {value.voyNo}
          </div>
        );
      },
    },
    {
      title: '底价',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
      width: 150,
      hidden: defaultActiveTabKey === 'monitoringPort',
    },
    {
      title: '放舱状态',
      align: 'center',
      width: 150,
      hidden: defaultActiveTabKey === 'monitoringPort',
      render() {
        return <div>已放舱</div>;
      },
    },
    {
      title: '创建时间',
      align: 'center',
      width: 200,
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      align: 'center',
      hidden: defaultActiveTabKey === 'shippingHistoryList',
      render(_) {
        return (
          <Space size={12}>
            <Button
              type="default"
              variant="solid"
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

  const init = async () => {
    try {
      const resp = await getSystemAreaOptions({ parentId: 0 });
      formMaps.map((item) => {
        if (item.name === 'areaId') item.options = resp ?? [];
        item.hiddenItem =
          defaultActiveTabKey === 'monitoringPort' &&
          item.formType === 'range-picker'
            ? true
            : false;
      });
      setFormMaps([...formMaps]);
    } catch {}
  };

  const delRouteManage = (id: string) => {
    modal.confirm({
      title: '删除监控港口',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该监控港口吗？数据删除后将无法恢复！',
      onOk: async () => {
        await deleteReleaseShippingHistoryDeletePort(id);
        message.success('删除成功');
        setSearchDefaultForm({ ...searchDefaultForm });
      },
    });
  };

  const tabChange = (key: string) => {
    setDefaultActiveTabKey(key);
    setSearchDefaultForm({
      ...filterKeys(searchDefaultForm, ['pageIndex', 'pageSize'], true),
      filter: undefined,
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    });
  };

  const onUpdateSearch = (
    info?: ReleaseShippingHistorySearchFilterParams | unknown
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

  const onEditOk = async (
    editRow: ReleaseShippingHistoryMonitoringPortType
  ) => {
    try {
      if (params.currentRow == null) {
        await postReleaseShippingHistoryAddPort(editRow);
      } else {
        await putReleaseShippingHistoryAddPort(editRow);
      }
      message.success(params.currentRow == null ? '添加成功～' : '修改成功～');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, currentRow: null });
    }
  };

  const downloadData = async () => {
    setDownLoading(true);
    try {
      const resp = await getReleaseShippingHistoryListByPage({
        ...searchDefaultForm,
        pageIndex: 1,
        pageSize: 9999,
      });
      ExportTableDataByXLSX(
        resp.entries,
        columns.splice(0, columns.length - 1).filter((item) => !item.hidden),
        '放舱历史导出列表'
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
        <Card
          tabList={[
            { key: 'shippingHistoryList', tab: '放舱历史' },
            { key: 'monitoringPort', tab: '维护监控港口' },
          ]}
          defaultActiveTabKey={defaultActiveTabKey}
          onTabChange={tabChange}
          tabProps={{
            size: 'middle',
          }}
        >
          <SearchForm
            columns={formMaps}
            gutterWidth={24}
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
        {defaultActiveTabKey === 'shippingHistoryList' ? (
          <Button
            color="blue"
            variant="outlined"
            icon={<DownloadOutlined />}
            onClick={downloadData}
            loading={downLoading}
          >
            导出列表
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            新增监控港口
          </Button>
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
            defaultActiveTabKey === 'shippingHistoryList'
              ? getReleaseShippingHistoryListByPage
              : getReleaseShippingHistoryMonitoringPortByPage
          }
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <MonitoringPortModal
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
    </>
  );
};

export default ReleaseShippingHistory;
