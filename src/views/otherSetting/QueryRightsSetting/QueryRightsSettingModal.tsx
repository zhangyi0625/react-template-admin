import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Space, Switch } from 'antd';
import DragModal from '@/components/modal/DragModal';
import { LevelSetting } from '@/enums/setting';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import type { EquityRightsExtraPriceUpdateType } from '@/services/otherSetting/queryRightsSettings/queryRightsSettingsApi';
import { isNumber } from 'lodash-es';

export type QueryRightsSettingModalProps = {
  params: {
    visible: boolean;
    currentRow: EquityRightsExtraPriceUpdateType | null;
  };
  onCancel: () => void;
  onOk: (values: EquityRightsExtraPriceUpdateType) => void;
};

const QueryRightsSettingModal: React.FC<QueryRightsSettingModalProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params;

  const [loading, setLoading] = useState(false);

  const [formMaps, setFormMaps] = useState<
    Omit<CustomColumn, 'hiddenItem' | 'selectFetch'>[]
  >([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    form.resetFields();
    init();
  }, [visible]);

  const init = () => {
    form.setFieldsValue({ ...currentRow });
    let keys = Object.keys(LevelSetting).filter(
      (key) => key !== 'L9' && key !== 'L10' && key !== 'L21'
    );
    let newArr = keys.map((item) => {
      return {
        label: LevelSetting[item as keyof typeof LevelSetting],
        name: `${item}Price`.replace(/[L]/g, function (match: string) {
          return match.toLowerCase();
        }),
        formType: 'input',
        span: 6,
        defaultValue: currentRow?.[`${item}Price`],
      };
    });
    setFormMaps([...newArr]);
    console.log(newArr, currentRow, form.getFieldsValue());
    setLoading(false);
  };

  const changeStatus = (checked: boolean, index: number) => {
    !checked &&
      setFormMaps((prev) => [
        ...prev.map((m, i) =>
          i === index ? { ...m, defaultValue: undefined } : m
        ),
      ]);
  };

  const handleOk = () => {
    formMaps.map((item) => {
      if (isNumber(item.defaultValue)) {
        form.setFieldValue(item.name, item.defaultValue);
      }
    });
    onOk({ ...form.getFieldsValue(), module: currentRow?.module });
  };

  return (
    <DragModal
      open={visible}
      onCancel={onCancel}
      title="修改额外购买费用"
      width={{ xl: 600, xxl: 1000 }}
      onOk={handleOk}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {formMaps.map((item, index) => (
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
            <Space size={12}>
              <InputNumber
                placeholder="请输入价格"
                style={{ width: '250px' }}
                value={item.defaultValue}
                onChange={(value) =>
                  setFormMaps((prev) => [
                    ...prev.map((m, i) =>
                      i === index ? { ...m, defaultValue: value as string } : m
                    ),
                  ])
                }
                suffix={'次'}
                prefix={'¥'}
                disabled={!item.defaultValue}
              />
              <div className="flex items-center ml-[30px]">
                状态
                <Switch
                  style={{ marginLeft: '20px' }}
                  checked={isNumber(item.defaultValue)}
                  onChange={(checked) => changeStatus(checked, index)}
                />
              </div>
            </Space>
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  );
};

export default QueryRightsSettingModal;
