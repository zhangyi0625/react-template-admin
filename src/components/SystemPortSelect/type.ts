import type { SelectProps } from 'antd';
import type { LocationItem } from '@/services/orderManage/regularBooking/regularBookingModel';

type PortSelectOpionsType = SelectProps['options'] & LocationItem[];

export type PortType = {
  POR: PortSelectOpionsType;
  FND: PortSelectOpionsType;
  [key: string]: PortSelectOpionsType;
};

export type PortCodeType = {
  porCode: string | undefined;
  fndCode: string | undefined;
  [key: string]: string | undefined;
};
