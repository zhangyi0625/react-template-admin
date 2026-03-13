import { useEffect, useState } from 'react';
import {
  App,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import DragModal from '@/components/modal/DragModal';
import { BrashBoxListForms } from '../config';
import type { BrashBoxListType } from '@/services/brashBoxManage/brashBoxList/brashBoxListModel';
import {
  getBrashBoxList,
  getBrashBoxListByBillNo,
} from '@/services/brashBoxManage/brashBoxList/brashBoxListApi';
import { getBoxPileManage } from '@/services/essentialData/boxPileManage/boxPileManageApi';

export type BrashBoxModalProps = {
  params: {
    visible: boolean;
    currentRow: BrashBoxListType['task'] | null;
    type: 'add' | 'edit';
  };
  onCancel: () => void;
  onOk: (
    params: Pick<
      BrashBoxListType['task'],
      'billNo' | 'id' | 'ctnType' | 'ctnNumber' | 'totalNumber'
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

  const [isHistory, setIsHistory] = useState<boolean>(false);

  const [checked, setChecked] = useState<boolean>(false);
  const [ctnNumberValue, setCtnNumberValue] = useState<number | null>(null);

  useEffect(() => {
    if (!visible) return;
    init();
  }, [visible]);

  const init = async () => {
    setChecked(false);
    setIsHistory(false);
    try {
      if (!currentRow?.id) {
        !currentRow?.billNo && form.resetFields();
        !currentRow?.billNo &&
          form.setFieldsValue({
            ctnType: '40GP',
            ctnNumber: 1,
          });
        currentRow?.billNo &&
          form.setFieldsValue({
            ...currentRow,
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

      setFormMap(
        currentRow?.id
          ? [...formMap].filter(
              (i) => i.name === 'totalNumber' || i.name === 'billNo',
            )
          : [...formMap],
      );
      setLoading(false);
    } catch {}
  };

  const checkedChange = (checked: boolean) => {
    setChecked(checked);
    if (checked) {
      const totalNumber = form.getFieldValue('totalNumber');
      if (totalNumber) {
        // 同时更新表单字段和状态
        form.setFieldsValue({
          ctnNumber: totalNumber,
        });
        setCtnNumberValue(totalNumber);
        console.log('设置ctnNumber为:', totalNumber);
      } else {
        console.log('totalNumber为空，无法设置ctnNumber');
      }
    } else {
      // 取消勾选时清空状态
      setCtnNumberValue(null);
    }
  };

  // 监听totalNumber变化，当勾选同总箱量时自动更新
  useEffect(() => {
    if (checked) {
      const totalNumber = form.getFieldValue('totalNumber');
      if (totalNumber) {
        form.setFieldsValue({
          ctnNumber: totalNumber,
        });
        setCtnNumberValue(totalNumber);
      }
    }
  }, [form.getFieldValue('totalNumber'), checked]);

  const billNoBlur = async () => {
    if (!form.getFieldValue('billNo')) return;
    // setChecked(false);
    console.log(form.getFieldsValue());
    try {
      const resp = await getBrashBoxListByBillNo(form.getFieldValue('billNo'));
      if (resp?.id) {
        modal.confirm({
          title: `该提单号已有历史刷箱任务`,
          icon: <ExclamationCircleFilled />,
          content: (
            <div>
              <p>已设置总箱量：{resp.totalNumber}</p>
              <p className="my-[12px]">已成功刷箱：{resp.successCount ?? 0}</p>
              <p className="flex items-center">已添加刷箱：{resp.useNumber}</p>
            </div>
          ),
          okText: '确认',
          async onOk() {
            setIsHistory(true);
            form.setFieldsValue({
              ...form.getFieldsValue(),
              totalNumber: resp.totalNumber,
              billNo: resp.billNo,
            });
          },
        });
      } else {
        setIsHistory(false);
        form.setFieldsValue({
          ctnType: '40GP',
          ctnNumber: 1,
          totalNumber: null,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async () => {
        onOk(form.getFieldsValue());
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
          {formMap.map((item) => (
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
                    onBlur={() => billNoBlur()}
                    disabled={!!currentRow?.id}
                  />
                )}
                {item.formType === 'input-number' &&
                  (item.name !== 'totalNumber' && !currentRow?.id ? (
                    <Space>
                      <InputNumber
                        placeholder={`请输入${item.label}`}
                        autoComplete="off"
                        style={{ width: '80%' }}
                        min={1}
                        disabled={
                          item.name === 'totalNumber' &&
                          params.type === 'add' &&
                          form.getFieldValue('totalNumber')
                        }
                        value={ctnNumberValue}
                        onChange={(value) => {
                          setCtnNumberValue(value);
                          form.setFieldsValue({ ctnNumber: value });
                        }}
                      />
                      {
                        <Checkbox
                          checked={checked}
                          onChange={(e) => checkedChange(e.target.checked)}
                          disabled={params.type === 'add' && isHistory}
                        >
                          同总箱量
                        </Checkbox>
                      }
                    </Space>
                  ) : (
                    <InputNumber
                      placeholder={`请输入${item.label}`}
                      autoComplete="off"
                      style={{ width: '100%' }}
                      disabled={
                        (isHistory &&
                          item.name === 'totalNumber' &&
                          !currentRow?.id) ||
                        (!!currentRow?.id && item.name === 'ctnNumber')
                      }
                      min={1}
                    />
                  ))}
                {item.formType === 'normalSelect' && (
                  <Select
                    placeholder={`请选择${item.label}`}
                    filterOption
                    options={(item.options || []).map((opt) => ({
                      label: opt.code,
                      value: opt.code,
                    }))}
                    disabled={!!currentRow?.id}
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
