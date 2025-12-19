import { changeSelectOptionsByLabel } from '@/utils/options';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const ServiceChargeManageType = {
  'BOOKING,PREBOOKING': '现舱、预定',
  BOOKING: '现舱',
  PREBOOKING: '预定',
};

export const ServiceChargeManageForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '规则名称',
    name: 'name',
    formType: 'input',
    span: 6,
    isRules: true,
  },
  {
    label: '分类',
    name: 'services',
    formType: 'radio',
    options: Object.keys(ServiceChargeManageType).map((key) => ({
      label:
        ServiceChargeManageType[key as keyof typeof ServiceChargeManageType],
      value: key,
    })),
    span: 6,
  },
  {
    label: '分组名',
    name: 'plan',
    formType: 'input',
    span: 6,
  },
  {
    label: '状态',
    name: 'valid',
    formType: 'radio',
    options: changeSelectOptionsByLabel(['有效', '无效']),
    span: 6,
  },
  {
    label: '优先级',
    name: 'priority',
    formType: 'input',
    span: 6,
    isRules: true,
  },
  {
    label: '有效开始时间',
    name: 'validFrom',
    formType: 'date-picker',
    span: 6,
  },
  {
    label: '有效结束时间',
    name: 'validTo',
    formType: 'date-picker',
    span: 6,
  },
  {
    label: '备注',
    name: 'remarks',
    formType: 'input',
    span: 6,
  },
];
