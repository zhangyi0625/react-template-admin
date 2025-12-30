import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Select } from 'antd';
import {
  FreightTaskConfigurationForms,
  FreightTaskConfigurationSearchColumns,
} from '../config';
import DragModal from '@/components/modal/DragModal';
import type { FreightTaskConfigurationType } from '@/services/freightSetting/freightTaskConfiguration/freightTaskConfigurationModel';
import SystemPortSelect, {
  SystemPortSelectRef,
} from '@/components/SystemPortSelect';
import type { PortInfoType } from '@/components/SystemPortSelect/type';

export type AddFreightTaskConfigurationProps = {
  params: {
    visible: boolean;
    currentRow: FreightTaskConfigurationType | null;
  };
  onCancel: () => void;
  onOk: (params: FreightTaskConfigurationType) => void;
};

const AddFreightTaskConfiguration: React.FC<
  AddFreightTaskConfigurationProps
> = ({ params, onCancel, onOk }) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const [formMaps, setFormMaps] = useState(FreightTaskConfigurationForms);

  const systemPortSelectRef = useRef<SystemPortSelectRef>(null);

  const [portCode, setPortCode] = useState<PortInfoType>({
    porInfo: undefined,
    fndInfo: undefined,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    formMaps.map((item) => {
      if (item.name === 'carrierCode')
        item.options =
          FreightTaskConfigurationSearchColumns.find(
            (type) => type.name === 'carrierCode'
          )?.options ?? [];
    });
    setFormMaps([...formMaps]);
    init();
  }, [visible]);

  const init = async () => {
    if (currentRow) {
      let portInfo = {
        porInfo: currentRow?.por?.unlocode ?? undefined,
        fndInfo: currentRow?.fnd?.unlocode ?? undefined,
      };
      setPortCode(portInfo);
      form.setFieldsValue({
        ...currentRow,
        porCode: currentRow?.por?.unlocode ?? '',
        fndCode: currentRow?.fnd?.unlocode ?? '',
      });
      systemPortSelectRef.current?.init(currentRow ? 'EDIT' : 'ADD');
    } else {
      form.resetFields();
    }
    setLoading(false);
  };

  const systemPortSelect = (value: string | undefined, name: string) => {
    form.setFieldsValue({
      [name]: value,
    });
    setPortCode({
      ...portCode,
      [name === 'porCode' ? 'porInfo' : 'fndInfo']: value ?? undefined,
    } as typeof portCode);
  };

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
    <>
      <DragModal
        open={visible}
        onCancel={onCancel}
        title={!currentRow ? '新增运价任务' : '修改运价任务'}
        width={{ xl: 600, xxl: 1000 }}
        onOk={handleOk}
        loading={loading}
      >
        <Form form={form} labelCol={{ span: 6 }}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          {formMaps.map((item) => (
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
              {item.formType === 'focusSelect' && (
                <SystemPortSelect
                  ref={systemPortSelectRef}
                  type={item.name === 'porCode' ? 'POR' : 'FND'}
                  portInfo={portCode}
                  onSystemPortSelect={(value) =>
                    systemPortSelect(value, item.name)
                  }
                />
              )}
            </Form.Item>
          ))}
        </Form>
      </DragModal>
    </>
  );
};

export default AddFreightTaskConfiguration;
