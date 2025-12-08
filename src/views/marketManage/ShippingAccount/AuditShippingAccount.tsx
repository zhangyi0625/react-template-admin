import React, { useCallback, useEffect, useState } from 'react';
import { Divider, Form, Input, Radio, RadioChangeEvent } from 'antd';
import DragModal from '@/components/Modal/DragModal';
import type { ShippingAccountAuditType } from '@/services/marketManage/shippingAccount/shippingAccountModel';
import { getShippingAccountDetail } from '@/services/marketManage/shippingAccount/shippingAccountApi';
import { ShippingAccountStatusOptions } from './config';

export type AuditShippingAccountProps = {
  params: {
    visible: boolean;
    editId: string | null;
  };
  onCancel: () => void;
  onOk: (params: ShippingAccountAuditType) => void;
};

export const AuditShippingAccount: React.FC<AuditShippingAccountProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  const { visible, editId } = params;

  const [detail, setDetail] = useState<{ [key: string]: string }>({});

  const [loading, setLoading] = useState<boolean>(false);

  const [passStatus, setPassStatus] = useState<boolean>(true);

  useEffect(() => {
    if (!visible) return;
    init();
  }, [visible]);

  const getValue = useCallback(
    (key: string) => {
      if (key === 'isCheck')
        return ShippingAccountStatusOptions?.find(
          (item) => item.value === detail.isCheck
        )?.label;
      else return detail[key];
    },
    [detail]
  );

  const editForm = [
    {
      label: '用户姓名',
      value: getValue('customerName'),
    },
    {
      label: '客户姓名',
      value: getValue('customerAffiliateName'),
    },
    {
      label: '手机号',
      value: getValue('customerPhone'),
    },
    {
      label: '船司',
      value: getValue('carrier'),
    },
    {
      label: '登录名',
      value: getValue('username'),
    },
    {
      label: '公司名称',
      value: getValue('affiliate'),
    },
    {
      label: '登录密码',
      value: getValue('password'),
    },
    {
      label: '支付密码',
      value: getValue('payPassword'),
    },
    {
      label: '审核状态',
      value: getValue('isCheck'),
    },
    {
      label: '创建时间',
      value: getValue('created'),
    },
  ];

  const init = async () => {
    setLoading(true);
    try {
      const resp = await getShippingAccountDetail(editId as string);
      setDetail(resp);
      form.setFieldsValue({
        id: editId,
        pass: Boolean(resp.valid),
        invalidMsg: resp.invalidMsg ?? null,
        force: true,
      });
      setPassStatus(Boolean(resp.valid));
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setPassStatus(value);
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
        title="编辑船司账号"
        width={{ xl: 650, xxl: 1000 }}
        onOk={handleOk}
        loading={loading}
      >
        <Form form={form} labelCol={{ span: 3 }} labelAlign="left">
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item name="force" hidden>
            <Input disabled />
          </Form.Item>
          {editForm.map((item) => (
            <p className="text-gray-500 my-[10px]" key={item.label}>
              {item.label}：<span className="text-gray-900">{item.value}</span>
            </p>
          ))}
          <Divider />
          <Form.Item label="人工审核" name="pass">
            <Radio.Group onChange={onChange}>
              <Radio value={true}>通过</Radio>
              <Radio value={false}>未通过</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="invalidMsg"
            rules={
              !passStatus
                ? [
                    {
                      required: true,
                      message: '填写审核不通过原因',
                    },
                  ]
                : undefined
            }
            hidden={passStatus}
          >
            <Input.TextArea placeholder="填写审核不通过原因" />
          </Form.Item>
        </Form>
      </DragModal>
    </>
  );
};

export default AuditShippingAccount;
