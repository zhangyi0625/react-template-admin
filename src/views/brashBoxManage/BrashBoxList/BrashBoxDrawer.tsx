import { useEffect, useState } from 'react';
import { Divider, Drawer } from 'antd';
import LineIcon from '@/assets/svg/icon/line.svg';
import { getBrashBoxManageDetail } from '@/services/brashBoxManage/brashBoxList/brashBoxListApi';
import { BrashBoxListType } from '@/services/brashBoxManage/brashBoxList/brashBoxListModel';
import { formatTime } from '@/utils/format';

export type BrashBoxDrawerProps = {
  visible: boolean;
  detailId: string;
  onCancel: () => void;
};

export const BrashBoxDrawer: React.FC<BrashBoxDrawerProps> = ({
  visible,
  detailId,
  onCancel,
}: BrashBoxDrawerProps) => {
  const [detail, setDetail] = useState<BrashBoxListType>(
    {} as BrashBoxListType,
  );

  useEffect(() => {
    if (!visible) {
      return;
    }
    init();
  }, [visible]);

  const init = async () => {
    try {
      const resp = await getBrashBoxManageDetail(detailId);
      setDetail(resp);
    } catch {
      // onCancel();
    }
  };
  return (
    <Drawer open={visible} onClose={onCancel} title="刷箱详情" width={750}>
      <div className="font-normal text-sm text-[#909399]">
        <div className="font-medium text-[#303133]">
          提单号：{detail.task?.billNo ?? '-'}
        </div>
        <div className="flex items-center mt-[12px] text-[#303133] font-semibold">
          <p>
            {detail.task?.por?.enName ?? '-'} -
            {detail.task?.por?.countryCode ?? '-'}
          </p>
          <img src={LineIcon} alt="" className="mx-[24px] w-[90px] h-[18px]" />
          <p>
            {detail.task?.fnd?.enName ?? '-'} -
            {detail.task?.fnd?.countryCode ?? '-'}
          </p>
        </div>
        {/* <div className="mt-[12px]">
          中转港：
          <span className="text-[#303133]">{detail.task?.transit ?? '-'}</span>
        </div> */}
        <div className="mt-[12px]">船司：{detail.task?.carrier ?? '-'}</div>
        <div className="mt-[12px]">
          船名航次：{detail.task?.vesselName ?? '-'} /{' '}
          {detail.task?.voyNo ?? '-'}
        </div>
        <div className="flex items-center my-[30px] text-[#303133]">
          总箱量：{detail.task?.totalNumber ?? '-'}
          <span className="text-[#52C41A] ml-[30px]">
            已成功总箱量：{detail.task?.successCount ?? '-'}
          </span>
        </div>
        {(detail.details || []).map((item, index) => (
          <div key={item.id} className="flex items-start">
            <div className="flex flex-col mr-[12px]">
              <div className="bg-[#1677FF] rounded-[10px] w-[11px] h-[11px]"></div>
              {detail.details.length > 1 &&
                index !== detail.details.length - 1 && (
                  <div className="w-[1px] min-h-[190px] bg-[#1677FF] ml-[5px]"></div>
                )}
            </div>
            <div className="flex flex-col">
              <div className="translate-y-[-6px] mb-[6px]">
                创建时间：{formatTime(item.createTime, 'Y-M-D h:m')}
              </div>
              <p className="mb-[12px] flex items-center">
                本次刷箱量：
                <span className="text-[#303133]">
                  {item.ctnType ?? '-'} * {item.ctnNumber ?? '-'}
                </span>
              </p>
              <p className="mb-[12px]">
                总箱量：{detail.task?.totalNumber ?? '-'}
              </p>
              <p className="mb-[12px]">
                成功数量：
                <span className="text-[#07C160]">
                  {item.successCount ?? '-'}
                </span>
              </p>
              <p className="mb-[43px] flex items-center text-[#303133]">
                有效条形码：
                {item.barcodes && (
                  <div className="flex items-center">
                    {item.barcodes.split(',').map((barcode) => (
                      <span
                        key={barcode}
                        className="mr-[8px] px-[8px] py-[3px] text-[#167fff] bg-[#F5F7FA]"
                      >
                        {barcode}
                      </span>
                    ))}
                  </div>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default BrashBoxDrawer;
