import React, { useEffect, useState } from 'react';
import { Table, TableProps } from 'antd';
import DragModal from '@/components/Modal/DragModal';
import { getAuthenticationManageDetail } from '@/services/marketManage/authenticationManage/authenticationManageApi';

export type AuthenticationDetailModalProps = {
  params: {
    visible: boolean;
    editId: string | null;
  };
  onCancel: () => void;
};

const AuthenticationDetailModal: React.FC<AuthenticationDetailModalProps> = ({
  params,
  onCancel,
}) => {
  const { visible, editId } = params;

  const [detailInfo, setDetailInfo] = useState<
    { id: string; old: unknown; new: unknown }[]
  >([]);

  useEffect(() => {
    if (!visible) return;
    init();
  }, [visible]);

  const init = async () => {
    try {
      const resp = await getAuthenticationManageDetail(editId as string);
      setDetailInfo([
        {
          id: Math.random().toString(),
          old: resp.old,
          new: resp.new,
        },
      ]);
    } catch {
      setDetailInfo([]);
    }
  };

  const columns: TableProps['columns'] = [
    {
      title: '变更前',
      width: '50%',
      align: 'left',
      render(_) {
        return (
          <div className="text-sm font-medium text-gray-600 leading-[30px]">
            <h4>{_.old.customer_name}</h4>
            <h6>固定电话：{_.old.telephone}</h6>
            <h6>邮箱：{_.old.email}</h6>
            <h6>地址：{_.old.address}</h6>
            <h6>业务优势：{_.old.advantage_business_name}</h6>
            <h6>优势起运港：{_.old.advantage_startport_name}</h6>
            <h6>优势船司：{_.old.advantage_carrier_name}</h6>
            <h6>优势航线：{_.old.advantage_freight_name}</h6>
            <p>企业简介：{_.old.customer_info}</p>
          </div>
        );
      },
    },
    {
      title: '变更后',
      width: '50%',
      align: 'left',
      render(_) {
        return (
          <div className="text-sm font-medium text-gray-600 leading-[30px]">
            <h4>{_.new.customer_name}</h4>
            <h6>固定电话：{_.new.telephone}</h6>
            <h6>邮箱：{_.new.email}</h6>
            <h6>地址：{_.new.address}</h6>
            <h6>业务优势：{_.new.advantage_business_name}</h6>
            <h6>优势起运港：{_.new.advantage_startport_name}</h6>
            <h6>优势船司：{_.new.advantage_carrier_name}</h6>
            <h6>优势航线：{_.new.advantage_freight_name}</h6>
            <p>企业简介：{_.new.customer_info}</p>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DragModal
        open={visible}
        onCancel={onCancel}
        title="变更详情"
        width={{ xl: 900, xxl: 1000 }}
        footer={null}
      >
        <Table
          columns={columns}
          dataSource={detailInfo}
          bordered
          rowKey="id"
          size="small"
          pagination={false}
        ></Table>
      </DragModal>
    </>
  );
};

export default AuthenticationDetailModal;
