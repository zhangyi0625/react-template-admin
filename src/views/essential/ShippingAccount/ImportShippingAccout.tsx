import React, { useEffect, useState } from 'react'
import {
  ConfigProvider,
  Form,
  Input,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import DragModal from '@/components/modal/DragModal'

export type ImportShippingAccoutProps = {
  visible: boolean
  onOk: (params: Record<string, string | number | boolean>) => void
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const ImportShippingAccout: React.FC<ImportShippingAccoutProps> = ({
  visible,
  onOk,
  onCancel,
}) => {
  const [form] = Form.useForm()

  const { Dragger } = Upload

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const DraggerProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx',
    beforeUpload(file) {
      setFileList([file])
      return false
    },
    fileList,
  }

  useEffect(() => {
    if (visible) {
      form.resetFields()
      setFileList([])
    }
  }, [visible])

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk({ ...form.getFieldsValue(), file: fileList[0] })
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name)
        form.focusField(errorInfo.errorFields[0].name)
      })
  }

  return (
    <DragModal
      open={visible}
      width={'40%'}
      title="导入船司账号"
      onOk={handleOk}
      onCancel={onCancel}
      okText="导入"
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item
          label="客户名称"
          name="customerName"
          rules={[{ required: true, message: '请输入客户名称' }]}
        >
          <Input placeholder="请输入客户名称" autoComplete="off" />
        </Form.Item>
        <ConfigProvider
          theme={{
            components: {
              Upload: {
                colorBorder: '#167fff',
                colorFillAlter: 'rgba(241,246,255,1)',
              },
            },
          }}
        >
          <Dragger {...DraggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="text-sky-600">点击或将文件拖动到这里上传</p>
            <p>仅支持文件格式：xlsx</p>
          </Dragger>
        </ConfigProvider>
      </Form>
    </DragModal>
  )
}

export default ImportShippingAccout
