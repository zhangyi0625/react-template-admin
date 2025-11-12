import { Timeline } from 'antd';
import { AffiliateDetailGradeLogType } from '@/services/marketManage/affiliateManage/affiliateManageModel';
import styles from '../AffiliateManage.module.scss';

export type AffiliatePermissionRecordProps = {
  record: AffiliateDetailGradeLogType[];
};

const AffiliatePermissionRecord: React.FC<AffiliatePermissionRecordProps> = ({
  record,
}) => {
  const permissionRecord = () => {
    let newArr = record.map((item) => {
      return {
        dot: (
          <div
            className="rounded-[16px] text-blue-500 font-semibold w-[72px] h-[32px] leading-[32px] text-center"
            style={{ background: '#F5F7FA' }}
          >
            {item.operator}
          </div>
        ),
        children: (
          <>
            <div className="text-dull-grey font-medium ml-[16px] text-sm">
              {item.created}
              <p className="text-gray-400 my-[8px]">{item.remark}</p>
            </div>
          </>
        ),
      };
    });
    return newArr;
  };

  return (
    <>
      <div className="p-[20px] bg-white rounded-[6px] w-full">
        <p className={styles['basic-title']}>权限变更记录</p>
        <Timeline items={permissionRecord()} />
      </div>
    </>
  );
};

export default AffiliatePermissionRecord;
