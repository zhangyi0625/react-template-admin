import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { DisposeOptions } from './config';
import DragModal from '@/components/modal/DragModal';
import type { DepositManageType } from '@/services/capitalManage/depositManage/depositManageModel';

export type DepositManageRemarkProps = {
  params: {
    visible: boolean;
    currentRow: DepositManageType | null;
  };
  onCancel: () => void;
  onOk: (params: DepositManageType, disposeStatus: string) => void;
};

const DepositManageRemark: React.FC<DepositManageRemarkProps> = ({
  params,
  onCancel,
  onOk,
}) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  const [dispose, setDispose] = useState<string | undefined>();

  useEffect(() => {
    if (!visible) return;
    form.resetFields();
    setDispose(
      currentRow?.status === 'FAILED'
        ? 'reject'
        : currentRow?.status === 'DISCHARGED'
        ? 'accept'
        : undefined
    );
    form.setFieldsValue({
      remarks: currentRow?.remarks,
    });
  }, [visible]);

  const changeDispose = (value: string) => {
    setDispose(value);
  };

  const handleOk = () => {
    currentRow?.status !== 'CREATED'
      ? onCancel()
      : form
          .validateFields()
          .then(() => {
            onOk(form.getFieldsValue(), dispose as string);
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
        title="提现处理"
        width={{ xl: 500, xxl: 1000 }}
        onOk={handleOk}
      >
        <Form form={form} labelCol={{ span: 6 }}>
          <Form.Item name="id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item label="处理结果">
            <Select
              placeholder="请选择处理结果"
              filterOption
              options={DisposeOptions}
              value={dispose}
              onChange={changeDispose}
              disabled={currentRow?.status !== 'CREATED'}
            />
          </Form.Item>
          <Form.Item label="体现方式">
            <Select
              placeholder="请选择体现方式"
              filterOption
              options={[{ label: '手动转账', value: 'OFFLINE' }]}
              value={'OFFLINE'}
              onChange={changeDispose}
            />
          </Form.Item>
          {dispose && (
            <Form.Item
              label={dispose === 'accept' ? '备注' : '驳回原因'}
              name="remarks"
            >
              <Input.TextArea
                disabled={currentRow?.status !== 'CREATED'}
                placeholder={`请填写${
                  dispose === 'accept' ? '备注' : '驳回原因'
                }`}
                allowClear
              />
            </Form.Item>
          )}
        </Form>
      </DragModal>
    </>
  );
};

export default DepositManageRemark;
