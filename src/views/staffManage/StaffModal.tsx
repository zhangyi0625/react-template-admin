import DragModal from '@/components/modal/DragModal';
import { StaffManageType } from '@/services/staffManage/staffManageModel';
import { DatePicker, Form, Input, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { StaffManageForms } from './config';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';
import dayjs from 'dayjs';
import { CheckboxGroupProps } from 'antd/es/checkbox';

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

  const [loading, setLoading] = useState(false);

  const { RangePicker } = DatePicker;

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    if (!currentRow) {
      form.resetFields();
      form.setFieldsValue({
        status: 1,
      });
    } else {
      form.setFieldsValue({
        ...currentRow,
        status: Number(currentRow.status),
      });
    }
    setLoading(false);
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
      title={!currentRow ? '添加客户' : '修改客户'}
      width={{ xl: 600, xxl: 1000 }}
      onOk={handleOk}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {StaffManageForms.map((item) => (
          <Form.Item
            label={item.label}
            name={item.name}
            key={item.name}
            rules={
              item.isRules
                ? [
                    {
                      required: true,
                      message: `请${
                        item.formType === 'input' ||
                        item.formType === 'textarea'
                          ? '输入'
                          : '选择'
                      }${item.label}`,
                    },
                  ]
                : undefined
            }
          >
            {item.formType === 'input' && (
              <Input placeholder={`请输入${item.label}`} autoComplete="off" />
            )}
            {item.formType === 'textarea' && (
              <Input.TextArea
                placeholder={`请输入${item.label}`}
                autoComplete="off"
                style={{ height: '120px' }}
              />
            )}
            {item.formType === 'radio' && (
              <Radio.Group
                options={item.options as CheckboxGroupProps<string>['options']}
              />
            )}
            {item.formType === 'range-picker' && (
              <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  );
};

export default StaffModal;
