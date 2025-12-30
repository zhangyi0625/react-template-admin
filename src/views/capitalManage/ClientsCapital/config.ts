import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const ClientsCapitalSearchColumns: CustomColumn[] = [
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
    label: '订单编号',
    name: 'tradeNo',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '资金类型',
    name: 'fund',
    formType: 'normalSelect',
    options: [],
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '交易创建时间',
    name: 'created',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];
