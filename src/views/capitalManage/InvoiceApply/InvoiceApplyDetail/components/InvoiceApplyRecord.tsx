import React, { useImperativeHandle, useState } from 'react';
import { Timeline } from 'antd';
import styles from '@/views/marketManage/AffiliateManage/AffiliateManage.module.scss';
import { getInvoiceApplyRecord } from '@/services/capitalManage/invoiceApply/invoiceApplyApi';

export type InvoiceApplyRecordProps = {
  invoiceApplyId: string;
};

export type InvoiceApplyRecordRef = {
  loadInvoiceApplyRecord: (invoiceApplyId?: string) => Promise<void>;
};

type InvoiceApplyRecordType = {
  content: string;
  created: string;
  operator: string;
  operatorId: number;
};

const InvoiceApplyRecord = React.forwardRef<
  InvoiceApplyRecordRef,
  InvoiceApplyRecordProps
>(({ invoiceApplyId }, ref) => {
  const [InvoiceApplyRecord, setInvoiceApplyRecord] =
    useState<InvoiceApplyRecordType[]>();

  useImperativeHandle(ref, () => ({
    loadInvoiceApplyRecord: async (id?: string) => {
      await getInvoiceApplyRecord(id || invoiceApplyId).then((res) => {
        setInvoiceApplyRecord(res);
      });
    },
  }));

  const getTimeLineInfo = (info: InvoiceApplyRecordType[]) => {
    const items = info.map((item) => {
      return {
        children: (
          <>
            <p className="text-dull-grey">{item.created}</p>
            <p className="text-light-grey">{item.content}</p>
          </>
        ),
        dot: (
          <div
            className="rounded-[16px] text-blue-500 font-semibold w-fit h-[32px] leading-[32px] text-center"
            style={{ background: '#F5F7FA' }}
          >
            {item.operator}
          </div>
        ),
      };
    });
    return (
      <div className="p-[20px] bg-white rounded-[6px] mt-[20px] w-full">
        <p className={styles['basic-title']}>操作记录</p>
        <Timeline items={items} />
      </div>
    );
  };

  return <>{getTimeLineInfo(InvoiceApplyRecord || [])}</>;
});

export default InvoiceApplyRecord;
