import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table, type TableProps } from 'antd';
import type { CabinManageType } from '@/services/cabinInformation/cabinManage/cabinManageModel';
import { getCabinManageServiceFee } from '@/services/cabinInformation/cabinManage/cabinManageApi';
import { FreightBoxFeeType } from '@/utils/freight/type';

export type CurrentCabinDetailProps = {
  tableData: CabinManageType['priceDetails'];
  type: 'BK02' | 'BK03';
};

const CurrentCabinDetail: React.FC<CurrentCabinDetailProps> = ({
  tableData,
  type,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [serviceFee, setServiceFee] = useState<
    { type: string; customerLevel: number }[] &
      Pick<FreightBoxFeeType, 'standard' | 'bond'>[]
  >();

  const settingFeeRules = () => {
    // Todo:需要先实现其他设置中  服务费保证金管理列表
    console.log('设置费用规则');
  };

  useEffect(() => {
    setLoading(true);
    init();
  }, []);

  const init = async () => {
    try {
      const resp = await getCabinManageServiceFee({
        service: 'BOOKING',
      });
      setServiceFee(resp?.items ?? []);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const getServiceFeff = useCallback(
    (key: string, customerType: string) => {
      const item = (serviceFee || []).find(
        (i) =>
          i.type === type &&
          i.customerLevel === (customerType === 'MEMBER' ? 5 : 1)
      );
      return (item as any)?.[key] ?? 0;
    },
    [serviceFee]
  );

  const columns: TableProps['columns'] = [
    {
      title: '柜型',
      dataIndex: 'ctnType',
      align: 'center',
    },
    {
      title: '运价（USD）',
      dataIndex: 'totalPrice',
      align: 'center',
    },
    {
      title: '库存数量',
      dataIndex: 'inventory',
      align: 'center',
    },
    {
      title: '服务费(普通用户)',
      align: 'center',
      render(_) {
        return <div>{getServiceFeff('standard', 'NORMAL')}</div>;
      },
    },
    {
      title: '服务费(会员)',
      align: 'center',
      render(_) {
        return <div>{getServiceFeff('standard', 'MEMBER')}</div>;
      },
    },
    {
      title: '保证金(普通用户)',
      align: 'center',
      render(_) {
        return <div>{getServiceFeff('bond', 'MEMBER')}</div>;
      },
    },
    {
      title: '保证金(会员)',
      align: 'center',
      render(_) {
        return <div>{getServiceFeff('bond', 'MEMBER')}</div>;
      },
    },
  ];
  return (
    <>
      <div className="pt-[30px]">
        <div className="flex items-center justify-between mb-[10px]">
          <p className="text-stone-900 font-semibold text-base">现舱明细</p>
          <Button type="default" onClick={settingFeeRules}>
            设置费用规则
          </Button>
        </div>
        <Table
          dataSource={tableData}
          columns={columns}
          rowKey="ctnType"
          size="small"
          loading={loading}
          pagination={false}
        />
      </div>
    </>
  );
};

export default CurrentCabinDetail;
