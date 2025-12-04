import { useEffect, useRef, useState } from 'react';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';
import InvoiceApplyFile, {
  InvoiceApplyFileRef,
} from './components/InvoiceApplyFile';
import {
  getInvoiceApply,
  getInvoiceApplyOrderImport,
} from '@/services/capitalManage/invoiceApply/invoiceApplyApi';
import type {
  InvoiceApplyOrderImportType,
  InvoiceApplyType,
} from '@/services/capitalManage/invoiceApply/invoiceApplyModel';
import InvoiceApplyBaseInfo from './components/InvoiceApplyBaseInfo';
import InvoiceApplyOrderImport from './components/InvoiceApplyOrderImport';
import InvoiceApplyRecord, {
  InvoiceApplyRecordRef,
} from './components/InvoiceApplyRecord';

const InvoiceApplyDetail: React.FC = () => {
  const params = useParams();

  const [invoiceApplyDetail, setInvoiceApplyDetail] =
    useState<Partial<InvoiceApplyType>>();

  const [loading, setLoading] = useState<boolean>(false);

  const InvoiceApplyRecordRef = useRef<InvoiceApplyRecordRef>(null);

  const InvoiceApplyFileRef = useRef<InvoiceApplyFileRef>(null);

  const [tableData, setTableData] = useState<InvoiceApplyOrderImportType[]>([]);

  useEffect(() => {
    setLoading(true);
    init();
  }, [params.id]);

  const init = () => {
    let ID = params?.id ?? '';
    try {
      Promise.all([
        getInvoiceApply(ID),
        getInvoiceApplyOrderImport(ID),
        InvoiceApplyFileRef.current?.loadInvoiceApplyFile(ID),
        InvoiceApplyRecordRef.current?.loadInvoiceApplyRecord(ID),
      ]).then((result) => {
        setInvoiceApplyDetail(result[0].data);
        setTableData(result[1]);
      });
      setLoading(false);
    } catch {}
  };

  const refresh = (type?: string) => {
    if (type) {
      InvoiceApplyRecordRef.current?.loadInvoiceApplyRecord();
      InvoiceApplyFileRef.current?.loadInvoiceApplyFile();
    }
  };

  return (
    <>
      <Spin spinning={loading}>
        <div className="flex items-start">
          <div className="flex flex-col w-3xl">
            <InvoiceApplyBaseInfo
              invoiceApplyDetail={invoiceApplyDetail ?? {}}
            />
            <InvoiceApplyOrderImport tableData={tableData} />
          </div>
          <div className="max-w-[440px] ml-[16px] flex1">
            <InvoiceApplyFile
              ref={InvoiceApplyFileRef}
              invoiceApplyId={invoiceApplyDetail?.id as string}
              onRefresh={refresh}
            />
            <InvoiceApplyRecord
              ref={InvoiceApplyRecordRef}
              invoiceApplyId={invoiceApplyDetail?.id as string}
            />
          </div>
        </div>
      </Spin>
    </>
  );
};

export default InvoiceApplyDetail;
