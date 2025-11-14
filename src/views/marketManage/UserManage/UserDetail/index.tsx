import { useEffect, useState } from 'react';
import { App } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStaffManageDetail } from '@/services/marketManage/staffManage/staffManageApi';
import type { StaffDetailType } from '@/services/marketManage/staffManage/staffManageModel';
import AffiliateFinancialDetail from '../../AffiliateManage/components/AffiliateFinancialDetail';
import AffiliatePermissionRecord from '../../AffiliateManage/components/AffiliatePermissionRecord';
import UserSearchRecord from '../components/UserSearchRecord';
import UserBaseInfo from '../components/UserBaseInfo';
import { filterKeys } from '@/utils/tool';

const UserDetail: React.FC = () => {
  const { message } = App.useApp();

  const location = useLocation();

  const [userDetail, setUserDetail] = useState<StaffDetailType>();

  const navigate = useNavigate();

  useEffect(() => {
    loadUserDetail();
  }, []);

  const loadUserDetail = async () => {
    try {
      const id = location.pathname.split('/marketManage/userManage/')[1];
      const resp = await getStaffManageDetail(id);
      setUserDetail({
        ...resp,
        businessConfig: !!resp.businessConfig
          ? JSON.parse(resp.businessConfig)
          : '',
      });
    } catch {
      message.error('获取用户详情数据失败，具体查看相关接口～');
    }
  };

  const jumpWalletPage = (url: string) => {
    navigate(`${url}?affiliateId=${userDetail?.affiliateId}&type=affiliate`);
  };
  return (
    <>
      {userDetail?.id && (
        <div className="flex items-start">
          <div className="flex flex-col w-3xl">
            <UserBaseInfo
              detail={userDetail}
              onLoadBaseDetail={loadUserDetail}
            />
            <UserSearchRecord customerId={userDetail.id} />
          </div>
          <div className="max-w-[440px] ml-[16px] flex1">
            <AffiliateFinancialDetail
              wallet={filterKeys(userDetail, ['bond', 'balance'], true)}
              jumpWalletPage={jumpWalletPage}
            />
            <AffiliatePermissionRecord record={userDetail.gradeLog} />
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetail;
