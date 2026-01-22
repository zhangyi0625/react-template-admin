import { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Radio } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { BoxPileManageForms } from './config';
import DragModal from '@/components/modal/DragModal';
import type { BoxPileManageType } from '@/services/essentialData/boxPileManage/boxPileManageModel';

export type BoxPileModalProps = {
  params: {
    visible: boolean;
    currentRow: BoxPileManageType | null;
  };
  onCancel: () => void;
  onOk: (params: BoxPileManageType) => void;
};

const BoxPileModal: React.FC<BoxPileModalProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!visible) return;
    if (!currentRow) {
      form.resetFields();
      form.setFieldsValue({
        enabled: 1,
      });
    } else {
      form.setFieldsValue({
        ...currentRow,
        enabled: Number(currentRow.enabled),
      });
    }
  }, [visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk(form.getFieldsValue());
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };

  return (
    <DragModal
      width="40%"
      open={visible}
      title={currentRow ? '编辑箱型' : '新增箱型'}
      onOk={handleOk}
      onCancel={onCancel}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {BoxPileManageForms.map((item) => (
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
                : []
            }
          >
            {item.formType === 'input' && (
              <Input
                placeholder={
                  (item.customPlaceholder as string) || `请输入${item.label}`
                }
                autoComplete="off"
                allowClear
              />
            )}
            {item.formType === 'input-number' && (
              <InputNumber
                placeholder={
                  (item.customPlaceholder as string) || `请输入${item.label}`
                }
                autoComplete="off"
                min={1}
                style={{ width: '100%' }}
              />
            )}
            {item.formType === 'radio' && (
              <Radio.Group
                options={item.options as CheckboxGroupProps<string>['options']}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  );
};

export default BoxPileModal;
