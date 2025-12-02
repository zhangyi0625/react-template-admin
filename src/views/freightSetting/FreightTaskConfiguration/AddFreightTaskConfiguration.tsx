import React, { useEffect, useState } from 'react';
import { Form, Input, Select, type SelectProps } from 'antd';
import styles from '../../orderManage/CabinResult/cabinResult.module.scss';
import {
  FreightTaskConfigurationForms,
  FreightTaskConfigurationSearchColumns,
} from '../config';
import DragModal from '@/components/modal/DragModal';
import type { FreightTaskConfigurationType } from '@/services/freightSetting/freightTaskConfiguration/freightTaskConfigurationModel';
import { getSystemPort } from '@/services/system/basicData/basicDataApi';
import type { DefaultOptionType } from 'antd/es/select';
import { fetchSystemSearchData } from '@/utils/freight';

type PortType = {
  POR?: SelectProps['options'];
  FND?: SelectProps['options'];
  [key: string]: SelectProps['options'];
};

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

  const [defalueOptions, setDefaultOptions] = useState<PortType>({
    POR: [],
    FND: [],
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
      const porInfo: DefaultOptionType[] = await getSystemPort({
        keyword: currentRow.porCode,
        tag: 'POR',
      });
      const fndInfo: DefaultOptionType[] = await getSystemPort({
        keyword: currentRow.fndCode,
        tag: 'FND',
      });
      setDefaultOptions({
        POR: porInfo ?? [],
        FND: fndInfo ?? [],
      });
      form.setFieldsValue({
        ...currentRow,
        porCode: porInfo[0].unlocode ?? '',
        fndCode: fndInfo[0].unlocode || '',
      });
    } else {
      form.resetFields();
    }
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
    <>
      <DragModal
        open={visible}
        onCancel={onCancel}
        title={!currentRow ? '新增运价任务' : '修改运价任务'}
        width={{ xl: 600, xxl: 1000 }}
        onOk={handleOk}
        className={styles['cabinResult']}
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
                    item.selectFileldName ?? {
                      label: 'label',
                      value: 'value',
                    }
                  }
                />
              )}
              {item.formType === 'focusSelect' &&
                getPortSelect(item.name === 'porCode' ? 'POR' : 'FND')}
            </Form.Item>
          ))}
        </Form>
      </DragModal>
    </>
  );
};

export default AddFreightTaskConfiguration;
