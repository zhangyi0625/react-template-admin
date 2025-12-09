import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Select,
  type SelectProps,
} from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { OpenInterfaceType } from '@/services/marketManage/openInterface/openInterfaceModel';
import { OpenInterfaceForms } from './config';
import { getSearchCustomer } from '@/services/orderManage/regularBooking/regularBookingApi';
import { fetchSystemSearchData } from '@/utils/freight';

export type AddOpenInterfaceModalProps = {
  visible: boolean;
  currentRow: OpenInterfaceType | null;
  onCancel: () => void;
  onOk: (params: OpenInterfaceType) => void;
};

const AddOpenInterfaceModal: React.FC<AddOpenInterfaceModalProps> = ({
  visible,
  currentRow,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  const [data, setData] = useState<{ customerId: SelectProps['options'] }>({
    customerId: [],
  });

  const [checked, setChecked] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!visible) return;
    setChecked(true);
    setLoading(true);
    if (currentRow) {
      handleSearch(currentRow.customerName);
      form.setFieldsValue({
        ...currentRow,
      });
    } else {
      form.resetFields();
    }
    setLoading(false);
  }, [visible]);

  const handleSearch = (newValue: string) => {
    if (!newValue || !newValue.trim()) return;
    fetchSystemSearchData(newValue, 'customerId', setData, getSearchCustomer);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk({ ...form.getFieldsValue(), valid: checked });
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
        title={currentRow ? '修改接口信息' : '新增接口信息'}
        width={{ xl: 800, xxl: 1000 }}
        onOk={handleOk}
        loading={loading}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          labelAlign="left"
          colon={false}
        >
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Row gutter={24}>
            {OpenInterfaceForms.map((item) => (
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
                      allowClear
                    />
                  )}
                  {item.formType === 'textarea' && (
                    <Input.TextArea
                      placeholder={item.customPlaceholder as string}
                      autoComplete="off"
                      allowClear
                    />
                  )}
                  {item.formType === 'radio' && (
                    <Checkbox
                      onChange={() => setChecked(!checked)}
                      checked={checked}
                    >
                      有效
                    </Checkbox>
                  )}
                  {item.formType === 'focusSelect' && (
                    <Select
                      allowClear
                      placeholder={item.customPlaceholder}
                      showSearch
                      defaultActiveFirstOption={false}
                      suffixIcon={null}
                      notFoundContent={null}
                      filterOption={false}
                      onSearch={handleSearch}
                      options={(data.customerId || []).map((d) => ({
                        value: d.value,
                        label: d.label,
                      }))}
                    />
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

export default AddOpenInterfaceModal;
