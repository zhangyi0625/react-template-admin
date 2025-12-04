import React from 'react';
import { Divider, SelectProps } from 'antd';
import { InvoiceApplyType } from '@/services/capitalManage/invoiceApply/invoiceApplyModel';
import { changeSelectOptionsByLabel } from '@/utils/options';

export type InvoiceApplyBaseInfoProps = {
  invoiceApplyDetail: Partial<InvoiceApplyType>;
};

const baseOptions: SelectProps['options'] = [
  {
    label: '开票金额',
    value: 'amount',
  },
  {
    label: '发票抬头',
    value: 'invoiceTitle',
  },
  {
    label: '发票税号',
    value: 'taxId',
  },
  {
    label: '邮箱',
    value: 'email',
  },
  {
    label: '申请时间',
    value: 'created',
  },
  {
    label: '所属公司',
    value: 'affiliateName',
  },
  {
    label: '操作人',
    value: 'customerName',
  },
  {
    label: '手机号',
    value: 'customerPhone',
  },
];

const InvoiceApplyBaseInfo: React.FC<InvoiceApplyBaseInfoProps> = ({
  invoiceApplyDetail,
}) => {
  let statusOptions = changeSelectOptionsByLabel(['待开票', '已开票']);

  return (
    <>
      <div className="p-[20px] bg-white rounded-[6px] w-full text-stone-800">
        <p className="text-2xl font-semibold">
          {
            statusOptions?.find(
              (item) => Boolean(item.value) === invoiceApplyDetail?.status
            )?.label
          }
        </p>
        <div className="flex items-center text-sm font-medium mt-[10px]">
          <div>开票金额：¥{invoiceApplyDetail?.amount}</div>
          <div className="ml-[30px]">
            发票抬头：{invoiceApplyDetail?.invoiceTitle}
          </div>
        </div>
        <Divider />
        <div className="grid grid-cols-2 gap-[20px]">
          {baseOptions.map((item) => (
            <div key={item.value} className="text-sm font-normal">
              <span className="text-gray-500">{item.label}</span>：
              {invoiceApplyDetail?.[item.value as string]}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InvoiceApplyBaseInfo;
