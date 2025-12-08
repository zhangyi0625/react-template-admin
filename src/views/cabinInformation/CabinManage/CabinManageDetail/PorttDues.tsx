import React, { useEffect, useMemo, useState } from 'react';
import { Table, type TableProps } from 'antd';
import type { CabinManageType } from '@/services/cabinInformation/cabinManage/cabinManageModel';
import { loadAdditionalCharges } from '@/utils/freight';
import { AdditionalChargesModule } from '@/utils/freight/type';

export type PortDuesProps = {
  type: string;
  priceDetails: CabinManageType['priceDetails'];
};

const PortDues: React.FC<PortDuesProps> = ({ type, priceDetails }) => {
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const [tableData, setTableData] =
    useState<
      Pick<
        AdditionalChargesModule,
        'oceanFreight' | 'porPriceList' | 'fndPriceList'
      >
    >();

  const title = useMemo(() => {
    return type === 'porDues'
      ? '起运港费用'
      : type === 'fndDues'
      ? '目的港费用'
      : '海运附加费';
  }, [type]);

  useEffect(() => {
    setTableLoading(true);
    priceDetails.length && integratedData();
  }, [priceDetails]);

  const getCtnTypeColumns = () => {
    const ctnTypeOptions = ['20GP', '40GP', '40HQ', '45HQ', '40RQ'];
    return ctnTypeOptions.map((i) => {
      return {
        title: i,
        dataIndex: i,
        align: 'center',
        width: 100,
      };
    });
  };

  const columns: TableProps['columns'] = [
    {
      title: title,
      dataIndex: 'chargeName',
      align: 'center',
      // width: 450,
    },
    ...((getCtnTypeColumns() as TableProps['columns']) ?? []),
    {
      title: '单位',
      dataIndex: 'chargeType',
      align: 'center',
    },
  ];

  const integratedData = () => {
    let items = priceDetails.map((i) => {
      return {
        ...i,
        basePrice: i.basePrice,
        costDetailList: i.costDetail,
        ctnType: i.ctnType,
        dndDetailList: i.dndDetail,
      };
    });
    setTableLoading(false);
    const result = loadAdditionalCharges(items);
    setTableData({
      porPriceList: result?.porPriceList ?? [],
      fndPriceList: result?.fndPriceList ?? [],
      oceanFreight: result?.oceanFreight ?? [],
    });
  };
  return (
    <>
      <div className="pt-[30px]">
        <p className="text-stone-900 font-semibold text-base mb-[10px]">
          {title}
        </p>
        <Table
          rowKey={'chargeName'}
          dataSource={
            tableData?.[
              type === 'porDues'
                ? 'porPriceList'
                : type === 'fndDues'
                ? 'fndPriceList'
                : 'oceanFreight'
            ] ?? []
          }
          columns={columns}
          size="small"
          loading={tableLoading}
          pagination={false}
        />
      </div>
    </>
  );
};

export default PortDues;
