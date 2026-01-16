import { useEffect, useState } from 'react';
import DragModal from '@/components/modal/DragModal';
import { getBrashBoxManageDetail } from '@/services/brashBoxManage/brashBoxList/brashBoxListApi';
import type { BrashBoxListType } from '@/services/brashBoxManage/brashBoxList/brashBoxListModel';

export interface BrashBoxShapeCodeProps {
  params: {
    visible: boolean;
    currentRow: BrashBoxListType['task'] | null;
  };
  onCancel: () => void;
}

const BrashBoxShapeCode: React.FC<BrashBoxShapeCodeProps> = ({
  params,
  onCancel,
}) => {
  const { visible, currentRow } = params;

  const [loading, setLoading] = useState(false);

  const [shapeCode, setShapeCode] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    setShapeCode([]);
    init();
  }, [visible]);

  const init = async () => {
    try {
      const resp = await getBrashBoxManageDetail(currentRow?.id ?? '');
      resp.details.map((item: { barcodes: string }) => {
        setShapeCode([...new Set(shapeCode.concat(item.barcodes.split(',')))]);
      });
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };
  return (
    <>
      <DragModal
        width="40%"
        open={visible}
        title={'有效条形码'}
        footer={null}
        onCancel={onCancel}
        loading={loading}
      >
        {shapeCode.map((item) => (
          <div className="text-gray-900 text-sm mb-[20px]" key={item}>
            {item}
          </div>
        ))}
      </DragModal>
    </>
  );
};

export default BrashBoxShapeCode;
