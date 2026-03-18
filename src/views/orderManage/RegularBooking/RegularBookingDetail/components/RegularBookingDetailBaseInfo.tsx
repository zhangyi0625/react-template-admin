import React from 'react';
import { Divider } from 'antd';
import type { RegularBookingDetailBaseInfoType } from '../../type';
import type { RegularBookingDetailType } from '@/services/orderManage/regularBooking/regularBookingModel';

export type RegularBookingDetailBaseInfoProps = {
  detail: RegularBookingDetailBaseInfoType[];
  orderInfo: RegularBookingDetailType;
  onClick: (item: RegularBookingDetailBaseInfoType) => void;
};

const RegularBookingDetailBaseInfo: React.FC<
  RegularBookingDetailBaseInfoProps
> = ({ detail, orderInfo, onClick }) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-[16px] mt-[16px]">
        {detail &&
          detail
            .slice(0, detail.length - 4)
            .map((item: RegularBookingDetailBaseInfoType, index: number) => (
              <span
                className={`text-light-grey whitespace-nowrap ${
                  orderInfo?.type !== item.type && item.type !== 'ALL'
                    ? 'hidden'
                    : ''
                }`}
                key={index}
              >
                {item.label}：
                <span className="text-dull-grey whitespace-pre-wrap">
                  {item.value}
                </span>
              </span>
            ))}
      </div>
      <Divider
        variant="dashed"
        className="py-[24px]"
        style={{ borderColor: '#BFC2CC' }}
        dashed
      />
      <div className="grid grid-cols-3 gap-[16px] mt-[16px]">
        {detail &&
          detail
            .slice(detail.length - 4, detail.length)
            .map((item: RegularBookingDetailBaseInfoType, index: number) => (
              <span
                className={`text-light-grey whitespace-nowrap font-bold`}
                key={index}
              >
                {item.label}：
                <span
                  className={`text-dull-blue ${
                    item.value !== '使用第三方账号' &&
                    'underline cursor-pointer'
                  } font-normal`}
                  onClick={() => onClick(item)}
                >
                  {item.value}
                </span>
              </span>
            ))}
      </div>
    </>
  );
};

export default RegularBookingDetailBaseInfo;
