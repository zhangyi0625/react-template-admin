import type { DefaultPaging } from '@/types/global';

export interface FreightInsurancePolicySearchFilterParams {
  applyno: string;
  policy: string;
  insuredname: string;
  destination: string;
  opstatus: string;
  no: string;
  billno: string;
  customerName: string;
  createStart: string;
  createEnd: string;
  commitdateStart: string;
  commitdateEnd: string;
}

export interface FreightInsurancePolicySearchParams extends DefaultPaging {
  filter?: FreightInsurancePolicySearchFilterParams | null;
}

export interface FreightInsurancePolicyDetailType {
  remark: string;
  customerName: string;
  insuredName: string;
  cargoname: string;
  packagename: string;
  labelname: string;
  cargodesc: string;
  packageunit: string;
  invoice: string;
  billno: string;
  transportmode: string;
  shipname: string;
  portloading: string;
  destination: string;
  transhipment: string;
  commitdate: string;
  inspectagent: string;
  compensationplace: string;
  iscredit: string;
  creditno: string;
  mainclausecontent: string;
  applyno: string;
  premium: string;
  invoiceamount: string;
  insuranceamount: string;
  inscompanyname: string;
  insrate: string;
}
