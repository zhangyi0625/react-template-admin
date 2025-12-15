import { useEffect, useState } from 'react';
import { Form, Input, Select, Space } from 'antd';
import DragModal from '@/components/modal/DragModal';
import { getCabinMonitoringExtra } from '@/services/cabinInformation/cabinMonitoring/cabinMonitoringApi';
import type { CabinMonitoringExtraParams } from '@/services/cabinInformation/cabinMonitoring/cabinMonitoringModel';
import { CabinMonitoringExtraForms } from './config';
import { filterKeys, safeJsonParse } from '@/utils/tool';

export type CabinMonitoringExtraSettingModalProps = {
  visible: boolean;
  carrierType: string;
  onCancel: () => void;
  onOk: (params: CabinMonitoringExtraParams) => void;
};

const CabinMonitoringExtraSettingModal: React.FC<
  CabinMonitoringExtraSettingModalProps
> = ({ visible, carrierType, onCancel, onOk }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!visible) return;
    loadCabinMonitoringExtra();
  }, [visible]);

  const loadCabinMonitoringExtra = async () => {
    try {
      setLoading(true);
      const resp = await getCabinMonitoringExtra({ carrierType: carrierType });
      const info = resp.data ? safeJsonParse(resp.data) : {};
      carrierType === 'Dangerous'
        ? form.setFieldsValue({
            ...info,
            name: info.emergencyContact.name,
            countryCode: info.emergencyContact.countryCode,
            number: info.emergencyContact.number,
          })
        : form.setFieldsValue({ ...info });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk({
          key: carrierType,
          value: JSON.stringify({
            ...filterKeys(
              form.getFieldsValue(),
              ['name', 'countryCode', 'number'],
              false
            ),
            emergencyContact: {
              name: form.getFieldValue('name'),
              countryCode: form.getFieldValue('countryCode'),
              number: form.getFieldValue('number'),
            },
          }),
        });
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
        width={{ xl: 650, xxl: 1000 }}
        open={visible}
        title="额外参数"
        onOk={handleOk}
        onCancel={onCancel}
        loading={loading}
      >
        <Form form={form} labelCol={{ span: 5 }} labelAlign="right">
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          {(CabinMonitoringExtraForms[carrierType] || []).map((item, index) =>
            item.name === 'name' || item.name === 'number' ? (
              item.label === '紧急联系人姓名' ? (
                <Form.Item label={item.label} name="name" key={index}>
                  <Input
                    placeholder={
                      (item.customPlaceholder as string) ||
                      `请输入${item.label}`
                    }
                    autoComplete="off"
                    allowClear
                  />
                </Form.Item>
              ) : (
                <Form.Item label={item.label} key={index}>
                  <Space>
                    <Form.Item name="countryCode">
                      <Input
                        placeholder="请输入国家/地区"
                        autoComplete="off"
                        allowClear
                      />
                    </Form.Item>
                    <Form.Item name="number">
                      <Input
                        placeholder={
                          (item.customPlaceholder as string) ||
                          `请输入${item.label}`
                        }
                        style={{ width: '300px' }}
                        autoComplete="off"
                        allowClear
                      />
                    </Form.Item>
                  </Space>
                </Form.Item>
              )
            ) : (
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
                {item.formType === 'input' && (
                  <Input
                    placeholder={
                      (item.customPlaceholder as string) ||
                      `请输入${item.label}`
                    }
                    autoComplete="off"
                    allowClear
                    suffix={
                      item.name === 'grossWeight' ||
                      item.name === 'netWeight' ? (
                        <div>KG</div>
                      ) : undefined
                    }
                  />
                )}
                {item.formType === 'normalSelect' && (
                  <Select
                    placeholder={`请选择${item.label}`}
                    filterOption
                    options={item.options}
                    mode="tags"
                    fieldNames={
                      item.selectFileldName ?? {
                        label: 'label',
                        value: 'value',
                      }
                    }
                  />
                )}
              </Form.Item>
            )
          )}
        </Form>
      </DragModal>
    </>
  );
};

export default CabinMonitoringExtraSettingModal;
