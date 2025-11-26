import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';
import { getSearchCarrier } from '@/services/orderManage/regularBooking/regularBookingApi';
import { SelectProps } from 'antd';
import type { RegularBookingDetailBaseInfoType } from '../RegularBooking/type';
import { formatTime } from '@/utils/format';

export type FastBookingDetailStatusType = {
  label: string;
  value: string;
  icon: string;
  operationIcon: string;
};

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

export const FastDetailBaseInfoOptions: RegularBookingDetailBaseInfoType[] = [
  {
    label: '订单编号',
    key: 'no',
    type: 'ALL',
  },
  {
    label: '船公司',
    key: 'content',
    type: 'ALL',
    getValue: (value) => value.carriers![0],
  },
  {
    label: '订单创建时间',
    key: 'created',
    type: 'ALL',
    getValue: (value) => formatTime(value, 'Y/M/D h:m:s'),
  },
  {
    label: '起运港',
    key: 'content',
    type: 'ALL',
    getValue: (value) =>
      value.por?.name +
      '--' +
      value.por?.localName +
      '--' +
      value.por?.countryLocalName,
  },
  {
    label: '开航起始时间',
    key: 'content',
    type: 'PREBOOKING',
    getValue: (value) => formatTime(value?.etdStart, 'Y-M-D h:m'),
  },
  {
    label: '航线代码',
    key: 'content',
    type: 'ALL',
    getValue: (value) => value.voyCode,
  },
  {
    label: '开航截止时间',
    key: 'content',
    type: 'PREBOOKING',
    getValue: (value) => formatTime(value?.etdStart, 'Y-M-D h:m'),
  },
  {
    label: '船名航次',
    key: 'content',
    type: 'ALL',
    getValue: (value) => value?.voyageInfo,
  },
  {
    label: '目的港',
    key: 'content',
    type: 'ALL',
    getValue: (value) =>
      value.por?.name +
      '--' +
      value.por?.localName +
      '--' +
      value.por?.countryLocalName,
  },
  {
    label: '预计放舱日期',
    key: 'content',
    type: 'PREBOOKING',
    getValue: (value) => formatTime(value?.laydownDate, 'Y-M-D h:m'),
  },
  {
    label: '预定截止时间',
    key: 'content',
    type: 'PREBOOKING',
    getValue: (value) => formatTime(value?.deadline, 'Y-M-D h:m'),
  },
  {
    label: '所属公司',
    key: 'affiliateName',
    type: 'ALL',
  },
  {
    label: '订舱账号',
    key: 'orderCarrierAccounts',
    type: 'ALL',
    getValue: (value) => (value ? '使用自有船司账号' : '使用第三方账号'),
  },
  {
    label: '其他要求',
    key: 'cargo',
    type: 'ALL',
    getValue: () => '查看',
  },
  {
    label: '操作人',
    key: 'customerName',
    type: 'ALL',
  },
];

export const FastBookingDetailStatus: FastBookingDetailStatusType[] = [
  {
    value: 'PENDING',
    label: '预备预定',
    icon: 'prepareBooking',
    operationIcon: 'prepareBooking-op',
  },
  {
    value: 'PREPARING',
    label: '预定中',
    icon: 'prepareBooking',
    operationIcon: 'prepareBooking-op',
  },
  {
    value: 'PREPARED',
    label: '预定成功',
    icon: 'success',
    operationIcon: 'success-op',
  },
  {
    value: 'FAILED',
    label: '预定失败',
    icon: 'cancel',
    operationIcon: 'cancel-op',
  },
  {
    value: 'CANCELLED',
    label: '取消预订',
    icon: 'cancel',
    operationIcon: 'cancel-op',
  },
  {
    value: 'CANCELLING',
    label: '取消申请中',
    icon: '',
    operationIcon: '',
  },
];
