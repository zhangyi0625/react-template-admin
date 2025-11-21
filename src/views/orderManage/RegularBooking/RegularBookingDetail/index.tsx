import { useCallback, useEffect, useState } from 'react';
import { App, Button, Spin, Tabs, TabsProps, Timeline } from 'antd';
import '../index.scss';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getRegularBookingDetail,
  postAgreeCancelApply,
  postCancelBooking,
  postExecutionBreach,
} from '@/services/orderManage/regularBooking/regularBookingApi';
import { RootState } from '@/stores/store';
import {
  RegularBookingDetailBaseInfoOptions,
  RegularBookingstatusList,
} from '../config';
import type {
  RegularBookingDetailBaseInfoType,
  RegularBookingDetailTimeLine,
  RegularBookingStatusConditionType,
} from '../type';
import RegularBookingDetailBaseInfo from './components/RegularBookingDetailBaseInfo';
import AreaBaseInfo from './components/AreaBaseInfo';
import BookingFrequency from './components/BookingFrequency';
import BookingResult from './components/BookingResult';
import PayMessage from './components/PayMessage';
import CargoRequirementModal from './modal/CargoRequirementModal';
import CancelReasonModal from './modal/CancelReasonModal';
import OrderAccountModal from './modal/OrderAccountModal';
import { filterKeys } from '@/utils/tool';
import { ExclamationCircleOutlined } from '@ant-design/icons';

type ModalContent = {
  visible: boolean;
  editRow: any;
};

const RegularBookingDetail: React.FC = () => {
  const params = useParams();

  const navigate = useNavigate();

  const { message, modal } = App.useApp();

  const [orderInfo, setOrderInfo] = useState<any>();

  const { publicData } = useSelector((state: RootState) => state.publicSetting);

  const [loading, setLoading] = useState<boolean>(false);

  const [baseInfo, setBaseInfo] = useState(RegularBookingDetailBaseInfoOptions);

  const [defaultActiveKey, setDefaultActiveKey] =
    useState<string>('AreaBaseInfo');

  const RegularBookingDetailTabs: TabsProps['items'] = [
    {
      key: 'AreaBaseInfo',
      label: '航线基本信息',
      children: <AreaBaseInfo type={orderInfo?.type} orderInfo={orderInfo} />,
    },
    {
      key: 'BookingResult',
      label: '订舱结果',
      children: <BookingResult orderInfo={orderInfo} />,
    },
    {
      key: 'PayMessage',
      label: '支付信息',
      children: <PayMessage orderInfo={orderInfo} />,
    },
    {
      key: 'BookingFrequency',
      label: '订舱频率',
      children: <BookingFrequency id={orderInfo?.id} />,
    },
  ];

  const [cargoInfo, setCargoInfo] = useState<ModalContent>({
    visible: false,
    editRow: null,
  });

  const [accountInfo, setAccountInfo] = useState<ModalContent>({
    visible: false,
    editRow: null,
  });

  const [cancelReson, setCancelReson] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    init();
  }, []);

  const defaultActiveKeyChange = (key: string) => {
    setDefaultActiveKey(key);
  };

  const init = async () => {
    try {
      const resp = await getRegularBookingDetail(params.id as string);
      /**
       * Todo：拷贝数据 condition：type 为 BOOKING时
       * 将接口返回字段中的bookedInfo中的productInfo值全部拷贝到新对象中（bookingInfo）
       */
      let copyData = {
        ...resp.data,
        bookingInfo:
          resp.data.type === 'BOOKING'
            ? {
                ...resp.data?.bookedInfo,
                ...resp.data?.bookedInfo?.productInfo,
              }
            : { ...resp.data?.bookedInfo },
      };
      setOrderInfo(copyData);
      // 根据key || getValue 填充内容
      baseInfo.map((item) => {
        if (item.key && !item.bySetting) {
          item.value = !item.getValue
            ? copyData[item.key]
            : item.getValue(copyData[item.key]);
        } else if (item.bySetting) {
          let key = copyData[item.key];
          item.value = publicData[item.bySetting][key];
        }
      });
      setBaseInfo([...baseInfo]);
      setLoading(false);
    } catch {}
  };

  const OtherJudgeCondition = (value: {
    status: string;
    cancelStatus: string | null;
    refundStatus: string | null;
    payStatus: string | null;
  }) => {
    return RegularBookingstatusList.find((item) => item.conditionFun(value));
  };

  const statusOtions = useCallback(() => {
    return (
      orderInfo &&
      OtherJudgeCondition(
        filterKeys(
          orderInfo,
          ['status', 'cancelStatus', 'refundStatus', 'payStatus'],
          true
        )
      )
    );
  }, [orderInfo]);

  const getIcon = (suffix: string) => {
    return process.env.RS_STATIC_API + '/static/website/order-status/' + suffix;
  };

  const getTimeLineInfo = (info: RegularBookingDetailTimeLine[]) => {
    const items = info.map((item) => {
      return {
        children: (
          <>
            <p className="text-dull-grey">{item.title}</p>
            <p className="text-light-grey">{item.content}</p>
            <p className="text-light-grey">
              {item.created +
                '  ' +
                (item.operator === 'SYSTEM' ? '系统' : item.operator)}
            </p>
          </>
        ),
      };
    });
    return (
      <div className="p-[20px] bg-white rounded-[6px] mt-[20px]">
        <h3 className="text-dull-grey text-base font-medium mb-[17px]">
          订单动态
        </h3>
        <Timeline items={items} />
      </div>
    );
  };

  const handleClick = (item: RegularBookingDetailBaseInfoType) => {
    if (item.key === 'affiliateName' || item.key === 'customerName') {
      navigate('/');
    } else {
      item.key === 'cargo'
        ? setCargoInfo({ visible: true, editRow: orderInfo })
        : setAccountInfo({
            visible: true,
            editRow: orderInfo?.orderCarrierAccounts,
          });
    }
  };

  const cancelClick = async (item: RegularBookingStatusConditionType) => {
    try {
      item.cancelBtnText === '取消订舱' && setCancelReson(true);
      item.cancelBtnText === '订舱执行违约' &&
        (await postExecutionBreach(orderInfo?.id, { remark: '执行违约' }));
      item.cancelBtnText === '同意取消' && postAgreeCancelApply(orderInfo?.id);
      message.success('操作成功');
      init();
    } catch {}
  };

  const confirmClick = (item: RegularBookingStatusConditionType) => {
    if (!item.confirmHint && item.confirmBtnText === '拒绝取消') {
      item.confirmApi(orderInfo?.id, { remark: '拒绝取消' }).then(() => {
        message.success('修改成功');
        init();
      });
    } else if (item.confirmHint)
      modal.confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: `${item.confirmHint}`,
        okText: '确认',
        onOk: () => {
          item.confirmApi(orderInfo?.id).then(() => {
            message.success('修改成功');
            init();
          });
        },
        cancelText: '取消',
      });
  };

  const cancelBooking = async (reason: string) => {
    try {
      await postCancelBooking(orderInfo?.id, { remark: reason });
      message.success('修改成功');
      setCancelReson(false);
      init();
    } catch {}
  };

  return (
    <>
      <Spin spinning={loading}>
        <div className="flex items-start">
          <div className="flex-1 overflow-hidden">
            <div className="bg-white">
              <div className="h-[70px] leading-[70px] bg-dull-blue pl-[20px] rounded-t-[6px] flex items-center">
                <img
                  src={getIcon(statusOtions()?.titleIcon) + '.png'}
                  className="w-[38px] h-[38px]"
                  alt=""
                />
                <div className="font-bold text-[28px] text-white ml-[10px]">
                  {statusOtions()?.valueText}
                </div>
              </div>
              <div className="px-[24px] py-[20px]">
                <p className="dull-grey text-sm font-bold">订舱基本信息</p>
                <RegularBookingDetailBaseInfo
                  detail={baseInfo}
                  orderInfo={orderInfo}
                  onClick={handleClick}
                />
              </div>
            </div>
            <div className="bg-white mt-[10px] px-[20px] py-[16px]">
              <Tabs
                items={
                  orderInfo?.type === 'BOOKING'
                    ? RegularBookingDetailTabs.slice(0, 3)
                    : RegularBookingDetailTabs
                }
                defaultActiveKey={defaultActiveKey}
                onChange={defaultActiveKeyChange}
              />
            </div>
          </div>
          <div className="overflow-hidden ml-[16px] flex-none w-100 h-full">
            <div className="p-[20px] bg-white rounded-[6px] h-[300px]">
              <h3 className="text-dull-grey text-base font-medium">订单操作</h3>
              <div className="mt-[24px] text-center">
                <img
                  src={getIcon(statusOtions()?.titleIcon) + '-op.png'}
                  className="w-[58px] h-[58px] m-auto"
                  alt=""
                />
                <p className="text-[28px] font-bold text-orange-400 mt-[16px]">
                  {statusOtions()?.valueText}
                </p>
              </div>
              {statusOtions()?.showBtn && (
                <div className="mt-[33px] flex items-center justify-center">
                  <Button
                    size="large"
                    className={'button cancel-type'}
                    onClick={() => cancelClick(statusOtions())}
                  >
                    {statusOtions()?.cancelBtnText}
                  </Button>
                  <Button
                    size="large"
                    className={'button confirm-type ml-[8px]'}
                    onClick={() => confirmClick(statusOtions())}
                  >
                    {statusOtions()?.confirmBtnText}
                  </Button>
                </div>
              )}
            </div>
            {orderInfo?.events && getTimeLineInfo(orderInfo?.events)}
          </div>
        </div>
      </Spin>
      <CargoRequirementModal
        params={cargoInfo}
        onCancel={() => setCargoInfo({ visible: false, editRow: null })}
      />
      <OrderAccountModal
        params={accountInfo}
        onCancel={() => setAccountInfo({ visible: false, editRow: null })}
      />
      <CancelReasonModal
        visible={cancelReson}
        onCancel={() => setCancelReson(false)}
        onOk={cancelBooking}
      />
    </>
  );
};

export default RegularBookingDetail;
