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
import { SearchForm, SearchTable } from 'customer-search-form-table';
import { StaffManageSearchColumns } from './config';
import useParentSize from '@/hooks/useParentSize';
import type {
  StaffManageSearchParams,
  StaffManageType,
} from '@/services/affiliateManage/staffManage/staffManageModel';
import {
  createStaffManage,
  deleteStaffManage,
  getStaffManageListByPage,
  updateStaffManage,
} from '@/services/affiliateManage/staffManage/staffManageApi';
import StaffModal from './StaffModal';
import { filterKeys } from '@/utils/tool';

const StaffManage: React.FC = () => {
  const { modal, message } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<StaffManageSearchParams>({
      page: 1,
      limit: 10,
    });

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: StaffManageType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const columns: TableProps['columns'] = [
    {
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
      width: 100,
    },
    {
      title: '用户手机号',
      dataIndex: 'phone',
      align: 'center',
      width: 120,
    },
    {
      title: '绑定企业',
      dataIndex: 'companyName',
      align: 'center',
      width: 150,
    },
    {
      title: '职位',
      dataIndex: 'position',
      align: 'center',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      width: 120,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      align: 'center',
      width: 180,
    },
    {
      title: '最近登陆时间',
      dataIndex: 'loginTime',
      align: 'center',
      width: 180,
    },
    {
      title: '操作',
      width: '10%',
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={0}>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setParams({ visible: true, currentRow: _ });
              }}
            >
              编辑
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
      title: '删除企业员工',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该企业员工吗？数据删除后将无法恢复！',
      onOk() {
        deleteStaffManage(id).then(() => {
          message.success('删除成功～');
          // 刷新表格数据
          onUpdateSearch();
        });
      },
    });
  };

  const onEditOk = async (routeRow: StaffManageType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await createStaffManage(routeRow);
      } else {
        // 编辑数据
        await updateStaffManage(routeRow);
      }
      // 操作成功，关闭弹窗，刷新数据
      message.success(!params.currentRow ? '添加成功' : '修改成功');
      setParams({ visible: false, currentRow: null });
      onUpdateSearch();
    } catch (error) {}
  };

  const onUpdateSearch = (info?: StaffManageSearchParams | unknown) => {
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
      <ConfigProvider>
        <Card>
          <SearchForm
            columns={StaffManageSearchColumns}
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
            onClick={() => setParams({ visible: true, currentRow: null })}
          >
            新增
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          rowKey="id"
          isPagination={true}
          fetchResultKey="list"
          totalKey="count"
          pageIndexKey="page"
          pageSizeKey="limit"
          scroll={{ x: 'max-content', y: height - 158 }}
          fetchData={getStaffManageListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <StaffModal
        params={params}
        onCancel={() => setParams({ ...params, visible: false })}
        onOk={onEditOk}
      />
    </>
  );
};

export default StaffManage;
