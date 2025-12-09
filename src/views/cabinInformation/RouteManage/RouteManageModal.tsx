import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Input, Select, type SelectProps } from 'antd';
import styles from '@/views/orderManage/CabinResult/cabinResult.module.scss';
import DragModal from '@/components/Modal/DragModal';
import { getRouteManageDetail } from '@/services/cabinInformation/routeManage/routeManageApi';
import type { RouteManageByCarrierRouteType } from '@/services/cabinInformation/routeManage/routeManageModel';
import { CabinManageChannelOptions } from '../CabinManage/config';
import type { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';
import { getSystemPort } from '@/services/system/basicData/basicDataApi';
import useCacheData from '@/hooks/useCacheData';
import { filterKeys } from '@/utils/tool';
import { fetchSystemSearchData } from '@/utils/freight';

export type RouteManageModalProps = {
  params: {
    visible: boolean;
    editId: string | null;
  };
  onCancel: () => void;
  onOk: (params: RouteManageByCarrierRouteType) => void;
};

type PortType = {
  POR?: SelectProps['options'];
  FND?: SelectProps['options'];
  [key: string]: SelectProps['options'];
};

const RouteManageModal: React.FC<RouteManageModalProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, editId } = params;

  const [form] = Form.useForm();

  const { essential } = useCacheData({
    cacheEssentialKeys: ['carrierData'],
  });

  const [loading, setLoading] = useState<boolean>(false);

  const [detail, setDetail] = useState<Record<string, string | LocationItem>>(
    {}
  );

  const HaulageModesOptions = ['CY-CY', 'CY-SD', 'CY-DR'];

  const productChannel = (CabinManageChannelOptions || []).reduce(
    (prev, cur) => {
      if (cur.value !== undefined && cur.value !== null) {
        prev[cur.value as string] = cur.label as string;
      }
      return prev;
    },
    {} as Record<string, string>
  );

  const [defalueOptions, setDefaultOptions] = useState<PortType>({
    POR: [],
    FND: [],
  });

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    if (!editId) {
      form.resetFields();
      form.setFieldsValue({
        options: ['CY-CY'],
      });
      setLoading(false);
    } else loadDetail();
  }, [visible]);

  const loadDetail = async () => {
    try {
      const resp = await getRouteManageDetail(editId as string);
      form.setFieldsValue({
        options: resp.options.haulageModes,
      });
      setDetail(resp);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const updateForm = useMemo(() => {
    return detail ?? {};
  }, [detail]);

  const portInfo = useCallback(
    (type: string) => {
      let item = (updateForm[type] as LocationItem) || {};
      return `${item?.localName}-${item?.name}, ${item?.countryCode}`;
    },
    [updateForm]
  );

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
        mode={'tags'}
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
          value: d.id,
        }))}
      />
    );
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let params: RouteManageByCarrierRouteType = {
          ...filterKeys(form.getFieldsValue(), ['options', 'route'], false),
          options: {
            haulageModes: form.getFieldValue('options') as string[],
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
        width={{ xl: 750, xxl: 1000 }}
        open={visible}
        title={editId ? '编辑船司航线' : '新增船司航线'}
        onOk={handleOk}
        onCancel={onCancel}
        loading={loading}
        className={styles['cabinResult']}
      >
        <Form form={form} labelCol={{ span: 4 }} labelAlign="left">
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          {editId ? (
            <Form.Item label="航线" name="route">
              <div className="text-sm font-semibold text-stone-900">
                {typeof updateForm.carrier === 'string'
                  ? updateForm.carrier
                  : ''}
                <span className="mx-[5px]"> | </span>
                {productChannel[String(updateForm.channel)]}
                <span className="mx-[5px]"> | </span>
                {portInfo('por')}-{portInfo('fnd')}
              </div>
            </Form.Item>
          ) : (
            <>
              <Form.Item label="船公司" name="carriers">
                <Select
                  allowClear
                  placeholder="请选择船公司"
                  showSearch
                  defaultActiveFirstOption={false}
                  filterOption={false}
                  options={essential['carrierData']}
                  fieldNames={{
                    label: 'carrierCode',
                    value: 'carrierCode',
                  }}
                  mode={'tags'}
                />
              </Form.Item>
              <Form.Item label="起运港" name="porIds">
                {getPortSelect('POR')}
              </Form.Item>
              <Form.Item label="目的港" name="fndIds">
                {getPortSelect('FND')}
              </Form.Item>
            </>
          )}
          <Form.Item label="运输条款(多选)" name="options">
            <Select
              placeholder={`请选择运输条款`}
              showSearch
              allowClear
              options={HaulageModesOptions.map((i) => {
                return {
                  label: i,
                  value: i,
                };
              })}
              mode={'tags'}
            ></Select>
          </Form.Item>
        </Form>
      </DragModal>
    </>
  );
};

export default RouteManageModal;
