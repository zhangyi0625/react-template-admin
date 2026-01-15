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
import { ExclamationCircleFilled } from '@ant-design/icons';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { StaffManageSearchColumns } from './config';
import useParentSize from '@/hooks/useParentSize';
import type {
  StaffManageSearchParams,
  StaffManageType,
} from '@/services/staffManage/staffManageModel';
import {
  addStaffManage,
  deleteStaffManage,
  editStaffManage,
  getStaffManageByPage,
} from '@/services/staffManage/staffManageApi';
import StaffModal from './StaffModal';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';

const StaffManage: React.FC = () => {
  const { message, modal } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<StaffManageSearchParams>({
      page: 1,
      limit: 10,
      filter: {
        status: true,
      },
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: StaffManageType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const tableColumns: TableProps['columns'] = [
    {
      title: '用户手机号',
      dataIndex: 'phone',
      width: 120,
      align: 'left',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      align: 'left',
    },
    {
      title: '所在公司',
      dataIndex: 'companyName',
      width: 180,
      align: 'left',
    },
    {
      title: '状态',
      width: 100,
      align: 'left',
      render(value) {
        return (
          <div className={value.status ? 'text-stone-900' : 'text-red-500'}>
            {value.status ? '正常' : '禁用'}
          </div>
        );
      },
    },
    {
      title: '绑定微信',
      width: 100,
      align: 'left',
      render(value) {
        return <div>{value.wxOpenid ? '已绑定' : '未绑定'}</div>;
      },
    },

    {
      title: '创建日期',
      width: 120,
      align: 'left',
      render(value) {
        return <div>{formatTime(value.createTime, 'Y-M-D')}</div>;
      },
    },
    {
      title: '更新时间',
      width: 120,
      align: 'left',
      render(value) {
        return <div>{formatTime(value.updateTime, 'Y-M-D')}</div>;
      },
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

  const onUpdateSearch = (
    info?: StaffManageSearchParams['filter'] | unknown
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

  const onEditOk = async (currentRow: StaffManageType) => {
    try {
      if (!params.currentRow) {
        // 新增数据
        await addStaffManage(currentRow);
      } else {
        // 编辑数据
        await editStaffManage(currentRow);
      }
      // 操作成功，关闭弹窗，刷新数据
      // message.success(!currentRow.id ? '添加成功' : '修改成功');
      setParams({ visible: false, currentRow: null });
      onUpdateSearch();
    } catch (error) {}
  };

  const deleteItem = async (id: string | string[], type?: string) => {
    modal.confirm({
      title: `${type ? '批量' : ''}删除客户`,
      icon: <ExclamationCircleFilled />,
      content: `确定${type ? '批量' : ''}删除客户吗？数据删除后将无法恢复！`,
      onOk() {
        // 调用删除接口，删除成功后刷新页面数据
        deleteStaffManage(id as string).then(() => {
          message.success(`${type ? '批量' : ''}删除成功`);
          onUpdateSearch();
        });
      },
    });
  };
  return (
    <>
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={StaffManageSearchColumns}
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
          rowKey={'id'}
          scroll={{ x: 'max-content', y: height - 298 }}
          fetchData={getStaffManageByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={() => {}}
        />
      </Card>
      <StaffModal
        params={params}
        onOk={onEditOk}
        onCancel={() => setParams({ ...params, visible: false })}
      />
    </>
  );
};

export default StaffManage;
