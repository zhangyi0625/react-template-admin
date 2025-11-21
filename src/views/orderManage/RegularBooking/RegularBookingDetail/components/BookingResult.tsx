import { memo, useEffect, useState } from 'react';
import { Table, TableProps } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';

interface BookingResultProps {
  orderInfo: any;
}

const BookingResult: React.FC<BookingResultProps> = memo(({ orderInfo }) => {
  const [tableData, setTableData] = useState([]);

  const { publicData } = useSelector((state: RootState) => state.publicSetting);

  const { fundRechargeStatus } = publicData;

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
    },
    {
      dataIndex: 'bookingNo',
      title: '订舱号',
      align: 'center',
    },
    {
      title: '支付状态',
      align: 'center',
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
    },
    {
      dataIndex: 'bookedTime',
      title: '订舱时间',
      align: 'center',
    },
    {
      dataIndex: 'ctnNum',
      title: '柜型',
      align: 'center',
    },
    {
      dataIndex: 'ctnNum',
      title: '数量',
      align: 'center',
    },
    {
      dataIndex: 'price',
      title: '单价(USD)',
      align: 'center',
      fixed: 'right',
    },
  ];

  useEffect(() => {
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
            orderInfo?.items[0]?.basPrice ?? orderInfo?.items[0]?.limitedPrice,
        };
      }
    );
    setTableData(arr);
  }, []);
  return (
    <Table
      columns={columns}
      dataSource={tableData}
      rowKey={'id'}
      pagination={false}
      scroll={{ x: 'max-content' }}
    />
  );
});

export default BookingResult;
