import { useEffect } from 'react';
import { Form, Input } from 'antd';
import { StaffForm } from './config';
import DragModal from '@/components/modal/DragModal';
import type { StaffManageType } from '@/services/affiliateManage/staffManage/staffManageModel';

export type StaffModalProps = {
  params: {
    visible: boolean;
    currentRow: StaffManageType | null;
  };
  onCancel: () => void;
  onOk: (params: StaffManageType) => void;
};

const StaffModal: React.FC<StaffModalProps> = ({ params, onCancel, onOk }) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;
    if (!currentRow) {
      form.resetFields();
    } else {
      form.setFieldsValue(currentRow);
    }
  }, [visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk({
          ...form.getFieldsValue(),
        });
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };

  return (
    <DragModal
      open={visible}
      onCancel={onCancel}
      title={!currentRow ? '添加企业员工' : '修改企业员工'}
      width={{ xl: 560, xxl: 1000 }}
      onOk={handleOk}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {StaffForm.map((item) => (
          <Form.Item
            key={item.name}
            label={item.label}
            name={item.name}
            rules={
              item.isRules
                ? [
                    {
                      required: true,
                      message: `请${
                        item.formType === 'input' ? '输入' : '选择'
                      }${item.label}`,
                    },
                  ]
                : undefined
            }
          >
            {item.formType === 'input' && (
              <Input
                placeholder={`请输入${item.label}`}
                allowClear
                autoComplete="off"
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  );
};

export default StaffModal;
