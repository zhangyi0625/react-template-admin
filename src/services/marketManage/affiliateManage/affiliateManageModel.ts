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
  sort: { validTo: string };
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
  // "gradeLog": [
  //     {
  //         "id": null,
  //         "customerId": null,
  //         "customerName": null,
  //         "affiliateId": 13267,
  //         "affiliateName": "深圳市锦新物流有限公司",
  //         "gradeLevel": 10,
  //         "customerLimit": 0,
  //         "created": "2025-03-06 10:31:48",
  //         "validFrom": "2025-03-06 10:31:48",
  //         "validTo": "2125-03-06 23:59:59",
  //         "paymentTitle": null,
  //         "remark": "会员已到期客户账户权益等级由[认证买家]更改为[认证企业]; 客户子账号个数由[10]更改为[0];",
  //         "operator": "SYSTEM"
  //     },
  //     {
  //         "id": null,
  //         "customerId": null,
  //         "customerName": null,
  //         "affiliateId": 13267,
  //         "affiliateName": "深圳市锦新物流有限公司",
  //         "gradeLevel": 11,
  //         "customerLimit": 10,
  //         "created": "2024-11-18 16:25:32",
  //         "validFrom": "2024-11-18 16:25:32",
  //         "validTo": "2025-11-19 23:59:59",
  //         "paymentTitle": null,
  //         "remark": "客户账户权益等级由[认证企业]更改为[认证买家]; 客户子账号个数由[0]更改为[10];",
  //         "operator": "胡宇耀"
  //     }
  // ]
}

export interface AffiliateDetailGradeLogType {
  id: string | null;
  // "customerId": null,
  // "customerName": null,
  // "affiliateId": 13267,
  // "affiliateName": "深圳市锦新物流有限公司",
  // "gradeLevel": 10,
  // "customerLimit": 0,
  created: string;
  // "validFrom": "2025-03-06 10:31:48",
  // "validTo": "2125-03-06 23:59:59",
  paymentTitle: null;
  remark: string;
  operator: string;
}
