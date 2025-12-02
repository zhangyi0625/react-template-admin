export interface SystemAreaOptionsType {
  id: string;
  name: string;
  code: string;
  parentId?: string;
}

export interface SystemCountryOptionsType {
  id: string;
  name: string;
  code: string;
  localName: string;
}

export interface SystemCarrierOptionsType {
  booking: boolean;
  carrierCode: string;
  carrierName: string;
  code: string;
  fastbooking: boolean;
  name: string;
  settings: { hasPayPassword: boolean };
}
