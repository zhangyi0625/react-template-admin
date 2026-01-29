import React, { useEffect, useImperativeHandle, useState } from 'react';
import { App, Button, Space, Table, type TableProps } from 'antd';
import type {
  CompanyMemberRecordType,
  MemberUnitManageDetailType,
} from '@/services/affiliateManage/memberUnitManage/memberUnitManageModel';
import { formatTime } from '@/utils/format';
import {
  addCompanyMemberRecord,
  deleteCompanyMemberRecord,
  editCompanyMemberRecord,
  getCompanyMemberRecord,
} from '@/services/affiliateManage/memberUnitManage/memberUnitManageApi';
import MemberUnitRecordModal from './MemberUnitRecordModal';

export type MemberUnitRecordProps = {
  detail: MemberUnitManageDetailType | null;
};

export type MemberUnitRecordRef = {
  onRefresh: () => void;
};

const MemberUnitRecord = React.forwardRef<
  MemberUnitRecordRef,
  MemberUnitRecordProps
>(({ detail }, ref) => {
  const { message } = App.useApp();

  const [tableData, setTableData] = useState<TableProps['dataSource']>([]);

  const [params, setParams] = useState<{
    visible: boolean;
    currentRow: CompanyMemberRecordType | null;
  }>({
    visible: false,
    currentRow: null,
  });

  const columns: TableProps['columns'] = [
    {
      title: '入会年月',
      width: 120,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.enrollmentDate, 'Y-M')}</div>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 120,
      align: 'center',
    },
    // {
    //   title: '修改人',
    //   dataIndex: 'position',
    //   width: 120,
    //   align: 'center',
    // },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      width: 180,
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
              size="small"
              onClick={() => setParams({ visible: true, currentRow: _ })}
            >
              修改
            </Button>
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
    await deleteCompanyMemberRecord(id);
    message.success('删除成功～');
    refresh();
  };

  useImperativeHandle(ref, () => ({
    onRefresh: () => refresh(),
  }));

  useEffect(() => {
    if (detail?.id) {
      refresh();
    }
  }, [detail?.id]);

  const refresh = async () => {
    try {
      const resp = await getCompanyMemberRecord(detail?.id as string);
      setTableData(resp);
    } catch {}
  };

  const onEditOk = async (routeRow: CompanyMemberRecordType) => {
    try {
      let info = {
        ...routeRow,
        companyId: detail?.id as string,
      };
      if (routeRow.id == null) {
        // 新增数据
        await addCompanyMemberRecord(info);
      } else {
        // 编辑数据
        await editCompanyMemberRecord(info);
      }
      // 操作成功，关闭弹窗，刷新数据
      message.success(!routeRow.id ? '添加成功' : '修改成功');
      setParams({ visible: false, currentRow: null });
      refresh();
    } catch (error) {}
  };
  return (
    <>
      <Space className="mb-[8px]">
        <Button
          type="primary"
          onClick={() => setParams({ visible: true, currentRow: null })}
        >
          添加记录
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowKey={() => Math.random().toString(36).substring(2)}
      />
      <MemberUnitRecordModal
        visible={params.visible}
        currentRow={params.currentRow}
        onCancel={() => setParams({ ...params, visible: false })}
        onOk={onEditOk}
      />
    </>
  );
});

export default MemberUnitRecord;
