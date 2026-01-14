import React, { useEffect } from 'react';
import { Col, Form, Input, Radio, Row } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import type { BrashBoxAccountType } from '@/services/brashBoxManage/brashBoxAccount/brashBoxAccountModel';
import DragModal from '@/components/modal/DragModal';
import { BrashBoxAccountForms } from '../config';

export type BrashBoxAccountModalProps = {
  params: {
    visible: boolean;
    currentRow: BrashBoxAccountType | null;
  };
  onOk: (values: BrashBoxAccountType) => void;
  onCancel: () => void;
};

const BrashBoxAccountModal: React.FC<BrashBoxAccountModalProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;
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
      title={currentRow ? '编辑账号' : '新增账号'}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {BrashBoxAccountForms.map((item) => (
            <Col span={item.span} key={item.name}>
              <Form.Item
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
                    autoComplete="off"
                  />
                )}
                {item.formType === 'textarea' && (
                  <Input.TextArea
                    placeholder={`请输入${item.label}`}
                    autoComplete="off"
                    style={{ height: '100px' }}
                  />
                )}
                {item.formType === 'radio' && (
                  <Radio.Group
                    options={
                      item.options as CheckboxGroupProps<string>['options']
                    }
                  />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </DragModal>
  );
};

export default BrashBoxAccountModal;
