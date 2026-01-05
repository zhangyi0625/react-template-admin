import type { SelectProps } from 'antd';
import type { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';

type PortSelectOptionsType = SelectProps['options'] & LocationItem[];

export type PortType = {
  POR: PortSelectOptionsType;
  FND: PortSelectOptionsType;
  [key: string]: PortSelectOptionsType;
};

export type PortInfoType = {
  porInfo: string | number | string[] | undefined;
  fndInfo: string | number | string[] | undefined;
  [key: string]: string | number | string[] | undefined;
};

export type PortCodeType = {
  porCode?: string | string[] | undefined;
  fndCode?: string | string[] | undefined;
  [key: string]: string | string[] | undefined;
};
