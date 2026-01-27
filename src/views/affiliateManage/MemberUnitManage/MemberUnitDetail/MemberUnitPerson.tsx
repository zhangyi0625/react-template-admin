import React, { useImperativeHandle, useState } from 'react';
import { App, Button, Space, Table, type TableProps } from 'antd';
import MemberUnitPersonModal from './MemberUnitPersonModal';
import {
  addEmployeeToCompany,
  assignCompanyMaster,
  deleteMemberUnitManage,
  editEmployeeToCompany,
  getMemberUnitManageList,
} from '@/services/affiliateManage/memberUnitManage/memberUnitManageApi';
import type { MemberUnitManageDetailType } from '@/services/affiliateManage/memberUnitManage/memberUnitManageModel';
import { getStaffManageList } from '@/services/affiliateManage/staffManage/staffManageApi';

export type MemberUnitPersonProps = {
  detail: MemberUnitManageDetailType | null;
};

export type MemberUnitPersonRef = {
  onRefresh: () => void;
};

const MemberUnitPerson = React.forwardRef<
  MemberUnitPersonRef,
  MemberUnitPersonProps
>(({ detail }, ref) => {
  const { message } = App.useApp();

  const [tableData, setTableData] = useState<TableProps['dataSource']>([]);

  const [params, setParams] = useState<{
    visible: boolean;
    type: 'add' | 'edit' | 'setting';
  }>({
    visible: false,
    type: 'add',
  });

  const columns: TableProps['columns'] = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
      align: 'center',
    },
    {
      title: '用户手机号',
      dataIndex: 'phone',
      width: 120,
      align: 'center',
    },
    {
      title: '是否为管理员',
      width: 120,
      align: 'center',
      render(value) {
        return <div>{value.companyMaster ? '是' : '否'}</div>;
      },
    },
    {
      title: '职位',
      dataIndex: 'position',
      width: 120,
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 120,
      align: 'center',
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
              danger
              size="small"
              onClick={() => deleteItem(_.id)}
            >
              删除
            </Button>
          </Space>
        );
      },
    },
  ];

  const deleteItem = async (id: string) => {
    await deleteMemberUnitManage(id);
    message.success('删除成功～');
    refresh();
  };

  useImperativeHandle(ref, () => ({
    onRefresh: () => refresh(),
  }));

  const refresh = async () => {
    // setBaseInfo([]);
    console.log('刷新MemberUnitPerson');
    try {
      const resp = await getStaffManageList({
        companyId: detail?.id as string,
      });
      setTableData(resp);
    } catch {}
  };

  const onEditOk = async (
    routeRow: { customerId: string } | { customerIds: string },
  ) => {
    try {
      if (params.type === 'setting') {
        await assignCompanyMaster(
          (routeRow as { customerId: string }).customerId,
        );
      } else {
        params.type === 'add'
          ? await addEmployeeToCompany({
              companyId: detail?.id as string,
              customerIds: [(routeRow as { customerIds: string }).customerIds],
            })
          : await editEmployeeToCompany({
              companyId: detail?.id as string,
              customerIds: [(routeRow as { customerIds: string }).customerIds],
            });
      }
      // 操作成功，关闭弹窗，刷新数据
      message.success(
        params.type === 'add' || params.type === 'setting'
          ? '添加成功'
          : '修改成功',
      );
      setParams({ visible: false, type: 'add' });
      refresh();
    } catch (error) {}
  };
  return (
    <>
      <Space className="mb-[8px]">
        <Button
          type="primary"
          onClick={() => setParams({ visible: true, type: 'add' })}
        >
          添加企业成员
        </Button>
        <Button
          type="primary"
          onClick={() => setParams({ visible: true, type: 'setting' })}
        >
          设置管理员
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowKey={() => Math.random().toString(36).substring(2)}
      />
      <MemberUnitPersonModal
        visible={params.visible}
        type={params.type}
        onOk={onEditOk}
        onCancel={() => setParams({ visible: false, type: 'add' })}
      />
    </>
  );
});

export default MemberUnitPerson;
