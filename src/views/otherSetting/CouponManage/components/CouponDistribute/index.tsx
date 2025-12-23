import React from 'react';
import { DatePicker, Form, Input, Select } from 'antd';
import type { CouponManageEditType } from '@/services/otherSetting/couponManage/couponManageModel';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import dayjs, { Dayjs } from 'dayjs';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';

export type CouponDistributeType = {
  content: CouponManageEditType['distribute'];
  items: Omit<CustomColumn, 'selectFetch'>;
  onChangeContent: (
    value: string | number | object,
    key: keyof CouponManageEditType['distribute']
  ) => void;
};

const CouponDistribute: React.FC<CouponDistributeType> = ({
  content,
  items,
  onChangeContent,
}) => {
  const { RangePicker } = DatePicker;

  const { publicData } = useSelector((state: RootState) => state.publicSetting);

  const dayChange = (dates: null | (Dayjs | null)[]) => {
    let taskValidFrom = '';
    let taskValidTo = '';

    if (dates) {
      taskValidFrom = dates[0]?.format('YYYY-MM-DD HH:mm:ss') ?? '';
    }
    if (dates) {
      taskValidTo = dates[1]?.format('YYYY-MM-DD HH:mm:ss') ?? '';
    }
    onChangeContent(
      { taskValidFrom: taskValidFrom, taskValidTo: taskValidTo },
      'taskValidFrom'
    );
  };
  return (
    <>
      <div className="grid grid-cols-2 gap-x-[23px]">
        <Form.Item name="distributeType" label={items.label}>
          <Select
            placeholder="请选择发放方式"
            filterOption
            showSearch
            options={items.options}
            value={content?.type}
            onChange={(value) => onChangeContent(value, 'type')}
          />
        </Form.Item>
        {content.type === 'LINK' && (
          <>
            <Form.Item label="链接有效期">
              <RangePicker
                style={{ width: '100%' }}
                format={'YY-MM-DD HH:mm:ss'}
                value={[
                  content?.taskValidFrom ? dayjs(content?.taskValidFrom) : null,
                  content?.taskValidTo ? dayjs(content?.taskValidTo) : null,
                ]}
                needConfirm={true}
                onChange={dayChange}
              />
            </Form.Item>
            <Form.Item label="发放总量">
              <Input
                allowClear
                autoComplete="off"
                placeholder="请填写优惠券总数上线"
                value={content?.totalNum}
                onChange={(e) => onChangeContent(e.target.value, 'totalNum')}
              />
            </Form.Item>
            <Form.Item label="每人可领取数量">
              <Input
                allowClear
                autoComplete="off"
                placeholder="请输入优惠券链接"
                value={content?.perNum}
                onChange={(e) => onChangeContent(e.target.value, 'perNum')}
              />
            </Form.Item>
          </>
        )}
        {content.type === 'TRIGGER_EVENT' && (
          <>
            <Form.Item label="发放有效期">
              <RangePicker
                style={{ width: '100%' }}
                format={'YY-MM-DD HH:mm:ss'}
                onChange={(value) => {
                  onChangeContent(
                    value ? value[0]?.format('YYYY-MM-DD HH:mm:ss') ?? '' : '',
                    'taskValidFrom'
                  );
                  onChangeContent(
                    value ? value[1]?.format('YYYY-MM-DD HH:mm:ss') ?? '' : '',
                    'taskValidTo'
                  );
                }}
              />
            </Form.Item>
            <Form.Item label="动作类型">
              <Select
                placeholder="请选择动作类型"
                filterOption
                showSearch
                options={Object.keys(publicData?.couponTriggerEvent || {}).map(
                  (key) => ({
                    label: publicData?.couponTriggerEvent?.[key],
                    value: key,
                  })
                )}
                value={content?.taskEvent}
                onChange={(value) => onChangeContent(value, 'taskEvent')}
              />
            </Form.Item>
            <Form.Item label="每人发放数量">
              <Input
                allowClear
                autoComplete="off"
                placeholder="请填写每人发放的优惠券数量"
                value={content?.perNum}
                onChange={(e) => onChangeContent(e.target.value, 'perNum')}
              />
            </Form.Item>
          </>
        )}
      </div>
    </>
  );
};

export default CouponDistribute;
