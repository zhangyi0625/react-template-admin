import { SelectProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export type AffiliateManageTabItemsType = {
  key: string | number | null;
  label: string;
};

export interface AffiliateManageDetailEditFormProps extends Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
> {
  disabled: boolean;
  ExtraKey?: string;
}

export const AffiliateManageTabItems: AffiliateManageTabItemsType[] = [
  {
    key: '',
    label: '全部客户',
  },
  {
    key: 15,
    label: '15天内到期',
  },
  {
    key: 30,
    label: '30天内到期',
  },
  {
    key: 60,
    label: '60天内到期',
  },
];

export const AffiliateLevel: SelectProps['options'] = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '认证企业',
    value: 10,
  },
  {
    label: '查询会员',
    value: 11,
  },
  {
    label: '认证买家',
    value: 12,
  },
  {
    label: '认证卖家',
    value: 13,
  },
  {
    label: '定制客户',
    value: 21,
  },
];

export const AffiliateSource: SelectProps['options'] = [
  {
    label: '系统',
    value: 'SYSTEM',
  },
  {
    label: '航迅科技',
    value: 'UFMS',
  },
  {
    label: '伟大联盟',
    value: 'API',
  },
];

export const AffiliateManageSearchColumns: CustomColumn[] = [
  {
    label: '客户分类',
    name: 'level',
    formType: 'normalSelect',
    options: AffiliateLevel,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
    defaultValue: '',
  },
  {
    label: '公司名称',
    name: 'name',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '联系方式',
    name: 'contactKeyword',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '客户来源',
    name: 'source',
    formType: 'normalSelect',
    options: AffiliateSource,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '供应商查询',
    name: 'showSupplier',
    formType: 'normalSelect',
    options: [
      {
        label: '全部',
        value: '',
      },
      {
        label: '已开启',
        value: 1,
      },
      {
        label: '已关闭',
        value: 0,
      },
    ],
    defaultValue: '',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const AffiliateManageForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '公司名称',
    name: 'name',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '公司简称',
    name: 'shortName',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '企业类型',
    name: 'type',
    formType: 'normalSelect',
    span: 12,
    options: [],
    isRules: true,
  },
  {
    label: '联系方式（主）',
    name: 'tel',
    formType: 'input',
    span: 12,
    isRules: false,
  },
  {
    label: '常用邮箱',
    name: 'email',
    formType: 'input',
    span: 12,
    isRules: false,
  },
  {
    label: '社会统一信用代码',
    name: 'businessCode',
    formType: 'input',
    span: 12,
    isRules: false,
  },
  {
    label: '客户来源',
    name: 'source',
    formType: 'normalSelect',
    span: 12,
    options: AffiliateSource,
    isRules: false,
  },
];

export const AffiliateManageDetailEditForm: AffiliateManageDetailEditFormProps[] =
  [
    {
      label: '公司名称',
      name: 'name',
      formType: 'input',
      span: 12,
      isRules: true,
      disabled: false,
    },
    {
      label: '创建时间',
      name: 'created',
      formType: 'date-picker',
      span: 12,
      disabled: true,
    },
    {
      label: '公司简称',
      name: 'shortName',
      formType: 'input',
      span: 12,
      isRules: true,
      disabled: false,
    },
    {
      label: '客户分类',
      name: 'level',
      formType: 'normalSelect',
      options: AffiliateLevel,
      span: 12,
      disabled: false,
      ExtraKey: 'grade',
    },
    {
      label: '企业类型',
      name: 'type',
      formType: 'normalSelect',
      options: [],
      span: 12,
      disabled: false,
    },
    {
      label: '子账号限制数',
      name: 'customersLimit',
      formType: 'input-number',
      span: 12,
      isRules: true,
      disabled: false,
    },
    {
      label: '联系方式',
      name: 'tel',
      formType: 'input',
      span: 12,
      isRules: true,
      disabled: false,
      ExtraKey: 'contact',
    },
    {
      label: '会员有效期',
      name: 'validTo',
      formType: 'date-picker',
      span: 12,
      isRules: true,
      disabled: false,
      ExtraKey: 'grade',
    },
    {
      label: '常用邮箱',
      name: 'email',
      formType: 'input',
      span: 12,
      disabled: false,
      ExtraKey: 'contact',
    },
    {
      label: '社会信用代码',
      name: 'businessCode',
      formType: 'input',
      span: 12,
      isRules: true,
      disabled: false,
    },
    {
      label: 'API访问密钥',
      name: 'freightRealApiKey',
      formType: 'input',
      span: 12,
      disabled: false,
      ExtraKey: 'businessConfig',
    },
    {
      label: '开通运价系统',
      name: 'enableFreightRealApi',
      formType: 'normalSelect',
      options: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
      span: 12,
      disabled: false,
      ExtraKey: 'businessConfig',
    },
    {
      label: '运价系统域名',
      name: 'qmsDomain',
      formType: 'input',
      span: 12,
      disabled: false,
      ExtraKey: 'businessConfig',
    },
    {
      label: '过期时间',
      name: 'freightRealApiKeyExpire',
      formType: 'date-picker',
      span: 12,
      disabled: false,
      ExtraKey: 'businessConfig',
    },
  ];

export const AffiliateUserDrawerColumns: CustomColumn[] = [
  {
    label: '真实姓名',
    name: 'name',
    formType: 'input',
    span: 12,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '手机号',
    name: 'phone',
    formType: 'input',
    span: 12,
    selectFetch: false,
    hiddenItem: false,
  },
];
