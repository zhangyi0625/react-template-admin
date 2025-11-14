import DragModal from '@/components/modal/DragModal';
import { Form, Input } from 'antd';
import React, { useEffect } from 'react';

export type AuthenticationRejectModalProps = {
  params: {
    visible: boolean;
    editId: string | null;
  };
  onCancel: () => void;
  onOk: (params: { rejectReason: string }) => void;
};

const AuthenticationRejectModal: React.FC<AuthenticationRejectModalProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!params.visible) return;
    form.resetFields();
  }, [params.visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk({ ...form.getFieldsValue() });
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };

  return (
    <>
      <DragModal
        open={params.visible}
        onCancel={onCancel}
        title="拒绝原因"
        width={{ xl: 550, xxl: 1000 }}
        onOk={handleOk}
      >
        <Form form={form} labelCol={{ span: 6 }}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="rejectReason"
            rules={[
              {
                required: true,
                message: '请输入拒绝的原因',
              },
            ]}
          >
            <Input.TextArea
              placeholder="请输入拒绝的原因"
              style={{
                height: '120px',
              }}
            />
          </Form.Item>
        </Form>
      </DragModal>
    </>
  );
};

export default AuthenticationRejectModal;
