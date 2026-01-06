import { useEffect } from 'react';
import DragModal from '@/components/modal/DragModal';

export type QuickEnquiryOrderModalProps = {
  params: {
    visible: boolean;
    content: string;
  };
  onCancel: () => void;
};

const QuickEnquiryOrderModal: React.FC<QuickEnquiryOrderModalProps> = ({
  params,
  onCancel,
}) => {
  const { visible, content } = params;

  useEffect(() => {
    if (!visible) return;
  }, [visible]);

  return (
    <DragModal
      open={visible}
      onCancel={onCancel}
      title="回复内容"
      width={{ xl: 900, xxl: 1000 }}
      footer={null}
    >
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </DragModal>
  );
};

export default QuickEnquiryOrderModal;
