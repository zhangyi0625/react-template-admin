import { useEffect, useRef, useState } from 'react'
import {
  Col,
  Form,
  GetProp,
  Input,
  type InputRef,
  Row,
  Select,
  TreeSelect,
  TreeSelectProps,
} from 'antd'
import DragModal from '@/components/modal/DragModal'
import { getRoleList } from '@/services/system/role/roleApi'
import { getOrganizationList } from '@/services/system/organization/organization'
import { buildTree } from '@/utils/tool'
import { SysUserType } from '@/services/system/role/roleModel'

type DefaultOptionType = GetProp<TreeSelectProps, 'treeData'>[number]

/**
 * 添加用户弹窗
 * @returns
 */
const AddUser: React.FC<AddUserProps> = ({ open, onOk, onCancel, roleId }) => {
  const [form] = Form.useForm()

  const [role, setRole] = useState([])

  const ref = useRef<InputRef>(null)

  const [loading, setLoading] = useState<boolean>(false)

  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, 'label'>[]>(
    []
  )

  const [initialValues, setInitialValues] = useState<{ roles: string[] }>({
    roles: [],
  })

  useEffect(() => {
    if (!open.visible) return
    // 获取所有角色
    getAllRole()
    getOrganization()
    if (open.editRow) {
      form.setFieldsValue({
        ...open.editRow,
        roles: open.editRow?.roles.map((el: { roleId: string }) => el.roleId),
      })
    } else {
      form.resetFields()
      setInitialValues({ roles: [roleId] })
    }
  }, [open.visible])

  const getOrganization = () => {
    setLoading(true)
    getOrganizationList().then((resp) => {
      setTreeData(buildTree(resp))
      setLoading(false)
    })
  }

  const getAllRole = () => {
    getRoleList({ page: 1, size: 9999 }).then((resp: any) => {
      setRole(resp.results)
    })
  }

  /**
   * 点击确定的操作
   */
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

  const cancel = () => {
    form.resetFields()
    onCancel()
  }

  return (
    <DragModal
      open={open.visible}
      onCancel={cancel}
      title={!open.editRow ? '添加用户' : '修改用户'}
      width={{ xl: 800, xxl: 1000 }}
      onOk={handleOk}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 5 }} initialValues={initialValues}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="用户账号"
              name="loginName"
              rules={[{ required: true, message: '请输入用户账号' }]}
            >
              <Input
                placeholder="请输入用户名"
                autoFocus
                allowClear
                autoComplete="off"
                ref={ref}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="手机号"
              name="phone"
              rules={[
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '请输入正确的手机号',
                },
                { required: true, message: '请输入手机号' },
              ]}
            >
              <Input
                placeholder="请输入用户名"
                autoFocus
                allowClear
                autoComplete="off"
                ref={ref}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="所属机构"
              name="orgId"
              rules={[{ required: true, message: '请选择所属机构' }]}
            >
              <TreeSelect
                styles={{
                  popup: { root: { maxHeight: 400, overflow: 'auto' } },
                }}
                treeData={treeData}
                placeholder="请选择所属机构"
                fieldNames={{
                  label: 'orgName',
                  value: 'id',
                  children: 'children',
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="登陆密码"
              name="loginPwd"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) return Promise.reject('密码不能为空')
                    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)) {
                      return Promise.reject('密码需包含字母和数字且至少6位')
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input
                placeholder="请输入登录密码"
                allowClear
                autoComplete="off"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="姓名"
              name="nickname"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" allowClear autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item className="mb-0" label="住址" name="address">
              <Input placeholder="请输入住址" allowClear autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="角色"
              name="roles"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select
                mode="multiple"
                options={role.map((item: { roleName: string; id: string }) => ({
                  label: item.roleName,
                  value: item.id,
                }))}
                placeholder="请选择角色"
                allowClear
                filterOption
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              className="mb-0"
              label="邮箱"
              name="email"
              rules={[
                {
                  type: 'email',
                  message: '请输入正确的邮箱',
                },
              ]}
            >
              <Input placeholder="请输入邮箱" allowClear autoComplete="off" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item className="mb-0" label="个人简介" name="introduction">
              <Input.TextArea placeholder="请输入个人简介" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </DragModal>
  )
}
export default AddUser

export interface AddUserProps {
  open: {
    visible: boolean
    editRow: SysUserType | null
  }
  // 当前角色
  roleId: string
  // 点击确定(选中的数量)
  onOk: (params: SysUserType) => void
  onCancel: () => void
}
