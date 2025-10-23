import React, { useEffect, useState } from 'react'
import { Form, Input, Radio, Select, SelectProps } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox'
import DragModal from '@/components/modal/DragModal'
import type { ShippingAccounType } from '@/services/customerInformation/shippingAccount/shippingAccountModel'
import { ShippingAccountForm } from './config'
import { filterKeys } from '@/utils/tool'
import {
  putShippingAccountLoginPassword,
  putShippingAccountPayPassword,
} from '@/services/customerInformation/shippingAccount/shippingAccountApi'

export type AddShippingAccountProps = {
  params: {
    visible: boolean
    currentRow: ShippingAccounType | null
    view: boolean
    type?: string | null
  }
  carrierOptions: SelectProps['options']
  customerOptions: SelectProps['options']
  onOk: (params: ShippingAccounType) => void
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const AddShippingAccount: React.FC<AddShippingAccountProps> = ({
  params,
  carrierOptions,
  customerOptions,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow, view, type } = params

  const [form] = Form.useForm()

  const [initialValues, setInitialValues] = useState({})

  const [passwordInfo, setPasswordInfo] = useState<Pick<
    ShippingAccounType,
    'payPassword' | 'loginPassword'
  > | null>({
    payPassword: '',
    loginPassword: '',
  })

  useEffect(() => {
    if (!visible) return
    if (currentRow) {
      form.setFieldsValue({
        ...currentRow,
        type: type,
        isValid: currentRow.isValid ? 1 : 0,
      })
      // 修改船司账号拷贝密码
      let pwd = filterKeys(currentRow, ['payPassword', 'loginPassword'], true)
      setPasswordInfo(pwd)
    } else {
      form.resetFields()
      setInitialValues({ type: type })
      form.setFieldsValue({ type: type, isValid: 1 })
    }
  }, [visible, view])

  const handleOk = () => {
    form
      .validateFields()
      .then(async () => {
        let params = {
          ...form.getFieldsValue(),
          isOrder: type === 'ORDER' ? true : null,
          isQuery: type === 'QUERY' ? true : null,
          isValid: Boolean(form.getFieldValue('isValid')),
        }
        if (currentRow) {
          if (
            form.getFieldValue('loginPassword') !== passwordInfo?.loginPassword
          ) {
            await putShippingAccountLoginPassword({
              id: params.id,
              loginPassword: params.loginPassword,
            })
          } else
            await putShippingAccountPayPassword({
              id: params.id,
              payPassword: params.payPassword,
            })
          onOk(filterKeys(params, ['loginPassword', 'payPassword'], false))
        } else {
          onOk(params)
        }
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
      title={currentRow ? '编辑船司账号' : '新增船司账号'}
      okButtonProps={{ className: view ? 'hidden' : '' }}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4 }} initialValues={initialValues}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        {ShippingAccountForm.map((item) => (
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
            {item.formType === 'select' && (
              <Select
                placeholder={`请选择${item.label}`}
                filterOption
                options={
                  item.name === 'carrier' ? carrierOptions : customerOptions
                }
                fieldNames={
                  item.selectFileldName ?? {
                    label: 'labal',
                    value: 'value',
                  }
                }
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
  )
}

export default AddShippingAccount
