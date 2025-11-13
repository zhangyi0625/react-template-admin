import React, { useEffect } from 'react';
import type { StaffManageType } from '@/services/marketManage/staffManage/staffManageModel';
import { Col, Form, Input, Radio, Row, Select } from 'antd';
import DragModal from '@/components/modal/DragModal';
import { UserManageFormsColumns } from './config';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { filterKeys } from '@/utils/tool';

export type AddUserProps = {
  params: {
    visible: boolean;
    currentRow: StaffManageType | null;
  };
  onOk: (params: StaffManageType) => void;
  onCancel: () => void;
};

const AddUser: React.FC<AddUserProps> = ({ params, onCancel, onOk }) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const jurisdiction = ['BKG', 'PBK', 'CUP', 'OVE', 'CAA', 'NTF'];

  useEffect(() => {
    if (!visible) return;
    if (currentRow) {
      form.setFieldsValue({ ...currentRow });
    } else {
      form.resetFields();
      form.setFieldsValue({
        BKG: 1,
        PBK: 1,
        CUP: 0,
        OVE: 0,
        CAA: 1,
        NTF: 1,
        level: 0,
      });
    }
  }, [visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        const newArr: string[] = [];
        const jurisdictionParams = filterKeys(
          form.getFieldsValue(),
          jurisdiction,
          true
        );
        for (let i in jurisdictionParams) {
          if (jurisdictionParams[i]) newArr.push(i);
        }
        let params = {
          ...filterKeys(form.getFieldsValue(), jurisdiction, false),
          permissions: newArr.join(','),
        };
        onOk({ ...params });
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
        onCancel={onCancel}
        title="新增用户"
        width={{ xl: 900, xxl: 1000 }}
        onOk={handleOk}
      >
        <Form form={form} labelCol={{ span: 8 }}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Row gutter={24}>
            {UserManageFormsColumns.map((item) => (
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
                          item.name === 'phone'
                            ? {
                                pattern: /^1[3-9]\d{9}$/,
                                message: '请输入正确的手机号',
                              }
                            : {},
                        ]
                      : undefined
                  }
                >
                  {item.formType === 'input' && (
                    <Input
                      placeholder={`请输入${item.label}`}
                      autoComplete="off"
                      allowClear
                    />
                  )}
                  {item.formType === 'normalSelect' && (
                    <Select
                      placeholder={`请选择${item.label}`}
                      filterOption
                      options={item.options}
                      fieldNames={
                        item.selectFileldName ?? {
                          label: 'label',
                          value: 'value',
                        }
                      }
                      disabled
                    />
                  )}
                  {item.formType === 'radio' && (
                    <Radio.Group
                      options={
                        item.options as CheckboxGroupProps<string>['options']
                      }
                    ></Radio.Group>
                  )}
                </Form.Item>
              </Col>
            ))}
          </Row>
        </Form>
      </DragModal>
    </>
  );
};

export default AddUser;
