import React, { useEffect, useState } from 'react';
import styles from '../../orderManage/CabinResult/cabinResult.module.scss';
import { Form, Input, Select, Space, TimePicker, type SelectProps } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { SendCustomizationFreightType } from '@/services/freightSetting/sendCustomizationFreight/sendCustomizationFreightModel';
import { SendCustomizationFreightForms } from '../config';
import {
  getSearchCustomer,
  getSearchPort,
} from '@/services/orderManage/regularBooking/regularBookingApi';
import { getSystemOrderCarrier } from '@/services/system/basicData/basicDataApi';
import { fetchSystemSearchData } from '@/utils/freight';
import dayjs from 'dayjs';
import { formatTime } from '@/utils/format';

export type AddSendCustomizationFreightProps = {
  params: {
    visible: boolean;
    currentRow: SendCustomizationFreightType | null;
  };
  onCancel: () => void;
  onOk: (params: SendCustomizationFreightType) => void;
};

type PortType = {
  POR?: SelectProps['options'];
  FND?: SelectProps['options'];
  [key: string]: SelectProps['options'];
};

const AddSendCustomizationFreight: React.FC<
  AddSendCustomizationFreightProps
> = ({ params, onCancel, onOk }) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const [formMaps, setFormMaps] = useState(SendCustomizationFreightForms);

  const [data, setData] = useState<{ customerId: SelectProps['options'] }>({
    customerId: [],
  });

  const [carrierOptions, setCarrierOptions] = useState<
    { carrierCode: string }[]
  >([]);

  const [defalueOptions, setDefaultOptions] = useState<PortType>({
    POR: [],
    FND: [],
  });

  const [freightOptions, setFreightOptions] = useState<
    SendCustomizationFreightType['freights']
  >([
    {
      carrier: '',
      porCode: '',
      fndCode: '',
    },
  ]);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    init();
  }, [visible]);

  const init = async () => {
    const resp = await getSystemOrderCarrier();
    setCarrierOptions(resp);
    if (currentRow) {
      setFreightOptions([...currentRow.freights]);
      form.setFieldsValue({
        ...currentRow,
        execTime: dayjs(
          formatTime(new Date() as unknown as string, 'Y-M-D') +
            '' +
            currentRow.execTime
        ),
      });
      console.log(currentRow, form.getFieldsValue(), freightOptions);
    } else {
      form.resetFields();
      setFreightOptions([
        {
          carrier: '',
          porCode: '',
          fndCode: '',
        },
      ]);
    }
    setLoading(false);
  };

  const handleSearch = (newValue: string, type: string) => {
    if (!newValue || !newValue.trim()) return;
    fetchSystemSearchData(
      newValue,
      type,
      type === 'customerId' ? setData : setDefaultOptions,
      type === 'customerId' ? getSearchCustomer : getSearchPort
    );
  };

  const getPortSelect = (
    type: string,
    _: { porCode: string; fndCode: string },
    key: keyof { porCode: string; fndCode: string }
  ) => {
    return (
      <Select
        allowClear
        placeholder={`请输入${type === 'POR' ? '起运' : '目的'}港`}
        showSearch
        defaultActiveFirstOption={false}
        suffixIcon={null}
        notFoundContent={null}
        filterOption={false}
        style={{ width: '210px' }}
        value={_[key]}
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

  const selectChange = (
    value: string,
    index: number,
    type: keyof SendCustomizationFreightType['freights'][number]
  ) => {
    freightOptions[index][type] = value;
    setFreightOptions([...freightOptions]);
    console.log(value, 'value', index, freightOptions);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let params = {
          ...form.getFieldsValue(),
          execTime: formatTime(form.getFieldValue('execTime'), 'h:m:s'),
          freights: freightOptions,
        };
        return;
        onOk(params);
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
        title={!currentRow ? '新增定制运价' : '修改定制运价'}
        width={{ xl: 720, xxl: 1000 }}
        onOk={handleOk}
        className={styles['cabinResult']}
        loading={loading}
      >
        <Form form={form} labelCol={{ span: 4 }}>
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
              {item.formType === 'focusSelect' && (
                <Select
                  allowClear
                  placeholder={item.customPlaceholder}
                  showSearch
                  defaultActiveFirstOption={false}
                  suffixIcon={null}
                  notFoundContent={null}
                  filterOption={false}
                  onSearch={(value: string) =>
                    handleSearch(value, 'customerId')
                  }
                  options={(data.customerId || []).map((d) => ({
                    value: d.value,
                    label: d.label,
                  }))}
                />
              )}
              {item.formType === 'date-picker' && (
                <TimePicker format={'HH:mm:ss'} />
              )}
            </Form.Item>
          ))}
          {freightOptions.map((_, index) => (
            <Form.Item
              label={index > 0 ? null : '关注运价'}
              style={{ marginBottom: 0 }}
              key={index}
            >
              <Space>
                <Form.Item>
                  <Select
                    placeholder="请选择船公司"
                    filterOption
                    options={carrierOptions}
                    fieldNames={{
                      label: 'carrierCode',
                      value: 'carrierCode',
                    }}
                    style={{ width: '120px' }}
                    value={_.carrier}
                    onChange={(value: string) =>
                      selectChange(value, index, 'carrier')
                    }
                  />
                </Form.Item>
                <Form.Item>{getPortSelect('POR', _, 'porCode')}</Form.Item>
                <Form.Item>{getPortSelect('FND', _, 'fndCode')}</Form.Item>
              </Space>
            </Form.Item>
          ))}
        </Form>
      </DragModal>
    </>
  );
};

export default AddSendCustomizationFreight;
