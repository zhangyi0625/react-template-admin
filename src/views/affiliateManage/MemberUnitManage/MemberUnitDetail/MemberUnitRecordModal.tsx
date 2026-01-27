import React, { useEffect } from 'react';
import { DatePicker, Form, Input } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { CompanyMemberRecordType } from '@/services/affiliateManage/memberUnitManage/memberUnitManageModel';
import dayjs from 'dayjs';
import { formatTime } from '@/utils/format';

export type MemberUnitRecordModalProps = {
  visible: boolean;
  currentRow: CompanyMemberRecordType | null;
  onCancel: () => void;
  onOk: (params: CompanyMemberRecordType) => void;
};

const MemberUnitRecordModal: React.FC<MemberUnitRecordModalProps> = ({
  visible,
  currentRow,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;
    if (currentRow) {
      form.setFieldsValue({
        ...currentRow,
        enrollmentDate: dayjs(currentRow.enrollmentDate),
      });
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
          enrollmentDate: formatTime(
            form.getFieldValue('enrollmentDate'),
            'Y-M-D',
          ),
        });
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
      title={!currentRow ? '添加入会记录' : '修改入会记录'}
      width={{ xl: 560, xxl: 1000 }}
      onOk={handleOk}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="enrollmentDate"
          label="入会年月"
          rules={[{ required: true, message: '请选择入会年月' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea placeholder="请输入会备注信息" />
        </Form.Item>
      </Form>
    </DragModal>
  );
};

export default MemberUnitRecordModal;
