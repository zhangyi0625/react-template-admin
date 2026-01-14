import React, { useEffect, useState } from 'react';
import { DatePicker, Form, Input } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { NoticeManageType } from '@/services/system/notice/noticeModel';
import { NoticeForms } from './config';
import { filterKeys } from '@/utils/tool';
import { formatTime } from '@/utils/format';
import dayjs from 'dayjs';

export type NoticeModalProps = {
  params: {
    visible: boolean;
    currentRow: NoticeManageType | null;
  };
  onCancel: () => void;
  onOk: (params: NoticeManageType) => void;
};

const NoticeModal: React.FC<NoticeModalProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const { RangePicker } = DatePicker;

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    if (!currentRow) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        ...currentRow,
        create: [dayjs(currentRow.startDate), dayjs(currentRow.endDate)],
      });
    }
    setLoading(false);
  }, [visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk({
          ...filterKeys(form.getFieldsValue(), ['create'], false),
          startDate: formatTime(form.getFieldValue('create')[0], 'Y-M-D'),
          endDate: formatTime(form.getFieldValue('create')[1], 'Y-M-D'),
        });
        console.log(form.getFieldsValue());
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
      title={!currentRow ? '添加公告' : '修改公告'}
      width={{ xl: 600, xxl: 1000 }}
      onOk={handleOk}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {NoticeForms.map((item) => (
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
                        item.formType === 'input' ||
                        item.formType === 'textarea'
                          ? '输入'
                          : '选择'
                      }${item.label}`,
                    },
                  ]
                : undefined
            }
          >
            {item.formType === 'input' && (
              <Input placeholder={`请输入${item.label}`} autoComplete="off" />
            )}
            {item.formType === 'textarea' && (
              <Input.TextArea
                placeholder={`请输入${item.label}`}
                autoComplete="off"
                style={{ height: '120px' }}
              />
            )}
            {item.formType === 'range-picker' && (
              <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  );
};

export default NoticeModal;
