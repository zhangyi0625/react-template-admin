import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { AffiliateManageType } from '@/services/marketManage/affiliateManage/affiliateManageModel';
import { AffiliateManageForm } from './config';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';

export type AddAffiliateProps = {
  params: {
    visible: boolean;
    currentRow: AffiliateManageType | null;
  };
  onOk: (params: AffiliateManageType) => void;
  onCancel: () => void;
};

const AddAffiliate: React.FC<AddAffiliateProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible } = params;

  const setting = useSelector((state: RootState) => state.publicSetting);

  const [form] = Form.useForm();

  const [formMaps, setFormMaps] = useState(AffiliateManageForm);

  useEffect(() => {
    if (!visible) return;
    form.resetFields();
    formMaps.map((item) => {
      if (item.name === 'type') {
        const keys = Object.keys(setting.publicData.customerAffiliateType);
        let newArr = keys.map((item) => {
          return {
            label: item,
            value: setting.publicData.customerAffiliateType[item],
          };
        });
        item.options = newArr;
      }
    });
    setFormMaps([...formMaps]);
  }, [visible]);

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
    <DragModal
      open={visible}
      onCancel={onCancel}
      title="新增客户"
      width={{ xl: 600, xxl: 1000 }}
      onOk={handleOk}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {formMaps.map((item) => (
          <Form.Item
            label={item.label}
            key={item.name}
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
                  item.selectFieldName ?? {
                    label: 'label',
                    value: 'value',
                  }
                }
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  );
};

export default AddAffiliate;
