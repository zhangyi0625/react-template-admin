import { useCallback, useEffect, useState } from 'react';
import { App, Button, Spin, Tabs, type TabsProps, Timeline } from 'antd';
import '../../RegularBooking/index.scss';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import RegularBookingDetailBaseInfo from '../../RegularBooking/RegularBookingDetail/components/RegularBookingDetailBaseInfo';
import type { FastBooingEventsType } from '@/services/orderManage/fastBooking/fastBookingModel';
import {
  getFastBookingDetail,
  getFastBookingEvents,
  getFastBookingOrderAccount,
  postFastBookingStatusByCancel,
  postFastBookingStatusByPreparing,
  postFastBookingByOther,
  postFastBookingStatusByPrepared,
} from '@/services/orderManage/fastBooking/fastBookingApi';
import { FastBookingDetailStatus, FastDetailBaseInfoOptions } from '../config';
import { RootState } from '@/stores/store';
import { RegularBookingDetailBaseInfoType } from '../../RegularBooking/type';
import BookingResult from '../../RegularBooking/RegularBookingDetail/components/BookingResult';
import AreaBaseInfo from './components/AreaBaseInfo';
import OrderAccountModal, {
  CarrierAccountsType,
} from '../../RegularBooking/RegularBookingDetail/modal/OrderAccountModal';
import type { FastBooingDetailExtraInfoType } from '../type';
import CargoRequirementModal from '../../RegularBooking/RegularBookingDetail/modal/CargoRequirementModal';
import { ExclamationCircleFilled } from '@ant-design/icons';

const FastBookingDetail: React.FC = () => {
  const params = useParams();

  const { message, modal } = App.useApp();

  const navigate = useNavigate();

  const { publicData } = useSelector((state: RootState) => state.publicSetting);

  const orderStatusManager = publicData.orderStatusManager;

  const [loading, setLoading] = useState<boolean>(false);

  const [baseInfo, setBaseInfo] = useState(FastDetailBaseInfoOptions);

  const [orderInfo, setOrderInfo] = useState<any>();

  const [timeLine, setTimeLine] = useState<FastBooingEventsType[]>([]);

  const [defaultActiveKey, setDefaultActiveKey] =
    useState<string>('AreaBaseInfo');

  const [cargoInfo, setCargoInfo] = useState<{
    visible: boolean;
    editRow: FastBooingDetailExtraInfoType | null;
  }>({
    visible: false,
    editRow: null,
  });

  const [accountInfo, setAccountInfo] = useState<{
    visible: boolean;
    editRow: CarrierAccountsType[];
  }>({
    visible: false,
    editRow: [],
  });

  const FastBookingDetailTabs: TabsProps['items'] = [
    {
      key: 'AreaBaseInfo',
      label: '航线基本信息',
      children: <AreaBaseInfo baseInfoList={orderInfo?.content?.items} />,
    },
    {
      key: 'BookingResult',
      label: '订舱结果',
      children: <BookingResult source="FastBooking" orderInfo={orderInfo} />,
    },
  ];

  useEffect(() => {
    setLoading(true);
    init();
  }, []);

  const defaultActiveKeyChange = (key: string) => {
    setDefaultActiveKey(key);
  };

  const init = async () => {
    try {
      const resp = await getFastBookingDetail(params.id as string);
      const timeline = await getFastBookingEvents(params.id as string);

      setOrderInfo({ ...resp });
      baseInfo.map((item) => {
        if (item.key && !item.bySetting) {
          item.value = !item.getValue
            ? resp[item.key]
            : item.getValue(resp[item.key]);
        } else if (item.bySetting) {
          let key = resp[item.key];
          item.value = publicData[item.bySetting][key];
        }
      });
      setBaseInfo([...baseInfo]);
      setTimeLine(timeline);
      setLoading(false);
    } catch {}
  };

  const getIcon = (suffix: string) => {
    return process.env.RS_STATIC_API + '/static/website/order-status/' + suffix;
  };

  const handleClick = (item: RegularBookingDetailBaseInfoType) => {
    if (item.key === 'affiliateName' || item.key === 'customerName') {
      navigate(`/marketManage/userManage/${orderInfo.customerId}`);
    } else {
      item.key === 'cargo'
        ? setCargoInfo({
            visible: true,
            editRow: orderInfo?.content?.extraInfo,
          })
        : loadFastBookingAccount();
    }
  };

  const loadFastBookingAccount = async () => {
    try {
      const resp = await getFastBookingOrderAccount({
        customerId: orderInfo.customerId,
        brand: orderInfo?.content?.bookingParty?.accounts![0]?.brand,
        usernames:
          orderInfo?.content?.bookingParty?.accounts![0]?.usernames![0],
      });
      setAccountInfo({
        visible: true,
        editRow: resp,
      });
    } catch {
      setAccountInfo({
        visible: true,
        editRow: [],
      });
    }
  };

  const getTimeLineInfo = () => {
    const items = timeLine.map((item) => {
      return {
        children: (
          <>
            <p className="text-dull-grey">{item.title}</p>
            <p className="text-light-grey">
              {item.created} {item.createdBy}
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

  const statusOtions = useCallback(() => {
    return (
      orderInfo?.status &&
      FastBookingDetailStatus.find((item) => item.value === orderInfo?.status)
        ?.icon
    );
  }, [orderInfo]);

  const cancelFastBooking = async () => {
    try {
      modal.confirm({
        title: '提示',
        icon: <ExclamationCircleFilled />,
        content: '确认更改状态为已取消！',
        async onOk() {
          await postFastBookingStatusByCancel(orderInfo?.id);
          message.success('操作成功～');
          init();
        },
      });
    } catch {}
  };

  const changeOrderStatus = async (type: 'API' | 'self') => {
    try {
      if (type === 'self') {
        orderInfo?.status === 'PENDING'
          ? modal.confirm({
              title: '提示',
              icon: <ExclamationCircleFilled />,
              content: '确认更改状态为预定中!',
              async onOk() {
                await postFastBookingStatusByPreparing(orderInfo?.id);
              },
            })
          : await postFastBookingStatusByPrepared(orderInfo?.id);
      } else {
        await postFastBookingByOther(orderInfo?.id);
      }
      message.success('操作成功～');
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
                  src={getIcon(statusOtions()) + '.png'}
                  className="w-[38px] h-[38px]"
                  alt=""
                />
                <div className="font-bold text-[28px] text-white ml-[10px]">
                  {
                    FastBookingDetailStatus.find(
                      (item) => item.value === orderInfo?.status
                    )?.label
                  }
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
                items={FastBookingDetailTabs}
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
                  src={getIcon(statusOtions()) + '-op.png'}
                  className="w-[58px] h-[58px] m-auto"
                  alt=""
                />
                <p className="text-[28px] font-bold text-orange-400 mt-[16px]">
                  {
                    FastBookingDetailStatus.find(
                      (item) => item.value === orderInfo?.status
                    )?.label
                  }
                </p>
              </div>
              <div className="mt-[33px] flex items-center justify-center">
                <Button
                  size="large"
                  className={'button cancel-type'}
                  onClick={cancelFastBooking}
                  hidden={
                    !(
                      orderInfo?.status === 'PENDING' ||
                      orderInfo?.status === 'PREPARING'
                    )
                  }
                >
                  {orderInfo?.status === 'PENDING' ? '取消预订' : '预订失败'}
                </Button>
                <Button
                  size="large"
                  className={'button confirm-type ml-[8px]'}
                  hidden={
                    !(
                      orderInfo?.status === 'PENDING' ||
                      orderInfo?.status === 'PREPARING'
                    )
                  }
                  onClick={() => changeOrderStatus('self')}
                >
                  {orderInfo?.status === 'PENDING' ? '自有订舱' : '预定成功'}
                </Button>
                <Button
                  size="large"
                  className={'button confirm-type ml-[8px]'}
                  hidden={orderInfo?.status !== 'PENDING'}
                  onClick={() => changeOrderStatus('API')}
                >
                  API极虎
                </Button>
              </div>
            </div>
            {timeLine.length && getTimeLineInfo()}
          </div>
        </div>
      </Spin>
      <OrderAccountModal
        params={accountInfo}
        source="RegularBooking"
        onCancel={() => setAccountInfo({ visible: false, editRow: [] })}
      />
      <CargoRequirementModal
        source="FastBooking"
        params={{
          visible: cargoInfo.visible,
          editRow: {
            bookingInfo: cargoInfo.editRow,
            carrier: orderInfo?.content?.carriers![0],
          },
        }}
        onCancel={() => setCargoInfo({ visible: false, editRow: null })}
      />
    </>
  );
};

export default FastBookingDetail;
