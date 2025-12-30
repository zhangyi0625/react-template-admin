import type { TableProps } from 'antd';

export const PacketRecordColumns: TableProps['columns'] = [
  {
    title: '用户名称',
    key: 'name',
  },
  {
    title: '用户手机号',
    key: 'phone',
  },
  {
    title: '发放金额',
    key: 'amount',
  },
  {
    title: '发放时间',
    key: 'createDate',
  },
];
