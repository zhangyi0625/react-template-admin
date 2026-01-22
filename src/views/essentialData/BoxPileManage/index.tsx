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
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { BoxPileManageSearchColumns } from './config';
import type {
  BoxPileManageSearchParams,
  BoxPileManageType,
} from '@/services/essentialData/boxPileManage/boxPileManageModel';
import useParentSize from '@/hooks/useParentSize';
import BoxPileModal from './BoxPileModal';
import {
  addBoxPileManage,
  deleteBoxPileManage,
  editBoxPileManage,
  getBoxPileManagePage,
} from '@/services/essentialData/boxPileManage/boxPileManageApi';
import { filterKeys } from '@/utils/tool';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { formatTime } from '@/utils/format';

const BoxPileManage: React.FC = () => {
  const { message, modal } = App.useApp();
  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<BoxPileManageSearchParams>({
      page: 1,
      limit: 10,
      sort: 'update_time',
      order: 'desc',
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: BoxPileManageType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const tableColumns: TableProps['columns'] = [
    {
      title: '箱型编码',
      key: 'code',
      dataIndex: 'code',
      align: 'left',
      width: 120,
    },
    {
      title: '箱型名称',
      key: 'name',
      dataIndex: 'name',
      align: 'left',
      width: 120,
    },
    {
      title: '状态',
      key: 'enabled',
      align: 'left',
      width: 80,
      render(value) {
        return <div>{value.enabled ? '启用' : '禁用'}</div>;
      },
    },
    {
      title: '排序',
      key: 'sort',
      dataIndex: 'sort',
      align: 'left',
      width: 80,
    },
    {
      title: '修改时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      align: 'left',
      width: 150,
      render(value) {
        return <div>{formatTime(value, 'Y-M-D h:m')}</div>;
      },
    },
    {
      title: '操作',
      align: 'left',
      width: 100,
      render(_) {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => setParams({ visible: true, currentRow: _ })}
            >
              编辑
            </Button>
            <Button
              variant="link"
              onClick={() => deleteItem(_.id)}
              color="danger"
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const onUpdateSearch = (info?: BoxPileManageSearchParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value),
    );
    let pageInfo = filterKeys(
      searchDefaultForm,
      ['page', 'limit', 'sort', 'order'],
      true,
    );
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    });
  };

  const deleteItem = async (id: string) => {
    modal.confirm({
      title: `删除箱型`,
      icon: <ExclamationCircleFilled />,
      content: `确定删除箱型吗？数据删除后将无法恢复！`,
      onOk() {
        deleteBoxPileManage(id as string).then(() => {
          message.success('删除成功');
          onUpdateSearch();
        });
      },
    });
  };

  const onEditOk = async (currentRow: BoxPileManageType) => {
    try {
      if (!currentRow.id) {
        // 新增数据
        await addBoxPileManage(currentRow);
      } else {
        // 编辑数据
        await editBoxPileManage(currentRow);
      }
      // 操作成功，关闭弹窗，刷新数据
      // message.success(!currentRow.id ? '添加成功' : '修改成功');
      setParams({ visible: false, currentRow: null });
      onUpdateSearch();
    } catch (error) {}
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
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={BoxPileManageSearchColumns}
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
        <Space>
          <Button
            type="primary"
            onClick={() => setParams({ currentRow: null, visible: true })}
          >
            新增
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
          rowKey={'id'}
          scroll={{ x: 'max-content', y: height - 168 }}
          fetchData={getBoxPileManagePage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={() => {}}
        />
      </Card>
      <BoxPileModal
        params={params}
        onCancel={() => setParams({ visible: false, currentRow: null })}
        onOk={onEditOk}
      />
    </>
  );
};

export default BoxPileManage;
