import './detail.scss'
import { memo, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import { Button, Timeline, Divider, Tabs, type TabsProps } from 'antd'
import { getOrderDetail } from '@/services/order'
import { OrderDetailBaseInfo, statusAllList } from '../config'
import type { OrderDetailTimeLine, OrderDetailBaseInfoType } from '../type'
import AreaBaseInfo from './components/table/AreaBaseInfo'
import BookingResult from './components/table/BookingResult'
import PayMessage from './components/table/PayMessage'
import CargoRequirement from './components/modal/CargoRequirement'
import OrderCarrierAccounts from './components/modal/OrderAccountInfo'
import BookingFrequency from './components/BookingFrequency'
import { filterKeys } from '@/utils/tool'

type ModalContent = {
  visible: boolean
  editRow: any
}

const OrderDetail: React.FC = memo(() => {
  const params = useParams()

  const navigate = useNavigate()

  const [orderInfo, setOrderInfo] = useState<any>()

  const publicData = useSelector(
    (state: RootState) => state.publicSetting.publicData
  )

  const [cargoInfo, setCargoInfo] = useState<ModalContent>({
    visible: false,
    editRow: null,
  })

  const [accountInfo, setAccountInfo] = useState<ModalContent>({
    visible: false,
    editRow: null,
  })

  const [baseInfo, setBaseInfo] = useState(OrderDetailBaseInfo)

  const OrderDetailTabs: TabsProps['items'] = [
    {
      key: '1',
      label: '航线基本信息',
      children: <AreaBaseInfo type={orderInfo?.type} orderInfo={orderInfo} />,
    },
    {
      key: '2',
      label: '订舱结果',
      children: <BookingResult orderInfo={orderInfo} />,
    },
    {
      key: '3',
      label: '支付信息',
      children: <PayMessage orderInfo={orderInfo} />,
    },
    {
      key: '4',
      label: '订舱频率',
      children: <BookingFrequency />,
    },
  ]

  const OtherJudgeCondition = (value: {
    status: string
    cancelStatus: string | null
    refundStatus: string | null
    payStatus: string | null
  }) => {
    return statusAllList.find((item) => item.conditionFun(value))
  }

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
    )
  }, [orderInfo])

  useEffect(() => {
    getOrderDetail(String(params.id)).then((res) => {
      /**
       * Todo：拷贝数据 condition：type 为 BOOKING时
       * 将接口返回字段中的bookedInfo中的productInfo值全部拷贝到新对象中（bookingInfo）
       */
      let copyData = {
        ...res.data,
        bookingInfo:
          res.data.type === 'BOOKING'
            ? {
                ...res.data?.bookedInfo,
                ...res.data?.bookedInfo?.productInfo,
              }
            : { ...res.data?.bookedInfo },
      }
      setOrderInfo(copyData)
      // 根据key || getValue 填充内容
      OrderDetailBaseInfo.map((item) => {
        if (item.key && !item.bySetting) {
          item.value = !item.getValue
            ? copyData[item.key]
            : item.getValue(copyData[item.key])
        } else if (item.bySetting) {
          let key = copyData[item.key]
          item.value = publicData[item.bySetting][key]
        }
      })
      setBaseInfo(OrderDetailBaseInfo)
    })
  }, [])

  const getTimeLineInfo = (info: OrderDetailTimeLine[]) => {
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
      }
    })
    return (
      <div className="p-[20px] bg-white rounded-[6px] mt-[20px]">
        <h3 className="text-dull-grey text-base font-medium mb-[17px]">
          订单动态
        </h3>
        <Timeline items={items} />
      </div>
    )
  }

  const getBaseInfo = (info: any) => {
    return (
      <>
        <div className="grid grid-cols-3 gap-[16px] mt-[16px]">
          {info &&
            info
              .slice(0, info.length - 4)
              .map((item: OrderDetailBaseInfoType, index: number) => (
                <span
                  className={`text-light-grey whitespace-nowrap ${
                    orderInfo?.type !== item.type && item.type !== 'ALL'
                      ? 'hidden'
                      : ''
                  }`}
                  key={index}
                >
                  {item.label}：
                  <span className="text-dull-grey">{item.value}</span>
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
          {info &&
            info
              .slice(info.length - 4, info.length)
              .map((item: OrderDetailBaseInfoType, index: number) => (
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
    )
  }

  const onClick = (item: OrderDetailBaseInfoType) => {
    if (item.key === 'affiliateName' || item.key === 'customerName') {
      navigate('/')
    } else {
      item.key === 'cargo'
        ? setCargoInfo({ visible: true, editRow: orderInfo })
        : setAccountInfo({
            visible: true,
            editRow: orderInfo?.orderCarrierAccounts,
          })
    }
  }

  const getIcon = (suffix: string) => {
    return (
      process.env.VITE_STATIC_API + '/static/website/order-status/' + suffix
    )
  }

  return (
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
            {getBaseInfo(baseInfo)}
          </div>
        </div>
        <div className="bg-white mt-[10px] px-[20px] py-[16px]">
          <Tabs
            items={
              orderInfo?.type === 'BOOKING'
                ? OrderDetailTabs.slice(0, 3)
                : OrderDetailTabs
            }
            defaultActiveKey="1"
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
              <Button size="large" className={'button cancel-type'}>
                {statusOtions()?.cancelBtnText}
              </Button>
              <Button size="large" className={'button confirm-type ml-[8px]'}>
                {statusOtions()?.confirmBtnText}
              </Button>
            </div>
          )}
        </div>
        {orderInfo?.events && getTimeLineInfo(orderInfo?.events)}
      </div>
      <CargoRequirement
        params={cargoInfo}
        onCancel={() => setCargoInfo({ visible: false, editRow: null })}
      />
      <OrderCarrierAccounts
        params={accountInfo}
        onCancel={() => setAccountInfo({ visible: false, editRow: null })}
      />
    </div>
  )
})

export default OrderDetail
