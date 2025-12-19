import React, { useEffect } from 'react';
import { DatePicker, Form, Input, Radio } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { ServiceChargeManageEditType } from '@/services/otherSetting/serviceChargeManage/serviceChargeManageModel';
import { ServiceChargeManageForm } from './config';
import type { CheckboxGroupProps } from 'antd/es/checkbox';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';
import dayjs from 'dayjs';

export type ServiceChargeManageModalProps = {
  params: {
    visible: boolean;
    editRow: ServiceChargeManageEditType | null;
  };
  onCancel: () => void;
  onOk: (params: ServiceChargeManageEditType) => void;
};

const serviceChargeManageModel: React.FC<ServiceChargeManageModalProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, editRow } = params;

  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;
    if (!editRow) {
      form.resetFields();
      form.setFieldsValue({
        valid: 1,
        services: 'BOOKING,PREBOOKING',
      });
    } else
      form.setFieldsValue({
        ...editRow,
        valid: Number(editRow.valid),
        validFrom: editRow.validFrom ? dayjs(editRow.validFrom) : null,
        validTo: editRow.validTo ? dayjs(editRow.validTo) : null,
      });
  }, [visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let params = {
          ...filterKeys(
            form.getFieldsValue(),
            ['valid', 'validFrom', 'validTo'],
            false
          ),
          valid: Boolean(form.getFieldValue('valid')),
          validFrom: form.getFieldValue('validFrom')
            ? formatTime(form.getFieldValue('validFrom'), 'Y-M-D h:m:s')
            : null,
          validTo: form.getFieldValue('validTo')
            ? formatTime(form.getFieldValue('validTo'), 'Y-M-D h:m:s')
            : null,
        };
        onOk(params);
      })
      .catch((errorInfo) => {
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };
  return (
    <DragModal
      open={visible}
      onCancel={onCancel}
      title={!editRow ? '新增规则' : '修改规则'}
      width={{ xl: 600, xxl: 1000 }}
      onOk={handleOk}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {ServiceChargeManageForm.map((item) => (
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
                        item.formType === 'input' ? '输入' : '选择'
                      }${item.label}`,
                    },
                  ]
                : undefined
            }
          >
            {item.formType === 'input' && (
              <Input allowClear placeholder={`请输入${item.label}`} />
            )}
            {item.formType === 'radio' && (
              <Radio.Group
                options={item.options as CheckboxGroupProps<string>['options']}
              ></Radio.Group>
            )}
            {item.formType === 'date-picker' && (
              <DatePicker
                style={{ width: '100%' }}
                format={'YY-MM-DD HH:mm:ss'}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  );
};

export default serviceChargeManageModel;
