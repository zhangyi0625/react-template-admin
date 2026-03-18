import { memo, useCallback, useEffect, useState } from 'react';
import { Table, TableProps } from 'antd';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';
import type { RegularBookingDetailType } from '@/services/orderManage/regularBooking/regularBookingModel';
import { RegularBookingStatusOptions } from '../../config';
import { filterKeys } from '@/utils/tool';

export type PayMessageProps = {
  orderInfo: RegularBookingDetailType;
};

const PayMessage: React.FC<PayMessageProps> = memo(({ orderInfo }) => {
  const [tableData, setTableData] = useState([]);

  const publicData = useSelector(
    (state: RootState) => state.publicSetting.publicData,
  );

  const { paymentWay, fundRechargeStatus } = publicData;

  const { refundStatus } = RegularBookingStatusOptions;

  const keys = [
    'id',
    'orderNo',
    'totalAmount',
    'couponAmount',
    'payType',
    'payTime',
    'payStatus',
    'refundTime',
    'payAmount',
    'refundStatus',
    'refundNote',
  ];

  const columns: TableProps['columns'] = [
    {
      title: '总服务费(元)',
      align: 'center',
      render(value) {
        return getAmount(value.totalAmount);
      },
    },
    {
      title: '优惠金额(元)',
      align: 'center',
      render(value) {
        return getAmount(value.couponAmount);
      },
    },
    {
      title: '支付金额(元)',
      align: 'center',
      render(value) {
        return getAmount(value.payAmount);
      },
    },
    {
      title: '支付状态',
      key: 'payStatus',
      align: 'center',
      render(value) {
        return paymentWay[value.payStatus];
      },
    },
    {
      title: '付款类型',
      align: 'center',
      render(value) {
        return fundRechargeStatus[value.payType];
      },
    },
    {
      dataIndex: 'payTime',
      title: '支付时间',
      align: 'center',
    },
    {
      title: '退款状态',
      align: 'center',
      render(value) {
        return refundStatus[value.refundStatus];
      },
    },
    {
      title: '退款时间',
      key: 'refundTime',
      dataIndex: 'refundTime',
      align: 'center',
    },
    {
      dataIndex: 'refundNote',
      key: 'refundNote',
      align: 'center',
    },
  ];
  useEffect(() => {
    const filteredObj = filterKeys(orderInfo, keys, true);
    setTableData([filteredObj] as never[]);
  }, []);

  const getAmount = useCallback((value: string) => {
    return (Number(value) / 100).toFixed(2);
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      rowKey={'id'}
      pagination={false}
      scroll={{ x: 'max-content' }}
    />
  );
});

export default PayMessage;
