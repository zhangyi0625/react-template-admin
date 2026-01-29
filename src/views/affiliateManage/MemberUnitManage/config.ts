import type { SelectProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const MemberUnitManageUnitLevelOptions: SelectProps['options'] = [
  {
    label: '会长单位',
    value: 1,
  },
  {
    label: '副会长单位',
    value: 3,
  },
  {
    label: '理事单位',
    value: 5,
  },
  {
    label: '监事单位',
    value: 7,
  },
  {
    label: '会员单位',
    value: 9,
  },
];

export const MemberUnitManageMemberLevelOptions: SelectProps['options'] = [
  {
    label: 'V1',
    value: 1,
  },
  {
    label: 'V2',
    value: 2,
  },
  {
    label: 'V3',
    value: 3,
  },
  {
    label: 'V4',
    value: 4,
  },
  {
    label: 'V5',
    value: 5,
  },
];

export const MemberUnitManageSearchColumns: CustomColumn[] = [
  {
    label: '公司名称',
    name: 'name',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '单位类型',
    name: 'unitLevel',
    formType: 'normalSelect',
    options: MemberUnitManageUnitLevelOptions,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '会员到期日期',
    name: ['memberExpiryDateStart', 'memberExpiryDateEnd'],
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];

export const MemberUnitManageForm: Omit<
  CustomColumn,
  'selectFetch' | 'hiddenItem'
>[] = [
  {
    label: '企业名称',
    name: 'name',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '社会统一信用代码',
    name: 'socialCode',
    formType: 'input',
    span: 12,
    isRules: true,
  },
  {
    label: '单位类型',
    name: 'unitLevel',
    formType: 'normalSelect',
    options: MemberUnitManageUnitLevelOptions,
    span: 12,
    isRules: true,
  },
  {
    label: '会员到期日期',
    name: 'memberExpiryDate',
    formType: 'date-picker',
    span: 12,
    isRules: true,
  },
  {
    label: '会员等级',
    name: 'memberLevel',
    formType: 'normalSelect',
    options: MemberUnitManageMemberLevelOptions,
    span: 12,
    isRules: true,
  },
  {
    label: '企业成立日期',
    name: 'establishmentDate',
    formType: 'date-picker',
    span: 12,
  },
  {
    label: '企业联系电话',
    name: 'contactPhone',
    formType: 'input',
    span: 12,
  },
  {
    label: '企业地址',
    name: 'address',
    formType: 'input',
    span: 12,
  },
  {
    label: '企业简介',
    name: 'enterpriseDescription',
    formType: 'textarea',
    span: 24,
  },
];

export const MemberUnitManageAdvantageOptions: SelectProps['options'] = [
  {
    label: '租船',
    value: '30',
  },
  {
    label: '海运整箱',
    value: '1',
  },
  {
    label: '海运拼箱',
    value: '2',
  },
  {
    label: '航空运输',
    value: '3',
  },
  {
    label: '特种箱',
    value: '4',
  },
  {
    label: '冷冻箱',
    value: '5',
  },
  {
    label: 'TANK箱',
    value: '6',
  },
  {
    label: '液袋运输',
    value: '7',
  },
  {
    label: '滚装散杂',
    value: '8',
  },
  {
    label: '大件运输',
    value: '9',
  },
  {
    label: '展会运输',
    value: '10',
  },
  {
    label: '欧亚铁路',
    value: '11',
  },
  {
    label: '项目物流',
    value: '12',
  },
  {
    label: '多式联运',
    value: '13',
  },
  {
    label: '危险品海运',
    value: '14',
  },
  {
    label: '危险品空运',
    value: '15',
  },
  {
    label: '危险品陆运',
    value: '16',
  },
  {
    label: '海外代理',
    value: '17',
  },
  {
    label: '集卡陆运',
    value: '18',
  },
  {
    label: '仓储服务',
    value: '19',
  },
  {
    label: '装箱服务',
    value: '20',
  },
  {
    label: '报关报检',
    value: '21',
  },
  {
    label: 'FBA物流',
    value: '22',
  },
  {
    label: '国际快递',
    value: '23',
  },
  {
    label: '国际搬家',
    value: '24',
  },
  {
    label: '供应链金融',
    value: '25',
  },
  {
    label: '货运保险',
    value: '26',
  },
  {
    label: '法律咨询',
    value: '27',
  },
  {
    label: '物流软件',
    value: '28',
  },
  {
    label: '内贸运输',
    value: '29',
  },
  {
    label: '拖车',
    value: '32',
  },
  {
    label: '框架',
    value: '33',
  },
  {
    label: '目的港拖车',
    value: '34',
  },
  {
    label: 'SOC',
    value: '35',
  },
  {
    label: '进口清关',
    value: '36',
  },
  {
    label: '演艺物流',
    value: '37',
  },
  {
    label: '特种工程项目物流',
    value: '38',
  },
  {
    label: 'ATA报关',
    value: '39',
  },
  {
    label: '直客',
    value: '40',
  },
];
