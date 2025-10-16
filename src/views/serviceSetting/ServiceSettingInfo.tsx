import { useEffect, useState } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { ServiceSettingType } from '@/services/serviceSetting/serviceSettingModel';
import { ServiceSettingForm } from './config';
import useCacheData from '@/hooks/useCacheData';
import { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export interface ServiceSettingInfoProps {
  params: {
    visible: boolean;
    currentRow: ServiceSettingType | null;
    view: boolean;
  };
  onOk: (params: ServiceSettingType) => void;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ServiceSettingInfo: React.FC<ServiceSettingInfoProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow, view } = params;

  const [form] = Form.useForm();

  const [formMap, setFormMap] = useState(ServiceSettingForm);

  const { loading, formMaps } = useCacheData({
    cacheEssentialKeys: ['routeData', 'carrierData'],
    formMap: formMap as CustomColumn[],
    promiseFilter: {
      carrierData: {
        enabled: 1,
      },
    },
  });

  useEffect(() => {
    if (!visible) return;
    if (currentRow) {
      form.setFieldsValue(currentRow);
    } else {
      form.resetFields();
    }
    setFormMap([...formMaps]);
  }, [visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk(form.getFieldsValue());
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };
  return (
    <DragModal
      width="60%"
      open={visible}
      title={currentRow ? '修改服务' : '添加服务'}
      okButtonProps={{ className: view ? 'hidden' : '' }}
      onOk={handleOk}
      onCancel={onCancel}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {formMap.map((item) => (
            <Col span={item.span} key={item.name}>
              <Form.Item
                key={item.name}
                label={item.label}
                name={item.name}
                rules={
                  item.isRules
                    ? [
                        {
                          required: true,
                          message: `请选择${item.label}`,
                        },
                      ]
                    : []
                }
              >
                {item.formType === 'input' && (
                  <Input placeholder={`请输入${item.label}`} allowClear />
                )}
                {item.formType === 'normalSelect' && (
                  <Select
                    options={item.options}
                    filterOption
                    fieldNames={
                      item.selectFileldName ?? {
                        label: 'label',
                        value: 'value',
                      }
                    }
                    mode={item.name === 'routeFndIds' ? 'multiple' : undefined}
                    placeholder={`请选择${item.label}`}
                  ></Select>
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </DragModal>
  );
};

export default ServiceSettingInfo;
