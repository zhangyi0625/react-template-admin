import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import DragModal from '@/components/modal/DragModal';

export type FastBookingResultNoticeProps = {
  params: {
    visible: boolean;
    editId: string | null;
  };
  onOk: (remark: string) => void;
  onCancel: () => void;
};

export const FastBookingResultNotice: React.FC<
  FastBookingResultNoticeProps
> = ({ params, onCancel, onOk }) => {
  const { visible, editId } = params;

  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;
    else {
      form.setFieldsValue({ id: editId });
    }
  }, [visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk(form.getFieldValue('remark'));
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
        open={visible}
        width={'40%'}
        title="结果通知"
        onOk={handleOk}
        onCancel={onCancel}
      >
        <Form form={form} labelCol={{ span: 6 }}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="发送订舱结果"
            name="remark"
            rules={[{ required: true, message: '请输入订舱结果' }]}
          >
            <Input.TextArea allowClear placeholder="发送订舱结果" />
          </Form.Item>
        </Form>
      </DragModal>
    </>
  );
};

export default FastBookingResultNotice;
