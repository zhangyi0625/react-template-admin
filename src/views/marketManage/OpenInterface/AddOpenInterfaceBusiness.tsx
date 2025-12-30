import styles from '@/views/marketManage/AffiliateManage/AffiliateManage.module.scss';
import React, { useEffect, useState } from 'react';
import { DatePicker, Form, Input, Select } from 'antd';
import { OpenInterfaceBusinessForms } from './config';
import DragModal from '@/components/modal/DragModal';
import type { OpenInterfaceBusinessType } from '@/services/marketManage/openInterface/openInterfaceModel';
import { store } from '@/stores/store';
import dayjs from 'dayjs';
import { formatTime } from '@/utils/format';

export type AddOpenInterfaceBusinessProps = {
  params: {
    visible: boolean;
    editRow: OpenInterfaceBusinessType | null;
  };
  onCancel: () => void;
  onOk: (params: OpenInterfaceBusinessType) => void;
};

export const AddOpenInterfaceBusiness: React.FC<
  AddOpenInterfaceBusinessProps
> = ({ params, onCancel, onOk }) => {
  const { visible, editRow } = params;

  const { publicSetting } = store.getState().publicSetting;

  const [form] = Form.useForm();

  const { Search } = Input;

  const [formMaps, setFormMaps] = useState(OpenInterfaceBusinessForms);

  useEffect(() => {
    if (!visible) return;
    formMaps.map((item) => {
      if (item.formType === 'normalSelect')
        item.options = Object.keys(publicSetting['openApiGrantItem']).map(
          (item) => {
            return {
              label: publicSetting['openApiGrantItem'][item],
              value: item,
            };
          }
        );
    });
    setFormMaps([...formMaps]);
    if (editRow) {
      form.setFieldsValue({ ...editRow, validTo: dayjs(editRow.validTo) });
    } else {
      form.resetFields();
    }
  }, [visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk({
          ...form.getFieldsValue(),
          validTo: formatTime(form.getFieldValue('validTo'), 'Y-M-D h:m:s'),
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
        open={visible}
        onCancel={onCancel}
        title={editRow ? '业务功能修改' : '业务功能新增'}
        width={{ xl: 600, xxl: 1000 }}
        onOk={handleOk}
      >
        <Form form={form} labelCol={{ span: 6 }} colon={false}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item name="userId" hidden>
            <Input disabled />
          </Form.Item>
          {OpenInterfaceBusinessForms.map((item) => (
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
                <Search
                  placeholder={`请输入${item.label}`}
                  autoComplete="off"
                  allowClear
                  className={styles['queryLimitInput']}
                  enterButton={
                    <>
                      <div>{'次/分钟'}</div>
                    </>
                  }
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
              {item.formType === 'date-picker' && (
                <DatePicker
                  style={{ width: '100%' }}
                  format={'YY-MM-DD HH:mm:ss'}
                />
              )}
            </Form.Item>
          ))}
        </Form>
      </DragModal>
    </>
  );
};

export default AddOpenInterfaceBusiness;
