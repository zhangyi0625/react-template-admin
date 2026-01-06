import React from 'react';
import { Timeline } from 'antd';
import styles from '@/views/marketManage/AffiliateManage/AffiliateManage.module.scss';
import type { QuickEnquiryOrderEventItemType } from '@/services/orderManage/quickEnquiryOrder/quickEnquiryOrderModel';

export type QuickEnquiryOrderEventsProps = {
  events: QuickEnquiryOrderEventItemType[];
  openReplayModal: (content: string) => void;
};

const QuickEnquiryOrderEvents: React.FC<QuickEnquiryOrderEventsProps> = ({
  events,
  openReplayModal,
}) => {
  const permissionRecord = () => {
    let newArr = events.map((item) => {
      return {
        children: (
          <>
            <div className="font-medium ml-[16px] text-sm">
              {item.title}
              {item.content && (
                <span
                  className="text-blue-500 underline cursor-pointer"
                  onClick={() => openReplayModal(item.content)}
                >
                  查看
                </span>
              )}
              <p className="text-gray-400 my-[4px]">{item.created}</p>
            </div>
          </>
        ),
      };
    });
    return newArr;
  };
  return (
    <div className="p-[20px] bg-white rounded-[6px] mt-[10px] w-full">
      <p className={styles['basic-title']}>订单动态</p>
      <Timeline items={permissionRecord()} />
    </div>
  );
};

export default QuickEnquiryOrderEvents;
