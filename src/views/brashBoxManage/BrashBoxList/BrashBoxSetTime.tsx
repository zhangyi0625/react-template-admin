import DragModal from '@/components/modal/DragModal';
import { DatePicker, Form, Input, InputNumber, TimePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import deleteIcon from '@/assets/svg/icon/delete.svg';
import addIcon from '@/assets/svg/icon/add.svg';

export type BrashBoxSetTimeProps = {
  params: {
    visible: boolean;
    currentRow: any;
  };
  onOk: (params: any) => void;
  onCancel: () => void;
};

const BrashBoxSetTime: React.FC<BrashBoxSetTimeProps> = ({
  params,
  onOk,
  onCancel,
}) => {
  const { visible, currentRow } = params;

  const { RangePicker } = DatePicker;

  const [form] = Form.useForm();

  const [dateList, setDateList] = useState([
    {
      startTime: '',
      endTime: '',
      startTimeStr: 0,
      endTimeStr: 0,
    },
  ]);

  useEffect(() => {
    if (!visible) return;
    setDateList([
      {
        startTime: '',
        endTime: '',
        startTimeStr: 0,
        endTimeStr: 0,
      },
    ]);
  }, [visible]);

  const handleOk = () => {};
  return (
    <DragModal
      width="60%"
      open={visible}
      title={'设置时间段'}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} labelCol={{ span: 4 }}>
        <Form.Item name="id" hidden>
          <Input disabled />
        </Form.Item>
        <Form.Item name="date" label="刷箱时间段">
          <div className="flex flex-col">
            {dateList.map((item, index) => (
              <div key={index} className="flex items-center mb-[10px]">
                <RangePicker />
                <p className="mx-[10px]">频率</p>
                <InputNumber
                  value={item.startTimeStr}
                  style={{ width: '100px' }}
                />
                ~
                <InputNumber
                  value={item.endTimeStr}
                  style={{ width: '100px' }}
                />
                <p className="text-[12px] text-[#999]">分钟刷新一次</p>
                {dateList.length > 1 && index !== 0 && (
                  <img
                    src={deleteIcon}
                    alt=""
                    className="w-[16px] h-[16px] cursor-pointer ml-[8px]"
                    onClick={() =>
                      setDateList(dateList.filter((_, i) => i !== index))
                    }
                  />
                )}
              </div>
            ))}
            <div
              className="flex items-center"
              onClick={() =>
                setDateList([
                  ...dateList,
                  {
                    startTime: '',
                    endTime: '',
                    startTimeStr: 0,
                    endTimeStr: 0,
                  },
                ])
              }
            >
              <img
                src={addIcon}
                alt=""
                className="w-[16px] h-[16px] cursor-pointer mr-[8px]"
              />
              <p style={{ color: '#52C41A' }}>新增时间段</p>
            </div>
          </div>
        </Form.Item>
      </Form>
    </DragModal>
  );
};

export default BrashBoxSetTime;
