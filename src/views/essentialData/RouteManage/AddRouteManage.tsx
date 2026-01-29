import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import DragModal from '@/components/modal/DragModal';
import type { RouteMangeType } from '@/services/customerInformation/routeManage/routeManageModel';
import { getRouteManageList } from '@/services/customerInformation/routeManage/routeManageApi';

export type AddCustomerManageProps = {
  params: {
    visible: boolean;
    currentRow: RouteMangeType | null;
    view: boolean;
  };
  onOk: (params: RouteMangeType) => void;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const AddRouteManage: React.FC<AddCustomerManageProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow, view } = params;

  const [routeOptions, setRouteOptions] = useState<RouteMangeType[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) return;
    init();
    if (currentRow) {
      form.setFieldsValue(currentRow);
    } else {
      form.resetFields();
    }
  }, [visible, view]);

  const init = async () => {
    try {
      const res = await getRouteManageList();
      setRouteOptions(res.filter((i: RouteMangeType) => !i.parentId));
    } catch (error) {
      console.log(error);
    }
  };

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
        <Form.Item name="parentId" label="一级航线">
          <Select
            options={routeOptions}
            fieldNames={{ label: 'name', value: 'id' }}
            showSearch
            allowClear
            placeholder="选择一级航线"
          />
        </Form.Item>
        <Form.Item
          name="name"
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
        <Form.Item name="remark" label="备注">
          <Input placeholder="请输入备注" autoComplete="off" />
        </Form.Item>
        {/* <Form.Item label="目的港">
          {fndOptions.map((item, index) => (
            <div className="flex items-center mb-[10px]" key={index}>
              <Select
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
                onClear={() => onClear(index)}
                value={item}
              />
              <img
                onClick={() => deleteFndPort(index)}
                src={DeleteIcon}
                alt="delete"
                className={`${
                  fndOptions.length <= 1 && 'hidden'
                } w-[14px] h-[14px] ml-[12px] cursor-pointer`}
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
        </Form.Item> */}
      </Form>
    </DragModal>
  );
};

export default AddRouteManage;
