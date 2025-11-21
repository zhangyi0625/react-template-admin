import { memo } from 'react';
import DragModal from '@/components/modal/DragModal';
import { Table, TableProps } from 'antd';

type CarrierAccountsType = {
  name: string;
  username: string;
  affiliate: string;
  password: string;
  payPassword: string;
};

export type OrderAccountModalProps = {
  params: {
    visible: boolean;
    editRow: CarrierAccountsType[];
  };
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const OrderAccountModal: React.FC<OrderAccountModalProps> = memo(
  ({ params, onCancel }) => {
    const columns: TableProps['columns'] = [
      {
        dataIndex: 'name',
        title: '船司',
        align: 'center',
      },
      {
        dataIndex: 'username',
        title: '登录名',
        align: 'center',
      },
      {
        dataIndex: 'affiliate',
        title: '公司名称',
        align: 'center',
      },
      {
        dataIndex: 'password',
        title: '登陆密码',
        align: 'center',
      },
      {
        dataIndex: 'payPassword',
        title: '支付密码',
        align: 'center',
      },
    ];
    return (
      <DragModal
        title="订舱账号"
        width="800px"
        open={params.visible}
        onCancel={onCancel}
        footer={null}
      >
        <Table
          columns={columns}
          dataSource={params.editRow}
          pagination={false}
          rowKey="username"
          bordered
        />
      </DragModal>
    );
  }
);

export default OrderAccountModal;
