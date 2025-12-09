import React from 'react';
import { Form, Input } from 'antd';
import DragModal from '@/components/modal/DragModal';

export type FollowUpModalProps = {
  followUpModalVisible: boolean;
  onCancel: () => void;
  onOk: (params: { content: string }) => void;
};

const FollowUpModal: React.FC<FollowUpModalProps> = ({
  followUpModalVisible,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  return (
    <>
      <DragModal
        open={followUpModalVisible}
        onCancel={onCancel}
        title="跟进记录"
        width={{ xl: 600, xxl: 1000 }}
        onOk={() => onOk({ ...form.getFieldsValue() })}
      >
        <Form form={form} labelCol={{ span: 4 }}>
          <Form.Item name="content" label="跟进备注">
            <Input.TextArea
              placeholder="请输入跟进记录"
              style={{
                height: '100px',
              }}
            />
          </Form.Item>
        </Form>
      </DragModal>
    </>
  );
};

export default FollowUpModal;
