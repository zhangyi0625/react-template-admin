import { Table, TableProps } from 'antd';
import { FastBooingDetailItemsType } from '../../type';

export type AreaBaseInfoProps = {
  baseInfoList: FastBooingDetailItemsType[];
};

const AreaBaseInfo: React.FC<AreaBaseInfoProps> = ({ baseInfoList }) => {
  const columns: TableProps['columns'] = [
    {
      dataIndex: 'containerType',
      title: '订舱信息',
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'orderNum',
      title: '票数',
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'containerQuantity',
      title: '数量',
      align: 'center',
      width: 100,
    },
    {
      title: '价格上限',
      align: 'center',
      render(value) {
        return (
          <div>
            {value.priceLimit.TOTAL && value.rose >= 0 ? (
              <span>
                $ {value.priceLimit.TOTAL['USD']}
                <span className="mx-[10px]">拍一手价,允许涨幅{value.rose}</span>
                <span></span>
              </span>
            ) : value.rose === 0 && !value.priceLimit.TOTAL ? (
              <span>一手价</span>
            ) : (
              <span> 价格上限 ${value.priceLimit.TOTAL['USD']}</span>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        dataSource={baseInfoList}
        rowKey={'containerType'}
        pagination={false}
      />
    </>
  );
};

export default AreaBaseInfo;
