import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { SelectProps } from 'antd/es/select';
import DragModal from '@/components/modal/DragModal';
import type { RouteMangeType } from '@/services/customerInformation/routeManage/routeManageModel';
import DeleteIcon from '@/assets/svg/icon/delete.svg';
import AddIcon from '@/assets/svg/icon/add.svg';

export type AddCustomerManageProps = {
  params: {
    visible: boolean;
    currentRow: RouteMangeType;
    view: boolean;
  };
  fndPortOptions: SelectProps['options'];
  onOk: (params: RouteMangeType) => void;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const AddRouteManage: React.FC<AddCustomerManageProps> = ({
  params,
  fndPortOptions,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow, view } = params;

  const [form] = Form.useForm();

  const [fndOptions, setFndOptions] = useState<string[] | undefined[]>([]);

  useEffect(() => {
    if (!visible) return;
    if (currentRow) {
      form.setFieldsValue(currentRow);
      let fndPort = currentRow.fnds as string[];
      setFndOptions(fndPort);
    } else {
      form.resetFields();
      setFndOptions([undefined]);
    }
  }, [visible, view]);

  const addFndPort = () => {
    setFndOptions(fndOptions.concat([undefined]) as undefined[]);
  };

  const deleteFndPort = (index: number) => {
    setFndOptions([
      ...fndOptions.filter((_, i: number) => i !== index),
    ] as string[]);
  };

  const selectChange = (value: string, index: number) => {
    fndOptions[index] = value;
    setFndOptions([...fndOptions] as string[]);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        console.log(form.getFieldsValue(), fndOptions);
        onOk({
          ...form.getFieldsValue(),
          fnds: fndOptions.filter((item) => !!item),
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
      width="40%"
      open={visible}
      title={currentRow ? '编辑航线' : '新增航线'}
      okButtonProps={{ className: view ? 'hidden' : '' }}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="routeName"
          label="航线"
          rules={[
            {
              required: true,
              message: '请输入航线名称',
            },
          ]}
        >
          <Input placeholder="请输入航线名称" autoComplete="off" />
        </Form.Item>
        <Form.Item label="目的港">
          {fndOptions.map((item, index) => (
            <div className="flex items-center" key={index}>
              <Select
                style={{ marginBottom: '10px' }}
                allowClear
                placeholder="请选择目的港"
                showSearch
                options={fndPortOptions}
                filterOption={(input, option) =>
                  String(option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(value) => selectChange(value, index)}
                value={item}
              />
              <img
                onClick={() => deleteFndPort(index)}
                src={DeleteIcon}
                alt="delete"
                className={`${
                  fndOptions.length <= 1 && 'hidden'
                } w-[14px] h-[14px] ml-[12px] mb-[10px] cursor-pointer`}
              />
            </div>
          ))}
          <div
            className="flex items-center cursor-pointer w-fit"
            onClick={addFndPort}
          >
            <img
              src={AddIcon}
              alt="add"
              className="w-[14px] h-[14px] mr-[4px]"
            />
            <p className="text-green-500 text-sm">新增港口</p>
          </div>
        </Form.Item>
      </Form>
    </DragModal>
  );
};

export default AddRouteManage;
