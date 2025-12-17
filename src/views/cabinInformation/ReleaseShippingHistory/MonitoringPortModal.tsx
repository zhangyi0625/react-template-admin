import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Select } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { ReleaseShippingHistoryMonitoringPortType } from '@/services/cabinInformation/releaseShippingHistory/releaseShippingHistoryModel';
import { ReleaseShippingHistoryForms } from './config';
import { ORDER } from '@/views/orderManage/RegularBooking/config';
import SystemPortSelect, {
  SystemPortSelectRef,
} from '@/components/SystemPortSelect';
import type { PortInfoType } from '@/components/SystemPortSelect/type';
import useCacheData from '@/hooks/useCacheData';

export type MonitoringPortModalProps = {
  params: {
    visible: boolean;
    currentRow: ReleaseShippingHistoryMonitoringPortType | null;
  };
  onCancel: () => void;
  onOk: (params: ReleaseShippingHistoryMonitoringPortType) => void;
};

const MonitoringPortModal: React.FC<MonitoringPortModalProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params;

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const [formMap, setFormMap] = useState(ReleaseShippingHistoryForms);

  const systemPortSelectRef = useRef<SystemPortSelectRef>(null);

  const { essential } = useCacheData({
    cacheEssentialKeys: ['carrierData'],
  });

  const [portCode, setPortCode] = useState<PortInfoType>({
    porInfo: undefined,
    fndInfo: undefined,
  });

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    init();
  }, [visible]);

  const init = () => {
    formMap.map((item) => {
      if (item.name === 'carrier')
        item.options = essential['carrierData'] ?? [];
      else if (item.name === 'ctnType')
        item.options = ORDER.map((i) => {
          return {
            label: i,
            value: i,
          };
        });
    });
    let portInfo = {
      porInfo: currentRow?.por.unlocode ?? undefined,
      fndInfo: currentRow?.fnd?.unlocode ?? undefined,
    };
    setPortCode(portInfo);
    currentRow
      ? form.setFieldsValue({
          ...currentRow,
          ...portInfo,
        })
      : form.resetFields();
    systemPortSelectRef.current?.init(currentRow ? 'EDIT' : 'ADD');
    setFormMap([...formMap]);
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
    <DragModal
      width={{ xl: 650, xxl: 1000 }}
      open={visible}
      title="维护港口"
      onCancel={onCancel}
      loading={loading}
      onOk={handleOk}
    >
      <Form form={form} labelCol={{ span: 4 }} labelAlign="left">
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {formMap.map((item) => (
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
            {item.formType === 'normalSelect' && (
              <Select
                placeholder={`请选择${item.label}`}
                filterOption
                showSearch
                options={item.options}
                fieldNames={
                  item.selectFileldName ?? {
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

export default MonitoringPortModal;
