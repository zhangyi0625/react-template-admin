import { useEffect, useState } from 'react';
import { Col, Form, Input, Row, Select } from 'antd';
import DragModal from '@/components/modal/DragModal';
import { getRoleList } from '@/services/system/role/roleApi';
import type { SysUserType } from '@/services/system/user/userModel';
import type { SysRoleType } from '@/services/system/role/roleModel';
import { SelectStaffForm } from '../config';
import { getUserDetail } from '@/services/system/user/userApi';

export interface AddUserProps {
  open: {
    visible: boolean;
    editRow: SysUserType | null;
  };
  onOk: (params: SysUserType) => void;
  onCancel: () => void;
}

/**
 * 添加用户弹窗
 * @returns
 */
const AddUser: React.FC<AddUserProps> = ({ open, onOk, onCancel }) => {
  const [form] = Form.useForm();

  const [role, setRole] = useState<SysRoleType[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const [formMap, setFormMap] = useState(SelectStaffForm);

  useEffect(() => {
    if (!open.visible) return;
    init();
    if (open.editRow) {
      loadUserDetail();
    } else {
      form.resetFields();
    }
  }, [open.visible]);

  const init = async () => {
    formMap.map((item) => {
      if (item.name === 'password') {
        item.hiddenItem = open.editRow ? true : false;
        item.isRules = open.editRow ? false : true;
      }
    });
    setFormMap([...formMap]);
    setLoading(true);
    const resp = await getRoleList();
    setRole(resp);
    setLoading(false);
  };

  const loadUserDetail = async () => {
    const resp = await getUserDetail(open.editRow?.id as string);
    form.setFieldsValue({
      ...resp,
      valid: Number(open.editRow?.valid),
    });
  };

  /**
   * 点击确定的操作
   */
  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        onOk({
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
      open={open.visible}
      onCancel={onCancel}
      title={!open.editRow ? '添加员工' : '修改员工'}
      width={{ xl: 800, xxl: 1000 }}
      onOk={handleOk}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {formMap.map((item) => (
            <Col span={item.span} key={item.name} hidden={item.hiddenItem}>
              <Form.Item
                label={item.label}
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
                {item.formType === 'input' && (
                  <Input
                    placeholder={`请输入${item.label}`}
                    autoComplete="off"
                  />
                )}
                {item.formType === 'normalSelect' && (
                  <Select
                    allowClear
                    placeholder={`请选择${item.label}`}
                    showSearch
                    options={item.name === 'valid' ? item.options : role}
                    fieldNames={
                      item.selectFieldName || {
                        label: 'label',
                        value: 'value',
                      }
                    }
                  />
                )}
                {item.formType === 'textarea' && (
                  <Input.TextArea
                    placeholder={`请输入${item.label}`}
                    autoComplete="off"
                  />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </DragModal>
  );
};
export default AddUser;
