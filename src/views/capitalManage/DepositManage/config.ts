import { SelectProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const DepositManageStatusOptions: SelectProps['options'] = [
  {
    label: '待处理',
    value: 'CREATED',
  },
  {
    label: '已处理',
    value: 'DISCHARGED',
  },
  {
    label: '已驳回',
    value: 'FAILED',
  },
];

export const DisposeOptions: SelectProps['options'] = [
  {
    label: '接受',
    value: 'accpet',
  },
  {
    label: '驳回',
    value: 'reject',
  },
];

export const DepositManageSearchColumns: CustomColumn[] = [
  {
    label: '用户名',
    name: 'customerId',
    formType: 'focusSelect',
    options: [],
    selectFileldName: {
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
    label: '业务归属',
    name: 'fund',
    formType: 'normalSelect',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '提现处理状态',
    name: 'status',
    formType: 'normalSelect',
    options: DepositManageStatusOptions,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '提现发起时间',
    name: 'created',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];
