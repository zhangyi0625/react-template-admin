import React, { useEffect, useState } from 'react'
import { Col, Form, Input, Row, Select } from 'antd'
import DragModal from '@/components/modal/DragModal'
import { AddSearchForm } from './config'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'

export type AddSearchByAffilateProps = {
  visible: boolean
  onOk: (params: any) => void
  onCancel: () => void
}

const AddSearchByAffilate: React.FC<AddSearchByAffilateProps> = ({
  visible,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm()

  const [formMap, setFormMap] = useState(AddSearchForm)

  const essential = useSelector((state: RootState) => state.essentail)

  useEffect(() => {
    if (!visible) return
    form.resetFields()
    init()
  }, [visible])

  const init = () => {
    let { customerData = [], carrierData = [] } = essential
    formMap.map((item) => {
      item.options = item.name === 'carrier' ? carrierData : customerData
    })
    setFormMap([...formMap])
  }

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
      title="添加公司"
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {formMap.map((item) => (
            <Col span={item.span} key={item.name}>
              <Form.Item
                label={item.label}
                key={item.name}
                name={item.name}
                rules={
                  item.isRules
                    ? [
                        {
                          required: true,
                          message: `请${
                            item.formType === 'input' ? '输入' : '选择'
                          }${item.label}`,
                        },
                      ]
                    : undefined
                }
              >
                {item.formType === 'select' && (
                  <Select
                    placeholder={`请选择${item.label}`}
                    filterOption
                    options={item.options}
                    fieldNames={
                      item.selectFileldName ?? {
                        label: 'labal',
                        value: 'value',
                      }
                    }
                    allowClear
                  />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </DragModal>
  )
}

export default AddSearchByAffilate
