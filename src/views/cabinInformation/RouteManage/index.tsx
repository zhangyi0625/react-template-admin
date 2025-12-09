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
import { RouteManageSearchColumns } from './config';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import {
  deleteRouteManage,
  getRouteManageListByPage,
  postBatchAddRouteManage,
  putRouteManage,
  updateShippingRouteManage,
} from '@/services/cabinInformation/routeManage/routeManageApi';
import type {
  RouteManageByCarrierRouteType,
  RouteManageSearchFilterParams,
  RouteManageSearchParams,
} from '@/services/cabinInformation/routeManage/routeManageModel';
import RouteManageModal from './RouteManageModal';
import { CabinManageChannelOptions } from '../CabinManage/config';
import useCacheData from '@/hooks/useCacheData';
import useParentSize from '@/hooks/useParentSize';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';

const RouteManage: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [formMaps, setFormMaps] = useState(RouteManageSearchColumns);

  const [params, setParams] = useState<{
    visible: boolean;
    editId: string | null;
  }>({ visible: false, editId: null });

  const { essential } = useCacheData({
    cacheEssentialKeys: ['carrierData', 'routeData'],
  });

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<RouteManageSearchParams>({
      pageIndex: 1,
      pageSize: 10,
      filter: {
        channel: 'CARRIER',
      },
      sort: {
        id: '-1',
      },
    });

  useEffect(() => {
    formMaps.map((item) => {
      if (item.name === 'route') item.options = essential['routeData'];
    });
    setFormMaps([...formMaps]);
    console.log(formMaps, 'zzzz');
  }, [essential]);

  const columns: TableProps['columns'] = [
    {
      title: '船公司',
      dataIndex: 'carrier',
      width: 100,
      align: 'center',
    },
    {
      title: '分类',
      align: 'center',
      width: 100,
      render(value) {
        let text =
          CabinManageChannelOptions?.find(
            (item) => item.value === value.channel
          )?.label ?? '';
        return <div>{String(text).replace(/\舱位/g, '')}</div>;
      },
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
      align: 'center',
      width: 100,
      render(value) {
        let route = value.route ? value.route.split('/')[0] : '';
        return (
          <div>
            {essential['routeData']?.find((item) => item.code === route)?.name}
          </div>
        );
      },
    },
    {
      title: '产品数',
      align: 'center',
      dataIndex: 'productCount',
      width: 100,
    },
    {
      title: '其他选项',
      align: 'center',
      width: 200,
      render(value) {
        let haulageModes = value.options?.haulageModes ?? [];
        return (
          haulageModes.length > 0 && (
            <div>运输条款:{haulageModes.join(',')}</div>
          )
        );
      },
    },
    {
      title: '创建时间',
      align: 'center',
      width: 200,
      render(value) {
        return <div>{formatTime(value.created, 'Y/M/D h:m:s')}</div>;
      },
    },
    {
      title: '更新时间',
      align: 'center',
      width: 200,
      render(value) {
        return <div>{formatTime(value.updated, 'Y/M/D h:m:s')}</div>;
      },
    },
    {
      title: '操作',
      width: 250,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={12}>
            <Button
              type="primary"
              variant="solid"
              hidden={_.channel === 'CUSTOMER'}
              onClick={() => updateRouteManage(_.id)}
            >
              更新
            </Button>
            <Button
              type="default"
              variant="solid"
              hidden={_.channel === 'CUSTOMER'}
              onClick={() => setParams({ visible: true, editId: _.id })}
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

  const onUpdateSearch = (info?: RouteManageSearchFilterParams | unknown) => {
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

  const updateRouteManage = async (id: string) => {
    modal.confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '确认更新该航线数据?',
      onOk: async () => {
        await updateShippingRouteManage(id);
        message.success('更新任务提交成功');
        setSearchDefaultForm({ ...searchDefaultForm });
      },
    });
  };

  const delRouteManage = (id: string) => {
    modal.confirm({
      title: '删除船司航线',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该船司航线吗？数据删除后将无法恢复！',
      onOk: async () => {
        await deleteRouteManage(id);
        message.success('删除成功');
        setSearchDefaultForm({ ...searchDefaultForm });
      },
    });
  };

  const onEditOk = async (editRow: RouteManageByCarrierRouteType) => {
    try {
      if (params.editId == null) {
        await postBatchAddRouteManage(editRow);
      } else {
        await putRouteManage(editRow, params.editId);
      }
      message.success(!params.editId ? '添加成功～' : '修改成功～');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, editId: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, currentRow: null });
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
                xs: { span: 17 },
                sm: { span: 7 },
              },
              wrapperCol: {
                xs: { span: 2 },
                sm: { span: 22 },
              },
            }}
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
        <Space>
          <Button
            color="primary"
            variant="solid"
            icon={<PlusOutlined />}
            onClick={() => setParams({ visible: true, editId: null })}
          >
            添加船司航线
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
          fetchData={getRouteManageListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <RouteManageModal
        params={params}
        onCancel={() => setParams({ visible: false, editId: null })}
        onOk={onEditOk}
      />
    </>
  );
};

export default RouteManage;
