export interface EquityRightsBaseEditType {
  affiliateId: string;
  limitType: string;
  module: string;
  queryLimit: number;
}

export interface EquityRightsExtraEditType
  extends Omit<EquityRightsBaseEditType, 'affiliateId'> {
  customerId: string;
}
