import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Input, Table, TableProps } from 'antd'
import { ORDER, statusAllList } from '../../../config'
import { loadAdditionalCharges } from '@/utils/freight'
import { FreightPriceListType } from '@/utils/freight/type'
import { filterKeys } from '@/utils/tool'

type CtnType = {
  ctnType: string
  ctnNum: number
  cargoWeights: number
  limitedPrice: number
  totalPriceUsd: number
  vote: number
}

type ProductInfoType = {
  surchargeRemark: string
  penaltyRemark: string
  remark: string
  priceList: FreightPriceListType[]
  [key: string]: string | any
}

type OrderInfoParmas = {
  items: CtnType[]
  bookingInfo: ProductInfoType
  carrierInfo: any
  orderCarrierAccounts: any
  por: any
  fnd: any
}

interface AreaBaseInfoProps {
  type: string
  orderInfo: OrderInfoParmas
}

const OtherRemarkInfo = [
  {
    label: '附加费备注',
    key: 'surchargeRemark',
  },
  {
    label: '亏舱费备注',
    key: 'penaltyRemark',
  },
  {
    label: '备注',
    key: 'remark',
  },
]

const carrierTableColumns: TableProps['columns'] = [
  {
    dataIndex: 'code',
    title: '船公司编号',
    key: 'code',
    align: 'center',
  },
  {
    dataIndex: 'shortName',
    title: '船公司名字',
    key: 'shortName',
    align: 'center',
  },
]

const accountTableColumns: TableProps['columns'] = [
  {
    dataIndex: 'name',
    title: '船公司编号',
    key: 'name',
    align: 'center',
  },
  {
    dataIndex: 'username',
    title: '登录名',
    key: 'username',
    align: 'center',
  },
  {
    dataIndex: 'password',
    title: '登陆密码',
    key: 'password',
    align: 'center',
  },
  {
    dataIndex: 'payPassword',
    title: '支付密码',
    key: 'payPassword',
    align: 'center',
  },
]

const protServiceColumns: TableProps['columns'] = [
  {
    dataIndex: 'id',
    title: '港口ID',
    key: 'id',
    align: 'center',
  },
  {
    title: '港口名称',
    key: 'name',
    align: 'center',
    render(text) {
      return text?.name + '-' + text?.localName
    },
  },
  {
    title: '港口标记',
    key: 'index',
    align: 'center',
    render(text, record, index) {
      return index === 0 ? 'podPort' : 'fndPort'
    },
  },
]

const AreaBaseInfo: React.FC<AreaBaseInfoProps> = memo((props) => {
  const { type, orderInfo } = props

  const { TextArea } = Input

  const textClass = 'mt-[40px] mb-[10px] font-bold text-dull-grey'

  const [baseCtnType, setBaseCtnType] = useState<string[]>([])

  const [columns, setColumns] = useState<TableProps['columns']>([
    {
      dataIndex: 'name',
      title: '订舱信息',
      key: 'name',
      align: 'center',
    },
  ])
  const [tableData, setTableData] = useState([])

  const contactPort = useMemo(() => {
    return orderInfo?.por ? [orderInfo?.por].concat([orderInfo?.fnd]) : []
  }, [orderInfo])

  useEffect(() => {
    setBaseCtnType(ORDER.slice(0, 4).concat([ORDER[6]]))
    if (props.orderInfo) getBaseInfo()
  }, [type])

  const getBaseInfo = () => {
    let newCol: TableProps['columns'] = baseCtnType.map((item: string) => {
      return {
        dataIndex: item,
        title: item,
        key: item,
        align: 'center',
      }
    })
    setColumns(columns?.concat(newCol))
    getTableData()
  }

  const getTableData = () => {
    let title = ['价格上限(USD)', '数量']
    let newData: any = []
    for (let i in title) {
      orderInfo?.items.map((item) => {
        newData.push({
          name: title[i],
          [item.ctnType]:
            i === '0'
              ? type === 'BOOKING'
                ? item.totalPriceUsd
                : item.limitedPrice
              : type === 'BOOKING'
              ? item.ctnNum
              : item.vote +
                '票 ' +
                (item.ctnNum ? ' 每票' + item.ctnNum + '箱' : ''),
        })
      })
    }
    setTableData(newData)
  }

  const getPriceFee = () => {
    const priceList = loadAdditionalCharges(orderInfo?.bookingInfo?.priceList)
    // const columnsName = useMemo(() => {
    //   return '起运港费用'
    // }, [priceList])
    const firstColumns: TableProps['columns'] = [
      {
        dataIndex: 'chargeName',
        title: '订舱信息',
        key: 'chargeName',
        align: 'center',
      },
    ]
    const resetColumns = firstColumns.concat(
      columns?.slice(1, columns.length) as any
    )
    console.log(
      priceList,
      'priceList',
      orderInfo?.bookingInfo?.priceList,
      resetColumns
      // columnsName
    )
    return (
      <>
        <Table
          className="mt-[40px]"
          columns={resetColumns}
          dataSource={priceList?.oceanFreight}
          pagination={false}
          rowKey={(record) => record?.chargeName || 'chargeName'}
        />
        <Table
          className="mt-[40px]"
          columns={resetColumns}
          dataSource={priceList?.porPriceList}
          pagination={false}
          rowKey={(record) => record?.chargeName || 'chargeName'}
        />
      </>
    )
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey={'name'}
        pagination={false}
      />
      <div className="grid grid-cols-3 gap-[10px] mt-[40px]">
        {type === 'BOOKING' &&
          OtherRemarkInfo.map((item) => (
            <div key={item.key}>
              <p className="font-bold text-dull-grey mb-[8px]">{item.label}</p>
              <TextArea value={orderInfo?.bookingInfo[item.key]} disabled />
            </div>
          ))}
      </div>
      <p className="mt-[40px] font-bold text-dull-grey">涉及船公司</p>
      <Table
        columns={carrierTableColumns}
        dataSource={[orderInfo?.carrierInfo]}
        rowKey={(record) => record?.code || 'code'}
        pagination={false}
      />
      <p className="mt-[40px] font-bold text-dull-grey">涉及账号</p>
      <Table
        // title={() => '涉及账号'}
        columns={accountTableColumns}
        dataSource={orderInfo?.orderCarrierAccounts}
        rowKey={'username'}
        pagination={false}
      />
      <p className="mt-[40px] font-bold text-dull-grey">航线信息</p>
      <p className={textClass}>港口航线信息</p>
      <Table
        columns={protServiceColumns}
        dataSource={contactPort}
        pagination={false}
        rowKey={(record) => record?.id || 'id'}
      />
      {/* <Table  /> */}
      {orderInfo && getPriceFee()}
    </>
  )
})

export default AreaBaseInfo
