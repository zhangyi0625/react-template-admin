import { useEffect, useState } from 'react';
import { App, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import DragModal from '@/components/modal/DragModal';
import { BrashBoxListForms } from '../config';
import type { BrashBoxListType } from '@/services/brashBoxManage/brashBoxList/brashBoxListModel';
import { getBrashBoxList } from '@/services/brashBoxManage/brashBoxList/brashBoxListApi';
import { getBoxPileManage } from '@/services/essentialData/boxPileManage/boxPileManageApi';

export type BrashBoxModalProps = {
  params: {
    visible: boolean;
    currentRow: BrashBoxListType['task'] | null;
  };
  onCancel: () => void;
  onOk: (
    params: Pick<
      BrashBoxListType['task'],
      'billNo' | 'id' | 'ctnType' | 'ctnNumber'
    >,
  ) => void;
};

const BrashBoxModal = ({ params, onCancel, onOk }: BrashBoxModalProps) => {
  const { visible, currentRow } = params;

  const { modal } = App.useApp();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [formMap, setFormMap] = useState(BrashBoxListForms);

  const [brashBoxList, setBrashBoxList] = useState<BrashBoxListType['task'][]>(
    [],
  );

  useEffect(() => {
    if (!visible) return;
    init();
  }, [visible]);

  const init = async () => {
    try {
      if (!currentRow) {
        form.resetFields();
        form.setFieldsValue({
          ctnType: '40GP',
          ctnNumber: 1,
        });
      } else {
        form.setFieldsValue(currentRow);
      }
      Promise.all([getBrashBoxList(), getBoxPileManage()]).then((result) => {
        setBrashBoxList(result[0] || []);
        formMap.map((item) => {
          if (item.name === 'ctnType') {
            item.options = result[1] || [];
          }
        });
      });
      setFormMap([...formMap]);
      setLoading(false);
    } catch {}
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        if (
          brashBoxList.find(
            (item) => item.billNo === form.getFieldValue('billNo'),
          ) &&
          !currentRow?.id
        ) {
          modal.confirm({
            title: `提单号已存在`,
            icon: <ExclamationCircleFilled />,
            content: `提单号任务已存在，提交后将自动加入该任务，是否继续提交？`,
            okText: '加入任务',
            async onOk() {
              onOk(form.getFieldsValue());
            },
          });
        } else onOk(form.getFieldsValue());
      })
      .catch((errorInfo) => {
        // 滚动并聚焦到第一个错误字段
        form.scrollToField(errorInfo.errorFields[0].name);
        form.focusField(errorInfo.errorFields[0].name);
      });
  };

  return (
    <DragModal
      width="40%"
      open={visible}
      title={currentRow ? '编辑刷箱' : '新增刷箱'}
      onOk={handleOk}
      onCancel={onCancel}
      loading={loading}
    >
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Row gutter={24}>
          {BrashBoxListForms.map((item) => (
            <Col span={item.span} key={item.name}>
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
                {item.formType === 'input-number' && (
                  <InputNumber
                    placeholder={`请输入${item.label}`}
                    autoComplete="off"
                    style={{ width: '100%' }}
                    min={1}
                  />
                )}
                {item.formType === 'normalSelect' && (
                  <Select
                    placeholder={`请选择${item.label}`}
                    filterOption
                    options={(item.options || []).map((opt) => ({
                      label: opt.code,
                      value: opt.code,
                    }))}
                    showSearch
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

export default BrashBoxModal;
