import React from 'react';
import DragModal from '@/components/modal/DragModal';

export type PacketAwardDetailProps = {
  params: {
    visible: boolean;
    detail: any;
  };
  onCancel: () => void;
};

const PacketAwardDetail: React.FC<PacketAwardDetailProps> = ({
  params,
  onCancel,
}) => {
  const { visible, detail } = params;
  return (
    <DragModal
      open={visible}
      onCancel={onCancel}
      title="奖励详情"
      width={{ xl: 600, xxl: 1000 }}
      // onOk={handleOk}
      // loading={loading}
    ></DragModal>
  );
};

export default PacketAwardDetail;
