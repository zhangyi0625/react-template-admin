import { DefaultPaging } from '@/types/global';

export interface AffiliateManageType {
  id: string | null;
  name: string;
  shortName: string;
  type: string;
  contact: {
    person: string | null;
    tel: string | null;
    fax: string | null;
    email: string | null;
  };
  source: string;
  businessCode: string;
}

export interface AffiliateManageParams extends DefaultPaging {
  filter: Partial<
    Pick<AffiliateManageType, 'name' | 'type' | 'source'> & {
      expiredDays: string;
    }
  >;
  sort: { validTo?: string; id?: string };
}

export interface AffiliateDetailType extends AffiliateManageType {
  id: string;
  level: number;
  balance: number;
  bond: number;
  bondLocked: number;
  credentials: [];
  created: string;
  customersLimit: number;
  stated: true;
  businessConfig: string;
  grade: {
    customerId: string | null;
    affiliateId: number;
    level: number;
    validFrom: string;
    validTo: string;
  };
  gradeLog: AffiliateDetailGradeLogType[];
  [key: string]: any;
}

export interface AffiliateDetailGradeLogType {
  id: string | null;
  created: string;
  paymentTitle: null;
  remark: string;
  operator: string;
}
