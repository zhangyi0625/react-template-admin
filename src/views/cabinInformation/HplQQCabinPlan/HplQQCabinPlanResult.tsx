import React, { useEffect, useState } from 'react';
import { Table, type TableProps } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { HplQQCabinPlanSearchResultType } from '@/services/cabinInformation/hplQQCabinPlan/hplQQCabinPlanModel';
import { getHplQQCabinPlanResult } from '@/services/cabinInformation/hplQQCabinPlan/hplQQCabinPlanApi';
import { formatTime } from '@/utils/format';

export type HplQQCabinPlanResultProps = {
  params: {
    visible: boolean;
    currentRow: HplQQCabinPlanSearchResultType | null;
  };
  onCancel: () => void;
};

type HplQQCabinPlanResultTableData = {
  id: string;
  bookingNo: string;
  bookedBy: string;
  etd: string;
  vesselName: string;
  voyNo: string;
  bookedTime: string;
};

const HplQQCabinPlanResult: React.FC<HplQQCabinPlanResultProps> = ({
  params,
  onCancel,
}) => {
  const { visible, currentRow } = params;

  const [tableData, setTableData] = useState<HplQQCabinPlanResultTableData[]>(
    []
  );

  useEffect(() => {
    if (!visible) return;
    loadHplQQCabinPlanResult();
  }, [visible]);

  const columns: TableProps['columns'] = [
    {
      title: '订舱账号',
      align: 'center',
      width: 220,
      dataIndex: 'bookingNo',
    },
    {
      title: '订舱号',
      align: 'center',
      width: 180,
      dataIndex: 'bookedBy',
    },
    {
      title: 'ETD',
      align: 'center',
      width: 180,
      render: (value) => {
        return formatTime(value.etd, 'Y-M-D');
      },
    },
    {
      title: '船名航次',
      align: 'center',
      width: 220,
      render(value) {
        return (
          <div>
            {value.vesselName} / {value.voyNo}
          </div>
        );
      },
    },
    {
      title: '订舱时间',
      align: 'center',
      width: 220,
      dataIndex: 'bookedTime',
    },
  ];

  const loadHplQQCabinPlanResult = async () => {
    try {
      const resp = await getHplQQCabinPlanResult(currentRow?.id ?? '');
      let items = resp.data.items[0].details;
      let productInfo = resp.data.bookingInfo.productInfo;
      let params: HplQQCabinPlanResultTableData = {
        id: resp.data.id ?? '',
        bookingNo: items[0].bookingNo,
        bookedBy: items[0].bookedBy,
        etd: productInfo.etd,
        vesselName: productInfo.vesselName,
        voyNo: productInfo.voyNo,
        bookedTime: items[0].bookedTime,
      };
      setTableData([params]);
    } catch {
      setTableData([]);
    }
  };
  return (
    <DragModal
      width={{ xl: 800, xxl: 1000 }}
      open={visible}
      title="订舱结果"
      onCancel={onCancel}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowKey={'id'}
      />
    </DragModal>
  );
};

export default HplQQCabinPlanResult;
