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
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { SearchTable } from 'customer-search-form-table';
import useParentSize from '@/hooks/useParentSize';
import type { NoticeManageEditType } from '@/services/otherSetting/noticeManage/noticeManageModel';
import type { DefaultPaging } from '@/types/global';
import {
  addNoticeManage,
  deleteNoticeManage,
  getNoticeManageByList,
  updateNoticeManage,
} from '@/services/otherSetting/noticeManage/noticeManageApi';
import NoticeManageModal from './NoticeManageModal';

const NoticeManage: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] = useState<DefaultPaging>({
    pageIndex: 1,
    pageSize: 10,
  });

  const [params, setParams] = useState<{
    visible: boolean;
    editRow: NoticeManageEditType | null;
  }>({
    visible: false,
    editRow: null,
  });

  const columns: TableProps['columns'] = [
    {
      title: '公告标题',
      dataIndex: 'title',
      width: 150,
      align: 'center',
    },
    {
      title: '公告类型',
      width: 150,
      align: 'center',
      render(value) {
        return value.type === 'MOBILE_HOME_TOP' ? '移动端首页顶部' : '';
      },
    },
    {
      title: '生效起止时间',
      width: 250,
      align: 'center',
      render(value) {
        return (
          value.validFrom &&
          value.validTo && (
            <div>
              {value.validFrom ?? ''} 至 {value.validTo ?? ''}
            </div>
          )
        );
      },
    },
    {
      title: '显示顺序',
      dataIndex: 'sequence',
      width: 80,
      align: 'center',
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={10}>
            <Button
              type="primary"
              variant="solid"
              onClick={() => setParams({ visible: true, editRow: _ })}
            >
              修改
            </Button>
            <Button
              onClick={() => deleteItem(_.id)}
              color="danger"
              variant="outlined"
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const deleteItem = (id: string) => {
    modal.confirm({
      title: '删除公告',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该公告吗？数据删除后将无法恢复！',
      onOk() {
        deleteNoticeManage(id).then(() => {
          message.success('删除成功～');
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    });
  };

  const onEditOk = async (editRow: NoticeManageEditType) => {
    try {
      if (params.editRow == null) {
        await addNoticeManage(editRow);
      } else {
        await updateNoticeManage(editRow, params.editRow.id as string);
      }
      message.success(!editRow?.id ? '添加成功～' : '修改成功～');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, editRow: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, editRow: null });
    }
  };
  return (
    <>
      <ConfigProvider>
        <Card
          style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
          styles={{ body: { height: '100%' } }}
          ref={parentRef}
        >
          <Space>
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={() => setParams({ visible: true, editRow: null })}
            >
              新增公告
            </Button>
          </Space>
          <SearchTable
            size="middle"
            columns={columns}
            style={{ marginTop: '8px' }}
            pageIndexKey="pageIndex"
            pageSizeKey="pageSize"
            scroll={{ x: 'max-content', y: height - 158 }}
            rowKey="id"
            totalKey="total"
            fetchResultKey="entries"
            isPagination={true}
            fetchData={getNoticeManageByList}
            searchFilter={searchDefaultForm}
            isSelection={false}
            onUpdatePagination={onUpdatePagination}
          />
        </Card>
      </ConfigProvider>
      <NoticeManageModal
        params={params}
        onOk={onEditOk}
        onCancel={() => setParams({ visible: false, editRow: null })}
      />
    </>
  );
};

export default NoticeManage;
