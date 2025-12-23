import React, { useEffect, useState } from 'react';
import { Table, type TableProps } from 'antd';
import DragModal from '@/components/modal/DragModal';
import {
  getCouponManageDetail,
  getCouponManageUseDetail,
} from '@/services/otherSetting/couponManage/couponManageApi';
import type { CouponManageEditType } from '@/services/otherSetting/couponManage/couponManageModel';

export type CouponProvideDetailModalProps = {
  params: {
    visible: boolean;
    currentRow: CouponManageEditType | null;
  };
  onCancel: () => void;
};

const CouponProvideDetailModal: React.FC<CouponProvideDetailModalProps> = ({
  params,
  onCancel,
}) => {
  const { visible, currentRow } = params;

  const [loading, setLoading] = useState<boolean>(false);

  const [tableData, setTableData] = useState([]);

  const [visibleUseDetail, setVisibleUseDetail] = useState<{
    visible: boolean;
    tableData: TableProps['dataSource'];
  }>({
    visible: false,
    tableData: [],
  });

  const columns: TableProps['columns'] = [
    {
      title: '企业名称',
      dataIndex: 'affiliateName',
      width: 150,
      align: 'center',
    },
    {
      title: '用户名称',
      dataIndex: 'customerName',
      width: 150,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'customerPhone',
      width: 150,
      align: 'center',
    },
    {
      title: '发放数量',
      dataIndex: 'receiveNum',
      width: 100,
      align: 'center',
    },
    {
      title: '发放时间',
      dataIndex: 'created',
      width: 180,
      align: 'center',
    },
    {
      title: '发放时间',
      width: 100,
      align: 'center',
      render(value) {
        return (
          <div
            className="text-blue-500 cursor-pointer font-semibold underline"
            onClick={() =>
              loadCouponManageUseDetail({
                customerId: value?.customerId as string,
                created: value?.created as string,
              })
            }
          >
            {value.usedNum ?? 0}
          </div>
        );
      },
    },
  ];

  const CouponUseDetailColumns: TableProps['columns'] = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      width: 150,
      align: 'center',
    },
    {
      title: '操作用户',
      dataIndex: 'customerName',
      width: 150,
      align: 'center',
    },
    {
      title: '使用数量',
      dataIndex: 'count',
      align: 'center',
    },
    {
      title: '使用时间',
      dataIndex: 'used',
      width: 200,
      align: 'center',
    },
  ];

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    loadDetail();
  }, [visible]);

  const loadDetail = async () => {
    try {
      const res = await getCouponManageDetail(currentRow?.id as string);
      setTableData(res || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const loadCouponManageUseDetail = async (
    row: Pick<CouponManageEditType, 'created' | 'customerId'>
  ) => {
    try {
      const res = await getCouponManageUseDetail({
        created: row.created,
        customerId: row.customerId,
      });
      setVisibleUseDetail({ visible: true, tableData: res || [] });
    } catch (error) {}
  };

  const showUseDetail = () => {
    return (
      <DragModal
        open={visibleUseDetail.visible}
        onCancel={() => setVisibleUseDetail({ visible: false, tableData: [] })}
        title="使用情况"
        width={{ xl: 600, xxl: 1000 }}
        footer={null}
      >
        <Table
          columns={CouponUseDetailColumns}
          dataSource={visibleUseDetail.tableData}
          pagination={false}
          rowKey={() => Math.random().toString()}
        />
      </DragModal>
    );
  };

  return (
    <DragModal
      open={visible}
      onCancel={onCancel}
      title="发放详情"
      width={{ xl: 880, xxl: 1000 }}
      footer={null}
      loading={loading}
    >
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowKey={() => Math.random().toString()}
      />
      {visibleUseDetail.visible && showUseDetail()}
    </DragModal>
  );
};

export default CouponProvideDetailModal;
