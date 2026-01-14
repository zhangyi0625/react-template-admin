import { useState } from 'react';
import {
  type TableProps,
  Space,
  Button,
  type TablePaginationConfig,
  ConfigProvider,
  Card,
  App,
} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { BrashBoxAccountSearchColumns } from '../config';
import type {
  BrashBoxSearchParams,
  BrashBoxType,
} from '@/services/brashBoxManage/brashBoxList/brashBoxListModel';
import BrashBoxAccountModal from './BrashBoxAccountModal';
import {
  addBrashBoxAccount,
  deleteBrashBoxAccount,
  editBrashBoxAccount,
  getBrashBoxAccountPage,
} from '@/services/brashBoxManage/brashBoxList/brashBoxListApi';
import useParentSize from '@/hooks/useParentSize';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';

const BrashBoxAccount: React.FC = () => {
  const { message, modal } = App.useApp();
  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<BrashBoxSearchParams>({
      page: 1,
      limit: 10,
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: BrashBoxType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const tableColumns: TableProps['columns'] = [
    {
      title: '账号',
      key: 'account',
      dataIndex: 'account',
      align: 'left',
      width: 120,
    },
    {
      title: '密码',
      key: 'password',
      dataIndex: 'password',
      align: 'left',
      width: 120,
    },
    {
      title: '是否有效',
      align: 'left',
      width: 80,
      render(value) {
        return <div>{value.status ? '有效' : '无效'}</div>;
      },
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
      align: 'left',
      width: 150,
    },
    {
      title: '更新时间',
      align: 'left',
      width: 120,
      render(value) {
        return <div>{formatTime(value.updateTime, 'Y-M-D h:m')}</div>;
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

  const onUpdateSearch = (info?: BrashBoxSearchParams['filter'] | unknown) => {
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

  const deleteItem = async (id: string) => {
    modal.confirm({
      title: `删除亿通账号`,
      icon: <ExclamationCircleFilled />,
      content: `确定删除亿通账号吗？数据删除后将无法恢复！`,
      onOk() {
        deleteBrashBoxAccount(id as string).then(() => {
          message.success('删除成功');
          onUpdateSearch();
        });
      },
    });
  };

  const onEditOk = async (currentRow: BrashBoxType) => {
    try {
      if (!currentRow.id) {
        // 新增数据
        await addBrashBoxAccount(currentRow);
      } else {
        // 编辑数据
        await editBrashBoxAccount(currentRow);
      }
      // 操作成功，关闭弹窗，刷新数据
      // message.success(!currentRow.id ? '添加成功' : '修改成功');
      setParams({ visible: false, currentRow: null });
      onUpdateSearch();
    } catch (error) {}
  };

  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={BrashBoxAccountSearchColumns}
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
          scroll={{ x: 'max-content', y: height - 298 }}
          fetchData={getBrashBoxAccountPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={() => {}}
        />
      </Card>
      <BrashBoxAccountModal
        params={params}
        onCancel={() => setParams({ ...params, visible: false })}
        onOk={onEditOk}
      />
    </>
  );
};

export default BrashBoxAccount;
