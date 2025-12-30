import { useEffect, useState } from 'react';
import DragModal from '@/components/modal/DragModal';

export type CabinMonitoringCronProps = {
  params: {
    visible: boolean;
    executeCron: string | null;
  };
  onCancel: () => void;
};

const CabinMonitoringCron: React.FC<CabinMonitoringCronProps> = ({
  params,
  onCancel,
}) => {
  const { visible } = params;

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    setLoading(false);
  }, [visible]);

  return (
    <>
      <DragModal
        width={{ xl: 850, xxl: 1000 }}
        open={visible}
        title="设置频率"
        footer={null}
        onCancel={onCancel}
        loading={loading}
      ></DragModal>
    </>
  );
};

export default CabinMonitoringCron;
