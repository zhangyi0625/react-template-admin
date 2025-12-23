import { useEffect, useState } from 'react';
import {
  Button,
  Drawer,
  Form,
  Input,
  Select,
  type SelectProps,
  Space,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import {
  getSearchAffiliate,
  getSearchCustomer,
} from '@/services/orderManage/regularBooking/regularBookingApi';
import type { CouponProvideType } from '@/services/otherSetting/couponManage/couponManageModel';
import { CouponProviderForms } from './config';
import { fetchSystemSearchData } from '@/utils/freight';

export type CouponProviderDrawerProps = {
  params: {
    visible: boolean;
  };
  onCancel: () => void;
  onOk: (param: CouponProvideType) => void;
};

const CouponProviderDrawer: React.FC<CouponProviderDrawerProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible } = params;

  const [form] = Form.useForm();

  const [customerData, setcustomerData] = useState<{
    customerId: SelectProps['options'];
  }>({
    customerId: [],
  });

  const [affiliatedata, setAffiliateData] = useState<{
    affiliateId: SelectProps['options'];
  }>({
    affiliateId: [],
  });

  useEffect(() => {
    if (!visible) return;
    form.resetFields();
    setcustomerData({ customerId: [] });
    setAffiliateData({ affiliateId: [] });
  }, [visible]);

  const handleSearch = (newValue: string, name: string) => {
    if (!newValue || !newValue.trim()) return;
    fetchSystemSearchData(
      newValue,
      name === 'customerIds' ? 'customerId' : 'affiliateId',
      name === 'customerIds' ? setcustomerData : setAffiliateData,
      name === 'customerIds' ? getSearchCustomer : getSearchAffiliate
    );
  };

  const onConfirm = () => {
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
    <Drawer
      title="添加用户/企业"
      width={700}
      open={visible}
      closeIcon={false}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onCancel} />}
      onClose={onCancel}
      classNames={{ footer: 'text-right' }}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={onConfirm}>
            确定
          </Button>
        </Space>
      }
    >
      <Form form={form} labelCol={{ span: 3 }}>
        {CouponProviderForms.map((item) => (
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
                allowClear
                autoComplete="off"
                placeholder={`请输入${item.label}`}
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
                mode={'multiple'}
                onSearch={(newValue) => handleSearch(newValue, item.name)}
                options={(
                  (item.name === 'customerIds'
                    ? customerData['customerId']
                    : affiliatedata['affiliateId']) || []
                ).map((d) => ({
                  value: d.value,
                  label: d.label,
                }))}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </Drawer>
  );
};

export default CouponProviderDrawer;
