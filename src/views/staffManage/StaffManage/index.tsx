import { useState } from 'react';
import {
  Button,
  Card,
  ConfigProvider,
  Space,
  Switch,
  type TableProps,
  type TablePaginationConfig,
  App,
} from 'antd';
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import modal from 'antd/es/modal';
import { SearchForm, SearchTable } from 'customer-search-form-table';
import useParentSize from '@/hooks/useParentSize';
import type {
  SysStaffParams,
  SysStaffResetPasswordType,
  SysStaffType,
} from '@/services/staffManage/staffManageModel';
import {
  addStaffList,
  deleteStaffList,
  editStaffList,
  getStaffListByPage,
  updateStaffPassword,
} from '@/services/staffManage/staffManageApi';
import AddStaff from './AddStaff';
import ResetStaffPassword from './ResetStaffPassword';
import { filterKeys } from '@/utils/tool';
import { SelectStaffOptions } from '../config';
import { updateSearchFilter } from '@/utils/filter';

const StaffManage: React.FC = () => {
  const { message } = App.useApp();

  const { parentRef, height } = useParentSize();

  const [params, setParams] = useState<{
    visible: boolean;
    editRow: SysStaffType | null;
  }>({
    visible: false,
    editRow: null,
  });

  const [searchDefaultForm, setSearchDefaultForm] = useState<SysStaffParams>({
    pageIndex: 1,
    pageSize: 10,
    filter: {},
  });

  const [resetPassword, setResetPassword] = useState<{
    visible: boolean;
    currentRow: (SysStaffType & SysStaffResetPasswordType) | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const columns: TableProps['columns'] = [
    {
      title: '员工名称',
      dataIndex: 'name',
      width: 100,
      align: 'center',
      hidden: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 100,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 150,
      align: 'center',
    },
    {
      title: '部门',
      key: 'roleName',
      align: 'center',
      dataIndex: 'roleName',
    },
    {
      title: '状态',
      key: 'valid',
      align: 'center',
      render(value) {
        return (
          <Switch
            value={Boolean(value.valid)}
            checkedChildren="可用"
            unCheckedChildren="禁用"
            onChange={(e) => switchChange(e, value)}
          />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      align: 'center',
      width: 200,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      align: 'center',
      render(_) {
        return (
          <Space size={0}>
            <Button
              type="link"
              size="small"
              onClick={() => setParams({ visible: true, editRow: _ })}
            >
              编辑
            </Button>
            <Button
              onClick={() => deleteItem(_.id)}
              color="danger"
              variant="link"
            >
              删除
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() =>
                setResetPassword({
                  visible: true,
                  currentRow: _,
                })
              }
            >
              重置密码
            </Button>
          </Space>
        );
      },
    },
  ];

  const switchChange = (e: boolean, row: SysStaffType) => {
    editStaffList({ ...row, valid: Number(e) }, row.id as string).then(() => {
      onUpdateSearch(searchDefaultForm);
    });
  };

  const onUpdateSearch = (info?: SysStaffParams | unknown) => {
    updateSearchFilter(
      searchDefaultForm,
      setSearchDefaultForm,
      ['pageIndex', 'pageSize'],
      info,
    );
  };

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    });
  };

  /**
   * 点击确定的回调
   * @param roleData 角色数据
   */
  const onEditOk = async (editRow: SysStaffType) => {
    try {
      if (params.editRow == null) {
        // 新增数据
        await addStaffList(editRow);
      } else {
        // 编辑数据
        await editStaffList(editRow, editRow.id as string);
      }
      message.success(!editRow?.id ? '添加成功～' : '修改成功～');
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, editRow: null });
      setSearchDefaultForm({ ...searchDefaultForm });
    } catch (error) {
      // setParams({ visible: false, editRow: null });
    }
  };

  const deleteItem = (id: string) => {
    modal.confirm({
      title: '删除员工',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该员工吗？数据删除后将无法恢复！',
      onOk() {
        deleteStaffList(id).then(() => {
          message.success('删除成功～');
          // 刷新表格数据
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  const resetStaffPassword = (
    row: SysStaffType & SysStaffResetPasswordType,
  ) => {
    modal.confirm({
      title: `重置${row.username}的密码`,
      icon: <ExclamationCircleFilled />,
      content: `确定重置${row.username}的密码吗？数据重置后将无法恢复！`,
      onOk() {
        updateStaffPassword({
          ...filterKeys(
            row,
            ['phone', 'password', 'verifyCode', 'verifyKey'],
            true,
          ),
        }).then(() => {
          message.success('重置成功');
          setResetPassword({ visible: false, currentRow: null });
          // 刷新表格数据
          setSearchDefaultForm({ ...searchDefaultForm });
        });
      },
    });
  };

  return (
    <>
      {/* 菜单检索条件栏 */}
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
            columns={SelectStaffOptions}
            gutterWidth={24}
            iconHidden={true}
            labelPosition="left"
            btnSeparate={true}
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
        {/* 操作按钮 */}
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setParams({ visible: true, editRow: null })}
          >
            新增员工
          </Button>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          style={{ marginTop: '8px' }}
          pageIndexKey="pageIndex"
          pageSizeKey="pageSize"
          bordered
          scroll={{ x: 'max-content', y: height - 158 }}
          rowKey="id"
          totalKey="total"
          fetchResultKey="entries"
          isPagination={true}
          fetchData={getStaffListByPage}
          searchFilter={searchDefaultForm}
          isSelection={false}
          onUpdatePagination={onUpdatePagination}
        />
      </Card>
      <AddStaff
        open={params}
        onCancel={() => setParams({ visible: false, editRow: null })}
        onOk={onEditOk}
      />
      <ResetStaffPassword
        params={resetPassword}
        onCancel={() => setResetPassword({ visible: false, currentRow: null })}
        onOk={resetStaffPassword}
      />
    </>
  );
};

export default StaffManage;
