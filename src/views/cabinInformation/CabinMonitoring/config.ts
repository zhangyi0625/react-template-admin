import { SelectProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export const CabinMonitoringStatusOptions: SelectProps['options'] = [
  {
    label: '关闭',
    value: 'STOP',
  },
  {
    label: '开启',
    value: 'RUNNING',
  },
  {
    label: '待审核',
    value: 'CREATED',
  },
];

export const VesselStatusOptions: SelectProps['options'] = [
  {
    label: '可订舱',
    value: 'available',
  },
  {
    label: '售罄',
    value: 'sold out',
  },
];

export const CabinMonitoringSearchColumns: CustomColumn[] = [
  {
    label: '任务编号',
    name: 'taskId',
    formType: 'input',
    span: 6,
    hiddenItem: false,
    selectFetch: false,
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
    label: '状态',
    name: 'status',
    formType: 'normalSelect',
    options: CabinMonitoringStatusOptions,
    span: 6,
    hiddenItem: false,
    selectFetch: false,
  },
];

export const CabinMonitoringCarrierType: SelectProps['options'] &
  { carrier: string }[] = [
  {
    label: '普货',
    value: 'Common',
    carrier: 'MSK',
  },
  {
    label: '普货合约',
    value: 'Contract',
    carrier: 'MSK',
  },
  {
    label: '危险品',
    value: 'Dangerous',
    carrier: 'MSK',
  },
  {
    label: 'QQ普通运价',
    value: 'HPLQQ',
    carrier: 'HPL',
  },
];

export const CabinMonitoringExtraForms: Record<
  string,
  Omit<CustomColumn, 'selectFetch'>[]
> = {
  Contract: [
    {
      label: '品名',
      name: 'commodityName',
      formType: 'input',
      span: 6,
      hiddenItem: false,
    },
    {
      label: '舱位状态',
      name: 'vesselStatus',
      formType: 'normalSelect',
      options: VesselStatusOptions,
      span: 6,
      hiddenItem: false,
    },
    {
      label: 'Customer Code',
      name: 'customerCode',
      formType: 'input',
      span: 6,
      hiddenItem: false,
      customPlaceholder:
        '请输入持约方的CustomerCode(如果你是合约方，可不用填写)',
    },
  ],
  Common: [
    {
      label: '品名',
      name: 'commodityName',
      formType: 'input',
      span: 6,
      hiddenItem: false,
    },
    {
      label: '舱位状态',
      name: 'vesselStatus',
      formType: 'normalSelect',
      options: VesselStatusOptions,
      span: 6,
      hiddenItem: false,
    },
  ],
  Dangerous: [
    {
      label: '品名',
      name: 'commodityName',
      formType: 'input',
      span: 6,
      hiddenItem: false,
    },
    {
      label: '舱位状态',
      name: 'vesselStatus',
      formType: 'normalSelect',
      options: VesselStatusOptions,
      span: 6,
      hiddenItem: false,
    },
    {
      label: 'UN编码',
      name: 'unNumber',
      formType: 'input',
      span: 6,
      hiddenItem: false,
    },
    {
      label: '技术名称',
      name: 'technicaIName',
      formType: 'input',
      span: 6,
      hiddenItem: false,
    },
    {
      label: '附加隔离组',
      name: 'additionalSegregationGroups',
      formType: 'input',
      span: 6,
      hiddenItem: false,
    },
    {
      label: '包装类型',
      name: 'outerPackaging',
      formType: 'input',
      span: 6,
      hiddenItem: false,
    },
    {
      label: '总重',
      name: 'grossWeight',
      formType: 'input',
      span: 6,
      hiddenItem: false,
    },
    {
      label: '净重',
      name: 'netWeight',
      formType: 'input',
      span: 6,
      hiddenItem: false,
    },
    {
      label: '紧急联系人姓名',
      name: 'name',
      formType: 'input',
      span: 6,
      hiddenItem: false,
    },
    {
      label: '紧急联系人号码',
      name: 'number',
      formType: 'input',
      span: 6,
      hiddenItem: false,
    },
  ],
};
