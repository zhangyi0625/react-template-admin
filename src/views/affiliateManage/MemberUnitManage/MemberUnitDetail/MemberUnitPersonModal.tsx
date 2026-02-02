import { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { StaffManageType } from '@/services/affiliateManage/staffManage/staffManageModel';
import { getStaffManageList } from '@/services/affiliateManage/staffManage/staffManageApi';

export type MemberUnitPersonModalProps = {
  visible: boolean;
  type: 'add' | 'edit' | 'setting';
  companyId?: string;
  onCancel: () => void;
  onOk: (params: { customerIds: string } | { customerId: string }) => void;
};

const MemberUnitPersonModal: React.FC<MemberUnitPersonModalProps> = ({
  visible,
  type,
  companyId,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  const [customerList, setCustomerList] = useState<StaffManageType[]>([]);

  useEffect(() => {
    if (!visible) return;
    loadCustomerList();
    form.resetFields();
  }, [visible]);

  const loadCustomerList = async () => {
    try {
      const resp: any = await getStaffManageList(
        type === 'setting' ? { companyId: companyId as string } : {},
      );
      setCustomerList(resp.list || []);
    } catch {}
  };

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
      open={visible}
      onCancel={onCancel}
      title={
        type === 'add'
          ? '添加企业成员'
          : type === 'edit'
            ? '修改企业成员'
            : '设置管理员'
      }
      width={{ xl: 560, xxl: 1000 }}
      onOk={handleOk}
    >
      <Form form={form} labelCol={{ span: 5 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {type !== 'setting' ? (
          <Form.Item
            name="customerIds"
            label="姓名/手机号"
            rules={[{ required: true, message: '请选择企业成员' }]}
          >
            <Select
              allowClear
              placeholder="请选择"
              showSearch
              filterOption={(inputValue, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              }
              options={customerList.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>
        ) : (
          <Form.Item
            name="customerId"
            label="管理员"
            rules={[{ required: true, message: '请选择管理员' }]}
          >
            <Select
              allowClear
              placeholder="请选择一个成员设为管理员"
              showSearch
              filterOption
              options={customerList.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </Form.Item>
        )}
      </Form>
    </DragModal>
  );
};

export default MemberUnitPersonModal;
