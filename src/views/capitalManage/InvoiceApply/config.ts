import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { changeSelectOptionsByLabel } from '@/utils/options';

export const InvoiceApplySearchColumns: CustomColumn[] = [
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
    label: '开票状态',
    formType: 'normalSelect',
    options: changeSelectOptionsByLabel(['待开票', '已开票']),
    name: 'status',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
];
