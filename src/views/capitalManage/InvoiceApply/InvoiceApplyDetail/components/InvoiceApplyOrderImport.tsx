import React from 'react';
import { Table, TableProps } from 'antd';
import styles from '@/views/marketManage/AffiliateManage/AffiliateManage.module.scss';
import type { InvoiceApplyOrderImportType } from '@/services/capitalManage/invoiceApply/invoiceApplyModel';
import { formatTime } from '@/utils/format';

export type InvoiceApplyOrderImportProps = {
  tableData: InvoiceApplyOrderImportType[];
};

const InvoiceApplyOrderImport: React.FC<InvoiceApplyOrderImportProps> = ({
  tableData,
}) => {
  const columns: TableProps['columns'] = [
    {
      title: '用户名',
      dataIndex: 'customerName',
      width: 150,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'customerPhone',
      width: 120,
      align: 'center',
    },
    {
      title: '交易金额',
      dataIndex: 'amount',
      width: 120,
      align: 'center',
    },
    {
      title: '交易创建时间',
      width: 220,
      align: 'center',
      render(value) {
        return <div>{formatTime(value.created, 'Y/M/D h:m:s')}</div>;
      },
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      align: 'center',
    },
  ];

  return (
    <>
      <div className="p-[20px] bg-white rounded-[6px] mt-[20px] w-full">
        <p className={styles['basic-title']}>该发票包含以下订单</p>
        <Table
          columns={columns}
          dataSource={tableData ?? []}
          rowKey={'id'}
          pagination={false}
        />
      </div>
    </>
  );
};

export default InvoiceApplyOrderImport;
