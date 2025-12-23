import { CouponManageEditType } from '@/services/otherSetting/couponManage/couponManageModel';
import { DatePicker, Form, Input, Select } from 'antd';
import { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import dayjs, { Dayjs } from 'dayjs';

export type CouponValidRuleType = {
  content: CouponManageEditType['validRule'];
  items: Omit<CustomColumn, 'selectFetch'>;
  onChangeContent: (
    value: string | number | object,
    key: keyof CouponManageEditType['validRule']
  ) => void;
};

const CouponValidRule: React.FC<CouponValidRuleType> = ({
  content,
  items,
  onChangeContent,
}) => {
  const { RangePicker } = DatePicker;

  const dayChange = (dates: null | (Dayjs | null)[]) => {
    let validFrom = '';
    let validTo = '';

    if (dates) {
      validFrom = dates[0]?.format('YYYY-MM-DD HH:mm:ss') ?? '';
    }
    if (dates) {
      validTo = dates[1]?.format('YYYY-MM-DD HH:mm:ss') ?? '';
    }
    onChangeContent({ validFrom: validFrom, validTo: validTo }, 'validFrom');
  };
  return (
    <>
      <div className="grid grid-cols-2 gap-x-[23px]">
        <Form.Item name="validRuleType" label={items.label}>
          <Select
            placeholder={`请选择${items.label}`}
            filterOption
            showSearch
            options={items.options}
            value={content?.type}
            onChange={(value) => onChangeContent(value, 'type')}
          />
        </Form.Item>
        {content.type === 'ABSOLUTE' && (
          <Form.Item label={items.label}>
            <RangePicker
              style={{ width: '100%' }}
              format={'YY-MM-DD HH:mm:ss'}
              value={[
                content?.validFrom ? dayjs(content?.validFrom) : null,
                content?.validTo ? dayjs(content?.validTo) : null,
              ]}
              needConfirm={true}
              onChange={dayChange}
            />
          </Form.Item>
        )}
        {content.type === 'RELATIVE' && (
          <Form.Item label={items.label}>
            <Input
              allowClear
              autoComplete="off"
              placeholder="请填写领取后有效天数"
              value={content?.validRuleDay}
              onChange={(e) => onChangeContent(e.target.value, 'validRuleDay')}
            />
          </Form.Item>
        )}
      </div>
    </>
  );
};

export default CouponValidRule;
