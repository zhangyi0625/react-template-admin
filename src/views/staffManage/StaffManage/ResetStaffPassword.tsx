import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import DragModal from '@/components/Modal/DragModal';
import type {
  SysStaffResetPasswordType,
  SysStaffType,
} from '@/services/staffManage/staffManageModel';
import { postSendVerifycode } from '@/services/staffManage/staffManageApi';

export type ResetStaffPasswordProps = {
  params: {
    visible: boolean;
    currentRow: (SysStaffType & SysStaffResetPasswordType) | null;
  };
  onOk: (params: SysStaffType & SysStaffResetPasswordType) => void;
  onCancel: () => void;
};

const ResetStaffPassword: React.FC<ResetStaffPasswordProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const [isSendCheckCode, setIsSendCheckCode] = useState<boolean>(false);

  const [countdownNumber, setCountdownNumber] = useState<number>(60);

  useEffect(() => {
    if (!visible) return;
    if (currentRow) {
      form.setFieldsValue({ ...currentRow, password: null });
    }
  }, [visible]);

  const sendMessage = async () => {
    setIsSendCheckCode(true);
    try {
      const resp = await postSendVerifycode();
      const timer = setInterval(function () {
        setCountdownNumber((prev) => prev - 1);
        if (countdownNumber === 0) {
          setIsSendCheckCode(false);
          setCountdownNumber(60);
          clearInterval(timer);
        }
      }, 1e3);
      form.setFieldsValue({
        ...form.getFieldsValue(),
        verifyKey: resp.verifyKey,
      });
    } catch {
      setIsSendCheckCode(false);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk({
          ...params.currentRow,
          ...form.getFieldsValue(),
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
      title="重置用户密码"
      width="40%"
      onOk={handleOk}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="phone" label="手机号">
          <Input disabled />
        </Form.Item>
        <Form.Item className="mb-0" label="手机验证码" name="verifyCode">
          <div className="flex items-center">
            <Input placeholder="发送验证码" allowClear autoComplete="off" />
            {!isSendCheckCode ? (
              <Button
                className="ml-[20px]"
                type="default"
                color="default"
                onClick={sendMessage}
              >
                发送验证码
              </Button>
            ) : (
              <div className="text-stone-500 whitespace-nowrap ml-[20px]">
                再次获取({countdownNumber})s
              </div>
            )}
          </div>
        </Form.Item>
        <Form.Item
          className="mb-0"
          label="登陆密码"
          name="password"
          rules={[
            {
              required: true,
              message: '请输入登录密码',
            },
          ]}
        >
          <Input.Password
            placeholder="请输入需要重置的登录密码"
            allowClear
            autoComplete="off"
          />
        </Form.Item>
      </Form>
    </DragModal>
  );
};

export default ResetStaffPassword;
