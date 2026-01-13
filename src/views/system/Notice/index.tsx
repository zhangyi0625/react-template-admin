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
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { NoticeSearchColumns } from './config';
import useParentSize from '@/hooks/useParentSize';
import type {
  NoticeManageSearchParams,
  NoticeManageType,
} from '@/services/system/notice/noticeModel';
import {
  addNoticeManage,
  editNoticeManage,
  getNoticeManageByPage,
} from '@/services/system/notice/noticeApi';
import NoticeModal from './NoticeModal';
import { filterKeys } from '@/utils/tool';

const NoticeManage: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<NoticeManageSearchParams>({
      page: 1,
      limit: 10,
      filter: {
        status: true,
      },
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: NoticeManageType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const tableColumns: TableProps['columns'] = [
    {
      title: '公告标题',
      dataIndex: 'title',
      width: 120,
      align: 'left',
    },
    {
      title: '公告内容',
      dataIndex: 'content',
      width: 120,
      align: 'left',
    },
    {
      title: '起效日期',
      dataIndex: 'validFrom',
      width: 120,
      align: 'left',
    },
    {
      title: '失效日期',
      dataIndex: 'validTo',
      width: 120,
      align: 'left',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      align: 'left',
    },
    {
      title: '更新时间',
      dataIndex: 'modifyTime',
      width: 120,
      align: 'left',
    },
    {
      title: '操作',
      align: 'center',
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
              onClick={() => setParams({ visible: true, currentRow: _ })}
              color="danger"
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const onUpdateSearch = (
    info?: NoticeManageSearchParams['filter'] | unknown
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
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

  const onEditOk = async (currentRow: NoticeManageType) => {
    try {
      if (!params.currentRow) {
        // 新增数据
        await addNoticeManage(currentRow);
      } else {
        // 编辑数据
        await editNoticeManage(currentRow);
      }
      // 操作成功，关闭弹窗，刷新数据
      message.success(!currentRow.id ? '添加成功' : '修改成功');
      setParams({ visible: false, currentRow: null });
      onUpdateSearch();
    } catch (error) {}
  };

  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={NoticeSearchColumns}
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
            onClick={() => setParams({ ...params, visible: true })}
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
          // rowKey={(_) => Math.random()}
          rowKey={'id'}
          scroll={{ x: 'max-content', y: height - 298 }}
          fetchData={getNoticeManageByPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={() => {}}
        />
      </Card>
      <NoticeModal
        params={params}
        onCancel={() => setParams({ ...params, visible: false })}
        onOk={onEditOk}
      />
    </>
  );
};

export default NoticeManage;
