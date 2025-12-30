import { SelectProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const LevelOptions: SelectProps['options'] = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '周卡',
    value: '5',
  },
  {
    label: '年卡',
    value: '7',
  },
  {
    label: '查询会员',
    value: '11',
  },
  {
    label: '认证买家',
    value: '12',
  },
  {
    label: '认证卖家',
    value: '13',
  },
];

export const LevelManageSearchColumns: CustomColumn[] = [
  {
    label: '公司名称',
    name: 'affiliateId',
    formType: 'focusSelect',
    options: [],
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
    apiByUrl: '/api/staff/customer/affiliate/list',
    apiByUrlMethod: 'get',
    setSearchKey: 'keyword',
    apiByUrlParams: {
      keyword: null,
    },
    apiByUrlHeaders: {
      authorization: 'Bearer ' + sessionStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    span: 6,
    selectFetch: true,
    hiddenItem: false,
  },
  {
    label: '用户名',
    name: 'customerId',
    formType: 'focusSelect',
    options: [],
    selectFieldName: {
      label: 'name',
      value: 'id',
    },
    apiByUrl: '/api/staff/customer/list',
    apiByUrlMethod: 'get',
    setSearchKey: 'keyword',
    apiByUrlParams: {
      keyword: null,
    },
    apiByUrlHeaders: {
      authorization: 'Bearer ' + sessionStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
    span: 6,
    selectFetch: true,
    hiddenItem: false,
  },
  {
    label: '等级类型',
    name: 'gradeLevel',
    formType: 'normalSelect',
    options: LevelOptions,
    defaultValue: '',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '创建时间',
    name: 'create',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];
