import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Radio,
  Select,
  Space,
  TimePicker,
  type SelectProps,
} from 'antd';
import styles from '@/views/orderManage/CabinResult/cabinResult.module.scss';
import type { ShippingCabinPlanType } from '@/services/cabinInformation/shippingCabinPlan/shippingCabinPlanModel';
import DragModal from '@/components/modal/DragModal';
import { planModeOptions, ShippingCabinPlanFormMaps } from './config';
import { getSystemPort } from '@/services/system/basicData/basicDataApi';
import type { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';
import useCacheData from '@/hooks/useCacheData';
import { fetchSystemSearchData } from '@/utils/freight';
import { ShippingCabinPlanScheduleType } from '@/enums/setting';
import dayjs from 'dayjs';
import { formatTime } from '@/utils/format';
import { filterKeys } from '@/utils/tool';

export type ShippingCabinPlanModalProps = {
  params: {
    visible: boolean;
    currentRow: (ShippingCabinPlanType & { por: LocationItem }) | null;
  };
  onCancel: () => void;
  onOk: (params: ShippingCabinPlanType) => void;
};

type PortType = {
  POR?: SelectProps['options'];
  FND?: SelectProps['options'];
  [key: string]: SelectProps['options'];
};

const ShippingCabinPlanModal: React.FC<ShippingCabinPlanModalProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const [defalueOptions, setDefaultOptions] = useState<PortType>({
    POR: [],
    FND: [],
  });

  const { essential } = useCacheData({
    cacheEssentialKeys: ['carrierData'],
  });

  const [formMaps, setFormMaps] = useState(ShippingCabinPlanFormMaps);

  const [planMode, setPlanMode] = useState<ShippingCabinPlanType['planMode']>({
    type: 'DAY',
    beforeEtd: 0,
    week: 'MONDAY',
    weekTime: formatTime(new Date() as unknown as string, 'Y-M-D h:m:s') ?? '',
  });

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    init();
  }, [visible]);

  const init = () => {
    fetchSystemSearchData(
      currentRow?.por.unlocode as string,
      'POR',
      setDefaultOptions,
      getSystemPort
    );
    formMaps.map((item) => {
      if (item.name === 'carrier')
        item.options = essential['carrierData'] || [];
    });
    setFormMaps([...formMaps]);
    if (!currentRow) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        ...currentRow,
        porCode: currentRow?.por.unlocode as string,
      });
    }
    setPlanMode({
      type: currentRow?.planMode.type || 'DAY',
      beforeEtd:
        currentRow?.planMode.type === 'WEEK'
          ? 0
          : currentRow?.planMode.beforeEtd ?? 0,
      week:
        currentRow?.planMode.type === 'WEEK'
          ? currentRow?.planMode.week
          : 'MONDAY',
      weekTime:
        formatTime(
          currentRow?.planMode.weekTime ?? (new Date() as unknown as string),
          'h:m:s'
        ) ?? '',
    });
    handleSearch(currentRow?.por.unlocode as string, 'POR');
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
        let params: ShippingCabinPlanType = {
          ...filterKeys(form.getFieldsValue(), [], false),
          planMode: {
            ...planMode,
            weekTime:
              formatTime(new Date() as unknown as string, 'Y-M-D') +
              ' ' +
              planMode.weekTime,
          },
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
        width={{ xl: 550, xxl: 1000 }}
        open={visible}
        title={currentRow ? '编辑放舱计划' : '新增放舱计划'}
        onOk={handleOk}
        onCancel={onCancel}
        loading={loading}
        className={styles['cabinResult']}
      >
        <Form form={form} labelCol={{ span: 4 }} labelAlign="left">
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          {ShippingCabinPlanFormMaps.map((item) => (
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
              {item.formType === 'focusSelect' && getPortSelect('POR')}
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
                />
              )}
            </Form.Item>
          ))}
          <Form.Item label="放舱方式">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Radio.Group
                value={planMode.type}
                onChange={(e) =>
                  setPlanMode({ ...planMode, type: e.target.value })
                }
                options={planModeOptions}
              />
              {planMode.type === 'DAY' ? (
                <Input
                  placeholder="输入ETD前多少天"
                  autoComplete="off"
                  allowClear
                  value={planMode.beforeEtd}
                  onChange={(e) =>
                    setPlanMode({
                      ...planMode,
                      beforeEtd: Number(e.target.value),
                    })
                  }
                />
              ) : (
                <div className="flex items-center w-full">
                  <Select
                    placeholder="请选择星期"
                    filterOption
                    style={{ width: '100%', marginRight: '10px' }}
                    value={planMode.week}
                    options={Object.keys(ShippingCabinPlanScheduleType).map(
                      (item) => {
                        return {
                          value: (
                            ShippingCabinPlanScheduleType as Record<
                              string,
                              string
                            >
                          )[item],
                          label: item,
                        };
                      }
                    )}
                    onChange={(e) => setPlanMode({ ...planMode, week: e })}
                  />
                  <TimePicker
                    value={
                      planMode.weekTime
                        ? dayjs(planMode.weekTime, 'HH:mm:ss')
                        : undefined
                    }
                    onChange={(e) =>
                      setPlanMode({
                        ...planMode,
                        weekTime: e?.format('HH:mm:ss'),
                      })
                    }
                    style={{ width: '100%' }}
                    format={'HH:mm:ss'}
                  />
                </div>
              )}
            </Space>
          </Form.Item>
        </Form>
      </DragModal>
    </>
  );
};

export default ShippingCabinPlanModal;
