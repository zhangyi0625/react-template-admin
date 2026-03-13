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
import BrashBoxModal from '../BrashBoxList/BrashBoxModal';
import BrashBoxSetTime from '../BrashBoxList/BrashBoxSetTime';
import BrashBoxShapeCode from '../BrashBoxList/BrashBoxShapeCode';
import {
  addBrashBoxList,
  cancelBrashBoxList,
  deleteBrashBoxList,
  editBrashBoxList,
  getMyBrashBoxListCancelPage,
  getMyBrashBoxListPage,
  postBrashBoxStart,
  postRefreshResult,
} from '@/services/brashBoxManage/brashBoxList/brashBoxListApi';
import type {
  BrashBoxListSearchParams,
  BrashBoxListType,
} from '@/services/brashBoxManage/brashBoxList/brashBoxListModel';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';
import BrashBoxDrawer from '../BrashBoxList/BrashBoxDrawer';

const MyBrashBoxList: React.FC = () => {
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
    type: 'edit' | 'add';
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
      label: '取消刷箱',
      key: 'CANCEL',
    },
  ];

  const [defaultActiveKey, setDefaultActiveKey] = useState<string>('PENDING');

  const [brashBoxDrawerVisible, setBrashBoxDrawerVisible] =
    useState<boolean>(false);

  const tableColumns: TableProps['columns'] = [
    {
      title: '提单号',
      key: 'billNo',
      dataIndex: 'billNo',
      align: 'left',
      width: 120,
    },
    {
      title: '总数量',
      align: 'left',
      width: 120,
      render(value) {
        return <div>{value.totalNumber}</div>;
      },
    },
    {
      title: '本次刷箱量',
      align: 'left',
      width: 120,
      render(value) {
        return (
          value.containers && (
            <div className="flex items-center whitespace-nowrap">
              {Object.keys(value.containers).map((key) => (
                <div key={key} className="mr-[10px]">
                  {key} * {value.containers[key]}
                </div>
              ))}
            </div>
          )
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
      width: 150,
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
      align: 'left',
      width: 100,
      fixed: 'right',
      render(_) {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                (setParams({
                  visible: false,
                  currentRow: _,
                  type: 'add',
                }),
                  setBrashBoxDrawerVisible(true));
              }}
            >
              详情
            </Button>
            {defaultActiveKey === 'PENDING' && getPendingBrashBoxBtn(_)}
            <Button
              type="link"
              hidden={defaultActiveKey !== 'RUNNING'}
              onClick={() => updateBrashBoxStatus(_.id as string)}
            >
              更新状态
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

  const getPendingBrashBoxBtn = (row: BrashBoxListType['task']) => {
    return (
      <>
        <Button
          variant="link"
          color="primary"
          onClick={() => changeBrashTask(row.id as string, 'start')}
        >
          刷箱
        </Button>
        <Button
          variant="link"
          color="primary"
          onClick={() =>
            setParams({ visible: true, currentRow: row, type: 'add' })
          }
        >
          修改
        </Button>
        <Button
          variant="link"
          color="danger"
          onClick={() => changeBrashTask(row.id as string, 'delete')}
        >
          删除
        </Button>
      </>
    );
  };

  const onChange = (type: string) => {
    setDefaultActiveKey(type);
    setSearchDefaultForm({
      ...searchDefaultForm,
      status: type,
    });
  };

  const updateBrashBoxStatus = async (id: string) => {
    try {
      await postRefreshResult(id);
      message.success('更新成功');
      onUpdateSearch();
    } catch (error) {}
  };

  const onUpdateSearch = (info?: BrashBoxListSearchParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value),
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['page', 'limit', 'sort', 'order', 'status'],
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

  const onEditOk = async (
    editRow: Pick<
      BrashBoxListType['task'],
      'billNo' | 'id' | 'ctnType' | 'ctnNumber' | 'totalNumber'
    >,
  ) => {
    try {
      if (!editRow.id) {
        // 新增数据
        await addBrashBoxList(editRow);
        setParams({ visible: false, currentRow: null, type: 'edit' });
        modal.confirm({
          title: `任务新增成功`,
          icon: <ExclamationCircleFilled />,
          content: `如继续添加该票其他箱型任务 请点继续添加`,
          okText: '完成',
          cancelText: '继续添加',
          async onOk() {
            setParams({ visible: false, currentRow: null, type: 'add' });
          },
          onCancel() {
            setParams({
              visible: true,
              currentRow: {
                billNo: editRow.billNo,
                totalNumber: editRow.totalNumber,
              } as unknown as BrashBoxListType['task'],
              type: 'add',
            });
          },
        });
      } else {
        // 编辑数据
        await editBrashBoxList(editRow);
        setParams({ visible: false, currentRow: null, type: 'edit' });
      }
      // 操作成功，关闭弹窗，刷新数据
      // message.success(!editRow.id ? '添加成功' : '修改成功');
      onUpdateSearch();
    } catch (error) {}
  };

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

  const changeBrashTask = async (id: string, type: string) => {
    try {
      modal.confirm({
        title: `${type === 'delete' ? '删除' : '启动'}刷箱任务`,
        icon: <ExclamationCircleFilled />,
        content: `确定${type === 'delete' ? '删除' : '启动'}刷箱任务吗？`,
        async onOk() {
          type === 'delete'
            ? await deleteBrashBoxList(id)
            : await postBrashBoxStart(id);
          message.success(`${type === 'delete' ? '删除' : '启动'}成功`);
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
        <Space>
          <Button
            type="primary"
            onClick={() =>
              setParams({ visible: true, currentRow: null, type: 'add' })
            }
            hidden={defaultActiveKey !== 'PENDING'}
          >
            新增任务
          </Button>
        </Space>
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
          scroll={{ x: 'max-content', y: height - 228 }}
          fetchData={
            defaultActiveKey === 'CANCEL'
              ? getMyBrashBoxListCancelPage
              : getMyBrashBoxListPage
          }
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={() => {}}
        />
      </Card>
      {params.type === 'add' ? (
        <BrashBoxModal
          params={params}
          onCancel={() => setParams({ ...params, visible: false })}
          onOk={onEditOk}
        />
      ) : params.type === 'edit' ? (
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
      <BrashBoxDrawer
        visible={brashBoxDrawerVisible}
        detailId={params.currentRow?.id ?? ''}
        onCancel={() => setBrashBoxDrawerVisible(false)}
      />
    </>
  );
};

export default MyBrashBoxList;
