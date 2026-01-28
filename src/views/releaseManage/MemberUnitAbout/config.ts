import type { SelectProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const MemberUnitAboutGroupOptions: SelectProps['options'] = [
  {
    label: '协会概况',
    value: '协会概况',
  },
  {
    label: '入会申请',
    value: '入会申请',
  },
  {
    label: '咨询热线',
    value: '咨询热线',
  },
];

export const MemberUnitAboutSearchColumns: CustomColumn[] = [
  {
    label: '分组',
    name: 'groupName',
    formType: 'normalSelect',
    options: MemberUnitAboutGroupOptions,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const MemberUnitAboutForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '栏目名称',
    name: 'columnName',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '分组',
    name: 'groupName',
    formType: 'normalSelect',
    options: MemberUnitAboutGroupOptions,
    span: 12,
    isRules: true,
  },
  {
    label: '显示顺序',
    name: 'sort',
    formType: 'input-number',
    span: 12,
    isRules: true,
  },
  {
    label: '栏目类型',
    name: 'type',
    formType: 'radio',
    options: [
      {
        label: '文本',
        value: 'content',
      },
      {
        label: '图片',
        value: 'imageIds',
      },
    ],
    span: 12,
    isRules: true,
  },
];
