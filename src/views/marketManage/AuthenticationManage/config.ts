import { TabsProps } from 'antd';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

export type AuthenticationStatusType = {
  label: string;
  strValue: string | null;
  intValue: string | number | null;
};

export const AuthenticationStatusOptions: AuthenticationStatusType[] = [
  {
    label: '全部',
    strValue: '',
    intValue: '',
  },
  {
    label: '待审核',
    strValue: 'CREATED',
    intValue: 2,
  },
  {
    label: '已拒绝',
    strValue: 'REJECTED',
    intValue: 0,
  },
  {
    label: '已通过',
    strValue: 'ACCEPTED',
    intValue: 1,
  },
];

export const AuthenticationManageTabItems: TabsProps['items'] = [
  {
    key: 'authentication',
    label: '认证管理',
  },
  {
    key: 'enterpriseInformation',
    label: '企业信息管理',
  },
];

export const AuthenticationManageSearchColumns: CustomColumn[] = [
  {
    label: '审核状态',
    name: 'status',
    formType: 'normalSelect',
    options: AuthenticationStatusOptions,
    span: 6,
    selectFetch: false,
    hiddenItem: false,
    defaultValue: 'CREATED',
    selectFieldName: {
      label: 'label',
      value: 'strValue',
    },
  },
];
