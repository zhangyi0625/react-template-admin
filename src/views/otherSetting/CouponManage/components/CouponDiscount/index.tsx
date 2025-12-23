import React from 'react';
import { Form, InputNumber, Select } from 'antd';
import type { CouponManageEditType } from '@/services/otherSetting/couponManage/couponManageModel';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export type CouponDiscountType = {
  content: CouponManageEditType['discount'];
  items: Omit<CustomColumn, 'selectFetch'>;
  onChangeContent: (
    value: string | number,
    key: keyof CouponManageEditType['discount']
  ) => void;
};

const CouponDiscount: React.FC<CouponDiscountType> = ({
  content,
  items,
  onChangeContent,
}) => {
  return (
    <>
      <Form.Item label={items.label} name={items.name}>
        <div className="grid grid-cols-2 gap-x-[23px]">
          <Form.Item>
            <Select
              placeholder={`请选择${items.label}`}
              filterOption
              showSearch
              options={items.options}
              value={content?.type}
              onChange={(value) => onChangeContent(value, 'type')}
            />
          </Form.Item>
          {content?.type === 'AMOUNT' ? (
            <Form.Item name="discountThreshold">
              <div className="flex items-center">
                满
                <InputNumber
                  min={0}
                  style={{ margin: '0 20px', width: '140px' }}
                  value={content?.threshold}
                  placeholder="请填写金额"
                  onChange={(value) => onChangeContent(value ?? 0, 'threshold')}
                />
                减
                <InputNumber
                  min={0}
                  style={{ marginLeft: '20px', width: '140px' }}
                  value={content?.amount}
                  placeholder="请填写金额"
                  onChange={(value) => onChangeContent(value ?? 0, 'amount')}
                />
              </div>
            </Form.Item>
          ) : (
            <Form.Item name="discountAmount">
              <div className="flex items-center">
                减免金额
                <InputNumber
                  min={0}
                  style={{ marginLeft: '20px', width: '140px' }}
                  value={content?.amount}
                  placeholder="请填写金额"
                  onChange={(value) => onChangeContent(value ?? 0, 'amount')}
                />
              </div>
            </Form.Item>
          )}
        </div>
      </Form.Item>
    </>
  );
};

export default CouponDiscount;
