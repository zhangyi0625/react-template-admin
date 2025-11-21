import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { getSearchCarrier } from '@/services/orderManage/regularBooking/regularBookingApi';
import { SelectProps } from 'antd';

export const FastBookingSource: SelectProps['options'] = [
  {
    value: 'API_YDATA',
    label: '壹沓',
  },
  {
    value: 'WEB',
    label: '网页',
  },
  {
    value: 'APP',
    label: '小程序',
  },
];

export const FastBookingStatus: SelectProps['options'] = [
  {
    value: 'PENDING',
    label: '预定中',
  },
  {
    value: 'PREPARING',
    label: '预定中',
  },
  {
    value: 'PREPARED',
    label: '预定成功',
  },
  {
    value: 'FAILED',
    label: '预定失败',
  },
  {
    value: 'CANCELLED',
    label: '取消预订',
  },
  {
    value: 'CANCELLING',
    label: '取消申请中',
  },
];

export const FastBookingSearchColumns: CustomColumn[] = [
  {
    label: '订单号',
    name: 'orderNo',
    formType: 'input',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '公司名称',
    name: 'affiliateId',
    formType: 'focusSelect',
    options: [],
    selectFileldName: {
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
    label: '创建时间',
    name: 'create',
    formType: 'range-picker',
    span: 6,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '船公司',
    name: 'carrier',
    formType: 'normalSelect',
    options: [],
    api: getSearchCarrier,
    selectFileldName: {
      label: 'carrierCode',
      value: 'carrierCode',
    },
    selectResultKey: null,
    span: 6,
    selectFetch: true,
    hiddenItem: false,
  },
  {
    label: '起运港',
    name: 'porId',
    formType: 'focusSelect',
    options: [],
    selectFileldName: {
      label: 'localName',
      value: 'unlocode',
    },
    apiByUrl: '/api/common/location/list',
    apiByUrlMethod: 'get',
    setSearchKey: 'keyword',
    apiByUrlParams: {
      tag: 'POR',
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
    label: '目的港',
    name: 'fndId',
    formType: 'focusSelect',
    options: [],
    selectFileldName: {
      label: 'localName',
      value: 'unlocode',
    },
    apiByUrl: '/api/common/location/list',
    apiByUrlMethod: 'get',
    setSearchKey: 'keyword',
    apiByUrlParams: {
      tag: 'POR',
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
    label: '订单状态',
    name: 'status',
    formType: 'normalSelect',
    span: 6,
    options: FastBookingStatus,
    selectFetch: false,
    hiddenItem: false,
  },
  {
    label: '订单来源',
    name: 'source',
    formType: 'normalSelect',
    span: 6,
    options: FastBookingSource,
    selectFetch: false,
    hiddenItem: false,
  },
];
