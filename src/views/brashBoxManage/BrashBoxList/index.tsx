import { useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
  Tabs,
  TabsProps,
} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { BrashBoxListSearchColumns } from '../config';
import useParentSize from '@/hooks/useParentSize';
// import BrashBoxModal from './BrashBoxModal';
import BrashBoxSetTime from './BrashBoxSetTime';
import BrashBoxShapeCode from './BrashBoxShapeCode';
import {
  getBrashBoxListPage,
  cancelBrashBoxList,
} from '@/services/brashBoxManage/brashBoxList/brashBoxListApi';
import type {
  BrashBoxListSearchParams,
  BrashBoxListType,
} from '@/services/brashBoxManage/brashBoxList/brashBoxListModel';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';

const BrashBoxList: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<BrashBoxListSearchParams>({
      page: 1,
      limit: 10,
      sort: 'update_time',
      order: 'desc',
      status: 'PENDING',
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: BrashBoxListType['task'] | null;
    type: 'edit' | 'setTime';
  }>({
    visible: false,
    currentRow: null,
    type: 'edit',
  });

  const components: TabsProps['items'] = [
    {
      label: '未刷箱',
      key: 'PENDING',
    },
    {
      label: '刷箱中',
      key: 'RUNNING',
    },
    {
      label: '刷箱成功',
      key: 'SUCCESS',
    },
    {
      label: '刷箱失败',
      key: 'FAILED',
    },
  ];

  const [defaultActiveKey, setDefaultActiveKey] = useState<string>('PENDING');

  const tableColumns: TableProps['columns'] = [
    {
      title: '用户手机号',
      key: 'customerPhone',
      dataIndex: 'customerPhone',
      align: 'left',
      width: 120,
    },
    {
      title: '客户名称',
      key: 'customerName',
      dataIndex: 'customerName',
      align: 'left',
      width: 120,
    },
    {
      title: '提单号',
      key: 'billNo',
      dataIndex: 'billNo',
      align: 'left',
      width: 120,
    },
    {
      title: '箱型数量',
      align: 'left',
      width: 120,
      render(value) {
        return (
          <div>
            {value.ctnType} * {value.ctnNumber}
          </div>
        );
      },
    },
    {
      title: '成功数量',
      key: 'successCount',
      dataIndex: 'successCount',
      hidden: defaultActiveKey !== 'SUCCESS',
      align: 'left',
      width: 80,
    },
    {
      title: '船公司',
      key: 'carrier',
      dataIndex: 'carrier',
      hidden: defaultActiveKey !== 'SUCCESS',
      align: 'left',
      width: 80,
    },
    {
      title: '船名航次',
      align: 'left',
      width: 180,
      hidden: defaultActiveKey !== 'SUCCESS',
      render(value) {
        return (
          <div>
            {value.vesselName} / {value.voyNo}
          </div>
        );
      },
    },
    {
      title: '起运港',
      align: 'left',
      hidden: defaultActiveKey !== 'SUCCESS',
      width: 180,
      render(value) {
        return value.por ? (
          <div>
            {value.por?.enName ?? ''},{value.por?.countryCode ?? ''}
          </div>
        ) : (
          '-'
        );
      },
    },
    {
      title: '目的港',
      align: 'left',
      hidden: defaultActiveKey !== 'SUCCESS',
      width: 180,
      render(value) {
        return value.fnd ? (
          <div>
            {value.fnd?.enName ?? ''},{value.fnd?.countryCode ?? ''}
          </div>
        ) : (
          '-'
        );
      },
    },
    {
      title: '中转港',
      dataIndex: 'transit',
      align: 'left',
      hidden: defaultActiveKey !== 'SUCCESS',
      width: 120,
    },
    {
      title: '失败原因',
      dataIndex: 'remark',
      align: 'left',
      hidden: defaultActiveKey !== 'FAILED',
      width: 120,
    },
    {
      title: '上次执行时间',
      align: 'left',
      width: 150,
      hidden: defaultActiveKey === 'PENDING',
      render(value) {
        return <div>{formatTime(value.execTime, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: '创建时间',
      align: 'left',
      width: 150,
      render(value) {
        return <div>{formatTime(value.createTime, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: '操作',
      key: 'customer',
      align: 'center',
      width: 100,
      fixed: 'right',
      hidden: defaultActiveKey !== 'SUCCESS' && defaultActiveKey !== 'RUNNING',
      render(_) {
        return (
          <Space>
            <Button
              type="link"
              hidden={defaultActiveKey !== 'SUCCESS'}
              onClick={() =>
                setParams({ visible: true, currentRow: _, type: 'edit' })
              }
            >
              有效条形码
            </Button>
            <Button
              variant="link"
              color="danger"
              hidden={defaultActiveKey !== 'RUNNING'}
              onClick={() => cancelItem(_.id)}
            >
              取消
            </Button>
          </Space>
        );
      },
    },
  ];

  const onChange = (type: string) => {
    setDefaultActiveKey(type);
    setSearchDefaultForm({
      ...searchDefaultForm,
      status: type,
    });
  };

  const onUpdateSearch = (info?: BrashBoxListSearchParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value),
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['page', 'limit', 'sort', 'desc', 'status'],
      true,
    );
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
      type: defaultActiveKey,
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    });
  };

  const onEditOk = () => {};

  const cancelItem = async (id: string) => {
    try {
      modal.confirm({
        title: `取消刷箱任务`,
        icon: <ExclamationCircleFilled />,
        content: `确定取消刷箱任务吗？`,
        async onOk() {
          await cancelBrashBoxList(id);
          message.success('取消成功');
          setSearchDefaultForm({ ...searchDefaultForm });
        },
      });
    } catch (error) {}
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={BrashBoxListSearchColumns}
            gutterWidth={24}
            labelPosition="left"
            iconHidden={false}
            btnSeparate={false}
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
        <Tabs
          activeKey={defaultActiveKey}
          items={components}
          onChange={onChange}
        />
        {/* <Space>
          {defaultActiveKey === '2' && (
            <Button variant="solid" color="danger" onClick={() => {}}>
              取消
            </Button>
          )}
        </Space> */}
        {/* <Space className="">
          {defaultActiveKey === '1' && (
            <Button
              type="primary"
              onClick={() =>
                setParams({ ...params, visible: true, type: 'edit' })
              }
            >
              新增
            </Button>
          )}
          {defaultActiveKey === '1' && (
            <Button type="primary" onClick={() => {}}>
              导入
            </Button>
          )}
          {defaultActiveKey === '1' && (
            <Button
              type="primary"
              onClick={() =>
                setParams({ ...params, visible: true, type: 'setTime' })
              }
            >
              设置时间
            </Button>
          )}
          {defaultActiveKey === '1' && (
            <Button type="primary" onClick={() => {}}>
              刷箱
            </Button>
          )}
          {defaultActiveKey === '1' && (
            <Button variant="solid" color="danger" onClick={() => {}}>
              删除
            </Button>
          )}
          {defaultActiveKey === '2' && (
            <Button type="primary" onClick={() => {}}>
              启动
            </Button>
          )}
          {defaultActiveKey === '2' && (
            <Button
              variant="solid"
              color="orange"
              style={{ backgroundColor: '#FAAD14 !important' }}
              onClick={() => {}}
            >
              停止
            </Button>
          )}
          {!(defaultActiveKey === '2' || defaultActiveKey === '5') && (
            <Button type="default" onClick={() => {}}>
              导出
            </Button>
          )}
        </Space> */}
        <SearchTable
          style={{ marginTop: '10px' }}
          size="middle"
          pageIndexKey="page"
          pageSizeKey="limit"
          totalKey={'count'}
          fetchResultKey={'list'}
          isPagination={true}
          columns={tableColumns}
          rowKey={(record) => record.id}
          scroll={{ x: 'max-content', y: height - 198 }}
          fetchData={getBrashBoxListPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={() => {}}
        />
      </Card>
      {params.type === 'edit' ? (
        // <BrashBoxModal
        //   params={params}
        //   onCancel={() => setParams({ ...params, visible: false })}
        //   onOk={onEditOk}
        // />
        <BrashBoxShapeCode
          params={params}
          onCancel={() => setParams({ ...params, visible: false })}
        />
      ) : (
        <BrashBoxSetTime
          params={params}
          onCancel={() => setParams({ ...params, visible: false })}
          onOk={onEditOk}
        />
      )}
    </>
  );
};

export default BrashBoxList;
