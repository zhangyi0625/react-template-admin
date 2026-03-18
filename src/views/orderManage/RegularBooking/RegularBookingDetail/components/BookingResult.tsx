import { memo, useCallback, useEffect, useState } from 'react';
import { Table, type TableProps } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { getFastBookingCabinResult } from '@/services/orderManage/fastBooking/fastBookingApi';
import type { RegularBookingDetailType } from '@/services/orderManage/regularBooking/regularBookingModel';

export type BookingResultProps = {
  orderInfo: RegularBookingDetailType;
  source: 'RegularBooking' | 'FastBooking';
};

interface PriceType {
  bas?: {
    [key: string]: {
      value?: string;
    };
  };
}

const BookingResult: React.FC<BookingResultProps> = memo(
  ({ orderInfo, source }) => {
    const [tableData, setTableData] = useState([]);

    const { publicData } = useSelector(
      (state: RootState) => state.publicSetting,
    );

    const [tableLoading, setTableLoading] = useState<boolean>(false);

    const { fundRechargeStatus } = publicData;

    const getPrice = useCallback(
      (price: PriceType, ctnType: string) => {
        return price?.bas?.[ctnType]?.value ?? '';
      },
      [orderInfo],
    );

    const columns: TableProps['columns'] = [
      {
        dataIndex: 'carrier',
        title: '船公司',
        align: 'center',
      },
      {
        dataIndex: 'bookedBy',
        title: '登录名',
        align: 'center',
        hidden: source === 'FastBooking',
      },
      {
        dataIndex: 'bookingNo',
        title: source === 'RegularBooking' ? '船司订舱号' : '订舱号',
        align: 'center',
      },
      {
        title: '订舱账号',
        align: 'center',
        hidden: source === 'RegularBooking',
        render(value) {
          return <div>{value.bookedBy.username}</div>;
        },
      },
      {
        title: '支付状态',
        align: 'center',
        hidden: source === 'FastBooking',
        render(value) {
          return fundRechargeStatus[value.payStatus];
        },
      },
      {
        dataIndex: 'etd',
        title: '开航日期',
        align: 'center',
      },
      {
        dataIndex: 'vesselInfo',
        title: '船名航次航线',
        align: 'center',
        hidden: source === 'FastBooking',
      },
      {
        title: '船名航次',
        align: 'center',
        hidden: source === 'RegularBooking',
        render(value) {
          return (
            <div>
              {value.vesselName} / {value.voyageNo}
            </div>
          );
        },
      },
      {
        dataIndex: source === 'RegularBooking' ? 'bookedTime' : 'updated',
        title: '订舱时间',
        align: 'center',
      },
      {
        title: '柜型',
        align: 'center',
        render(value) {
          return (
            <div>
              {source === 'RegularBooking'
                ? value.ctnNum
                : Object.keys(value.containers)[0]}
            </div>
          );
        },
      },
      {
        title: '数量',
        align: 'center',
        render(value) {
          return (
            <div>
              {source === 'RegularBooking'
                ? value.ctnNum
                : value.containers[Object.keys(value.containers)[0]]}
            </div>
          );
        },
      },
      {
        title: '单价(USD)',
        align: 'center',
        fixed: 'right',
        render(value) {
          return (
            <div>
              {source === 'RegularBooking'
                ? value.price
                : getPrice(value.price, Object.keys(value.containers)[0])}
            </div>
          );
        },
      },
    ];

    useEffect(() => {
      setTableLoading(true);
      if (source === 'RegularBooking') {
        let details = orderInfo?.items[0]?.details;
        let { productInfo } = orderInfo?.bookingInfo;
        let arr = details.map(
          (item: { basPrice?: string; limitedPrice?: string }) => {
            return {
              ...item,
              carrier: orderInfo?.carrier,
              etd: productInfo?.etd,
              vesselInfo: `${productInfo?.vesselName ?? '-'}/${
                productInfo?.voyNo ?? '-'
              }/${productInfo?.carrierRoute ?? '-'}`,
              payStatus: orderInfo?.payStatus,
              price:
                orderInfo?.items[0]?.basPrice ??
                orderInfo?.items[0]?.limitedPrice,
            };
          },
        );
        setTableData(arr);
        setTableLoading(false);
      } else loadBookingResult();
    }, [source]);

    const loadBookingResult = async () => {
      try {
        const resp = await getFastBookingCabinResult({
          orderId: orderInfo?.id,
        });
        setTableData(resp);
        setTableLoading(false);
      } catch {
        setTableData([]);
        setTableLoading(false);
      }
    };
    return (
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey={'id'}
        pagination={false}
        scroll={{ x: 'max-content' }}
        loading={tableLoading}
      />
    );
  },
);

export default BookingResult;
