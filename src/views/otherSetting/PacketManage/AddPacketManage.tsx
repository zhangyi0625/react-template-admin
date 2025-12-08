import React, { useEffect } from 'react';
import { Form, Input, Radio, DatePicker } from 'antd';
import DragModal from '@/components/Modal/DragModal';
import type { PacketManageType } from '@/services/otherSetting/packetManage/packetManageModel';
import { filterKeys } from '@/utils/tool';
import dayjs from 'dayjs';
import { formatTime } from '@/utils/format';

export type AddPacketManageProps = {
  open: {
    visible: boolean;
    editRow: PacketManageType | null;
  };
  onOk: (params: PacketManageType) => void;
  onCancel: () => void;
};

const AddPacketManage: React.FC<AddPacketManageProps> = ({
  open,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const { RangePicker } = DatePicker;

  useEffect(() => {
    if (!open.visible) return;
    form.resetFields();
    if (open.editRow) {
      form.setFieldsValue({
        ...open.editRow,
        dateList: [dayjs(open.editRow.startDate), dayjs(open.editRow.endDate)],
      });
    } else {
      form.setFieldsValue({ type: 'SUBSCRIBE' });
    }
  }, [open.visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let params = {
          ...filterKeys(form.getFieldsValue(), ['dateList'], false),
          startDate: formatTime(
            form.getFieldValue('dateList')[0],
            'Y-M-D h:m:s'
          ),
          endDate: formatTime(form.getFieldValue('dateList')[1], 'Y-M-D h:m:s'),
        };
        onOk(params);
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };
  return (
    <DragModal
      open={open.visible}
      onCancel={onCancel}
      title={!open.editRow ? '添加活动红包' : '修改活动红包'}
      width={{ xl: 600, xxl: 1000 }}
      onOk={handleOk}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="红包名称"
          name="activityName"
          rules={[
            {
              required: true,
              message: '请输入活动红包名称',
            },
          ]}
        >
          <Input placeholder="请输入活动红包名称" autoComplete="off" />
        </Form.Item>
        <Form.Item label="应用范围" name="type">
          <Radio value={'SUBSCRIBE'} checked>
            新注册用户
          </Radio>
        </Form.Item>
        <Form.Item
          label="红包描述"
          name="desc"
          rules={[
            {
              required: true,
              message: '请输入活动红包描述',
            },
          ]}
        >
          <Input.TextArea placeholder="请输入活动红包描述" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="红包描述"
          name="dateList"
          rules={[
            {
              required: true,
              message: '请输入活动红包描述',
            },
          ]}
        >
          <RangePicker style={{ width: '100%' }} format={'YY-MM-DD HH:mm:ss'} />
        </Form.Item>
        <Form.Item
          label="发放时间规则"
          name="configJson"
          rules={[
            {
              required: true,
              message: '请输入发放时间规则',
            },
          ]}
        >
          <Input.TextArea placeholder="请输入发放时间规则" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="发放金额规则"
          name="awardJson"
          rules={[
            {
              required: true,
              message: '请输入发放金额规则',
            },
          ]}
        >
          <Input.TextArea placeholder="请输入发放金额规则" autoComplete="off" />
        </Form.Item>
      </Form>
    </DragModal>
  );
};

export default AddPacketManage;
