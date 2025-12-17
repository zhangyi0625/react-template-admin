import React, { useEffect, useState } from 'react';
import { Form, Input, Select, type SelectProps } from 'antd';
import styles from '@/views/orderManage/CabinResult/cabinResult.module.scss';
import DragModal from '@/components/modal/DragModal';
import type { ReleaseShippingHistoryMonitoringPortType } from '@/services/cabinInformation/releaseShippingHistory/releaseShippingHistoryModel';
import { ReleaseShippingHistoryForms } from './config';
import { getSystemPort } from '@/services/system/basicData/basicDataApi';
import { ORDER } from '@/views/orderManage/RegularBooking/config';
import useCacheData from '@/hooks/useCacheData';
import { fetchSystemSearchData } from '@/utils/freight';

export type MonitoringPortModalProps = {
  params: {
    visible: boolean;
    currentRow: ReleaseShippingHistoryMonitoringPortType | null;
  };
  onCancel: () => void;
  onOk: (params: ReleaseShippingHistoryMonitoringPortType) => void;
};

type PortType = {
  POR?: SelectProps['options'];
  FND?: SelectProps['options'];
  [key: string]: SelectProps['options'];
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

  const { essential } = useCacheData({
    cacheEssentialKeys: ['carrierData'],
  });

  const [defalueOptions, setDefaultOptions] = useState<PortType>({
    POR: [],
    FND: [],
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
    currentRow
      ? form.setFieldsValue({
          ...currentRow,
          porCode: currentRow?.por.unlocode,
          fndCode: currentRow?.fnd?.unlocode,
        })
      : form.resetFields();
    handleSearch(currentRow?.por.unlocode || '', 'POR');
    handleSearch(currentRow?.fnd?.unlocode || '', 'FND');
    setFormMap([...formMap]);
    setLoading(false);
  };

  const handleSearch = (newValue: string, type: 'POR' | 'FND' | string) => {
    if (!newValue || !newValue.trim()) return;
    fetchSystemSearchData(newValue, type, setDefaultOptions, getSystemPort);
  };

  const getPortSelect = (type: string) => {
    return (
      <Select
        allowClear
        placeholder={`请输入${type === 'POR' ? '起运' : '目的'}港`}
        showSearch
        defaultActiveFirstOption={false}
        suffixIcon={null}
        notFoundContent={null}
        filterOption={false}
        onSearch={(value: string) => handleSearch(value, type)}
        options={(defalueOptions[type] || []).map((d) => ({
          label: (
            <div className="">
              <p>
                {d.localName} - {d.name}
              </p>
              <p>
                {d.countryLocalName} - {d.countryName}
              </p>
            </div>
          ),
          value: d.unlocode,
        }))}
      />
    );
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
      className={styles['cabinResult']}
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
            {item.formType === 'focusSelect' &&
              getPortSelect(item.name === 'porCode' ? 'POR' : 'FND')}
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
