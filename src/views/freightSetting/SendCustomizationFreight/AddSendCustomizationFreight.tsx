import type { SendCustomizationFreightType } from '@/services/freightSetting/sendCustomizationFreight/sendCustomizationFreightModel';
import { Form } from 'antd';
import React, { useEffect } from 'react';

export type AddSendCustomizationFreightProps = {
  params: {
    visible: boolean;
    currentRow: SendCustomizationFreightType | null;
  };
  onCancel: () => void;
  onOk: (params: SendCustomizationFreightType) => void;
};

const AddSendCustomizationFreight: React.FC<
  AddSendCustomizationFreightProps
> = ({ params, onCancel, onOk }) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;
    init();
  }, [visible]);

  const init = () => {
    if (currentRow) {
      form.setFieldsValue({ ...currentRow });
    } else form.resetFields();
  };

  return <></>;
};

export default AddSendCustomizationFreight;
