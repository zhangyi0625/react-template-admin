import { useEffect } from 'react';
import { Form, Input, InputNumber, Radio, Select } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { MemberUnitAboutType } from '@/services/releaseManage/memberUnitAbout/memberUnitAboutModel';
import { MemberUnitAboutForm } from './config';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import { IndustryDynamicsProgramForm } from '../IndustryDynamics/config';

export type MemberUnitAboutModalProps = {
  params: {
    visible: boolean;
    currentRow: MemberUnitAboutType | null;
    source: 'industryDynamics' | 'memberUnitAbout';
  };
  onOk: (row: MemberUnitAboutType) => void;
  onCancel: () => void;
};

const MemberUnitAboutModal: React.FC<MemberUnitAboutModalProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow } = params;

  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;
    if (currentRow) {
      form.setFieldsValue({
        ...currentRow,
      });
    } else {
      form.resetFields();
      form.setFieldValue('type', 'content');
    }
  }, [visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        let type = form.getFieldValue('type');
        onOk({
          ...form.getFieldsValue(),
          content:
            type === 'content' ? (form.getFieldValue('content') ?? '') : null,
          imageIds: type === 'imageIds' ? form.getFieldValue('imageIds') : null,
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
      title={!currentRow ? '添加栏目' : '修改栏目'}
      width={{ xl: 660, xxl: 1000 }}
      onOk={handleOk}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {(params.source === 'industryDynamics'
          ? IndustryDynamicsProgramForm
          : MemberUnitAboutForm
        ).map((item) => (
          <Form.Item
            label={item.label}
            key={item.name}
            name={item.name}
            rules={[
              {
                required: true,
                message: `请${item.formType === 'input' ? '输入' : '选择'}${
                  item.label
                }`,
              },
            ]}
          >
            {item.formType === 'input' && (
              <Input placeholder={`请输入${item.label}`} autoComplete="off" />
            )}
            {item.formType === 'input-number' && (
              <InputNumber style={{ width: '100%' }} min={0} />
            )}
            {item.formType === 'normalSelect' && (
              <Select
                placeholder={`请选择${item.label}`}
                showSearch
                filterOption
                options={item.options}
              />
            )}
            {item.formType === 'radio' && (
              <Radio.Group
                options={item.options as CheckboxGroupProps<string>['options']}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </DragModal>
  );
};
export default MemberUnitAboutModal;
