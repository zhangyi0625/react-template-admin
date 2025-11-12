import { useEffect, useState } from 'react';
import { App } from 'antd';
import { getAffiliateManageDetail } from '@/services/marketManage/affiliateManage/affiliateManageApi';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AffiliateDetailType } from '@/services/marketManage/affiliateManage/affiliateManageModel';
import AffiliateBasicInfo from '../components/AffiliateBasicInfo';
import AffiliateSearchRecord from '../components/AffiliateSearchRecord';
import AffiliateFinancialDetail from '../components/AffiliateFinancialDetail';
import AffiliateUser from '../components/AffiliateUser';
import AffiliatePermissionRecord from '../components/AffiliatePermissionRecord';
import { filterKeys } from '@/utils/tool';

const AffiliateDetail: React.FC = () => {
  const { message } = App.useApp();

  const location = useLocation();

  const [affiliateDetail, setAffiliateDetail] = useState<AffiliateDetailType>();

  const navigate = useNavigate();

  useEffect(() => {
    loadAffilateDetail();
  }, []);

  const loadAffilateDetail = async () => {
    try {
      const id = location.pathname.split('/marketManage/affiliateManage/')[1];
      const resp = await getAffiliateManageDetail(id);
      console.log(location, 'location', id);
      setAffiliateDetail({
        ...resp,
        businessConfig: !!resp.businessConfig
          ? JSON.parse(resp.businessConfig)
          : '',
      });
    } catch {
      message.error('获取客户详情数据失败，具体查看相关接口～');
    }
  };

  const jumpWalletPage = (url: string) => {
    navigate(`${url}?affiliateId=${affiliateDetail?.id}&type=affiliate`);
  };
  return (
    <>
      {affiliateDetail?.id && (
        <div className="flex items-start">
          <div className="flex flex-col w-3xl">
            <AffiliateBasicInfo
              detail={affiliateDetail}
              onLoadBaseDetail={loadAffilateDetail}
            />
            <AffiliateSearchRecord affiliateId={affiliateDetail.id} />
          </div>
          <div className="max-w-[440px] ml-[16px] flex1">
            <AffiliateUser affiliateId={affiliateDetail.id} />
            <AffiliateFinancialDetail
              wallet={filterKeys(affiliateDetail, ['bond', 'balance'], true)}
              jumpWalletPage={jumpWalletPage}
            />
            <AffiliatePermissionRecord record={affiliateDetail.gradeLog} />
          </div>
        </div>
      )}
    </>
  );
};

export default AffiliateDetail;
