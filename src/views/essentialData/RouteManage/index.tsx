import { useState } from 'react';
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import AddRouteManage from './AddRouteManage';
import {
  addRouteManage,
  deleteRouteManage,
  getRouteManageListByPage,
  updateRouteManage,
} from '@/services/customerInformation/routeManage/routeManageApi';
import type {
  RouteMangeParams,
  RouteMangeType,
} from '@/services/customerInformation/routeManage/routeManageModel';
import { filterKeys } from '@/utils/tool';
import useParentSize from '@/hooks/useParentSize';
import { SelectRouteManageOptions } from './config';

const RouteManage: React.FC = () => {
  const { modal, message } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] = useState<RouteMangeParams>({
    page: 1,
    limit: 10,
  });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: RouteMangeType | null;
    view: boolean;
  }>({
    visible: false,
    currentRow: null,
    view: false,
  });

  const columns: TableProps['columns'] = [
    {
      title: '航线代码',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      align: 'center',
    },
    {
      title: '航线名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      align: 'center',
    },
    {
      title: '操作',
      width: '14%',
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={0}>
            <Button
              type="link"
              size="small"
              onClick={() =>
                setParams({ visible: true, currentRow: _, view: true })
              }
            >
              修改
            </Button>
            <Button
              type="link"
              danger
              size="small"
              onClick={() => deleteBatch(_.id)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const deleteBatch = (id: string) => {
    modal.confirm({
      title: '删除航线',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该航线吗？数据删除后将无法恢复！',
      onOk() {
        deleteRouteManage(id).then(() => {
          // 刷新表格数据
          onUpdateSearch();
        });
      },
    });
  };

  const onEditOk = async (routeRow: RouteMangeType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addRouteManage(routeRow);
      } else {
        // 编辑数据
        await updateRouteManage(routeRow);
      }
      // 操作成功，关闭弹窗，刷新数据
      message.success(!params.currentRow ? '添加成功' : '修改成功');
      setParams({ visible: false, currentRow: null, view: false });
      onUpdateSearch();
    } catch (error) {}
  };

  const onUpdateSearch = (info?: RouteMangeParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value),
    );
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true);
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    });
  };
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 0,
            },
          },
        }}
      >
        <Card>
          <SearchForm
            columns={SelectRouteManageOptions}
            gutterWidth={24}
            iconHidden={true}
            labelPosition="left"
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
        <Space className="mb-[8px]">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() =>
              setParams({ visible: true, currentRow: null, view: true })
            }
          >
            新增航线
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          bordered
          rowKey="id"
          isPagination={true}
          fetchResultKey="list"
          totalKey="count"
          pageIndexKey="page"
          pageSizeKey="limit"
          scroll={{ x: 'max-content', y: height - 158 }}
          fetchData={getRouteManageListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      {params.visible && (
        <AddRouteManage
          params={params}
          onOk={onEditOk}
          onCancel={() =>
            setParams({ visible: false, currentRow: null, view: false })
          }
        />
      )}
    </>
  );
};

export default RouteManage;
