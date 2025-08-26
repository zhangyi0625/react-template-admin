import React, { useEffect } from 'react'
import { Form, Radio } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import DragModal from '@/components/modal/DragModal'

export type MonitoringFrequncyProps = {
  visible: boolean
  onOk: (params: { frequency: string }) => void
  onCancel: () => void
}

const MonitoringFrequncy: React.FC<MonitoringFrequncyProps> = ({
  visible,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (!visible) return
    form.setFieldsValue({ frequency: '2秒' })
  }, [visible])

  const options = ['2秒', '5秒', '10秒']

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk(form.getFieldsValue())
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name)
        form.focusField(errorInfo.errorFields[0].name)
      })
  }

  return (
    <DragModal
      width="40%"
      open={visible}
      title="监控频率"
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          name="frequency"
          label="监控频率"
          rules={[
            {
              required: true,
              message: '请选择监控频率',
            },
          ]}
        >
          <Radio.Group
            options={options as CheckboxGroupProps<string>['options']}
          />
        </Form.Item>
      </Form>
    </DragModal>
  )
}

export default MonitoringFrequncy
