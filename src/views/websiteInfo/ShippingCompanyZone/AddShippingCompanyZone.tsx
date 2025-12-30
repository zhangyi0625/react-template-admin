import React, { useEffect, useRef } from 'react';
import { Form, Input, type InputRef } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { ShippingCompanyZoneType } from '@/services/websiteInfo/websiteInfoModel';
import { ShippingCompanyZoneForm } from './config';

export type AddShippingCompanyZoneProps = {
  params: {
    visible: boolean;
    currentRow: ShippingCompanyZoneType | null;
  };
  onOk: (params: ShippingCompanyZoneType) => void;
  onCancel: () => void;
};

const AddShippingCompanyZone: React.FC<AddShippingCompanyZoneProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const ref = useRef<InputRef>(null);

  useEffect(() => {
    if (!visible) return;
    if (currentRow) {
      form.setFieldsValue({
        ...currentRow,
      });
    } else {
      form.resetFields();
    }
  }, [visible]);

  const onAfterOpenChange = (open: boolean) => {
    if (open) {
      ref.current?.focus();
    }
  };

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
      title={!currentRow ? '添加船司' : '修改船司'}
      width={{ xl: 560, xxl: 1000 }}
      onOk={handleOk}
      afterOpenChange={onAfterOpenChange}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {ShippingCompanyZoneForm.map((item) => (
          <Form.Item
            label={item.label}
            key={item.name}
            name={item.name}
            rules={[
              {
                required: true,
                message: `请${item.formType === 'input' ? '输入' : '选择'}${
                  item.label
                }`,
              },
            ]}
          >
            {item.formType === 'input' && (
              <Input placeholder={`请输入${item.label}`} autoComplete="off" />
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  );
};

export default AddShippingCompanyZone;
