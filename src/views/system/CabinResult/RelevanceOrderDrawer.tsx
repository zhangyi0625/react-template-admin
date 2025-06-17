import { useEffect, useState } from 'react'
import { Drawer, Space, Button, TablePaginationConfig, TableProps } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import SearchTable from '@/components/searchTable'
import { getFastOrderOptions } from '@/services/order'
import type { OrderSearchParams } from '@/services/order/type'
import { formatTime } from '@/utils/format'

type RelevanceOrderDrawerType = {
  drawerShow: boolean
  onOk: (e: React.MouseEvent<HTMLButtonElement>) => void
  onCancel: (e: any) => void
}

const RelevanceOrderDrawer: React.FC<RelevanceOrderDrawerType> = (props) => {
  const { drawerShow, onOk, onCancel } = props

  const [selected, setSelected] = useState<string[]>([])

  const [immediate, setImmediate] = useState<boolean>(true)

  const [searchDefaultForm, setSearchDefault] = useState<OrderSearchParams>({
    pageIndex: 1,
    pageSize: 10,
    filter: {
      affiliateId: '',
    },
  })

  useEffect(() => {
    setSearchDefault({ ...searchDefaultForm, filter: { affiliateId: '105' } })
    if (drawerShow) {
      setImmediate(false)
    }
  }, [drawerShow])

  const columns: TableProps['columns'] = [
    {
      dataIndex: 'no',
      title: '订单号',
      key: 'no',
      align: 'center',
    },
    {
      title: '目的港名称',
      key: 'fnd',
      align: 'center',
      width: 200,
      render(text) {
        return (
          <div>
            <p>{text.content?.fnd?.localName ?? '-'}</p>
            <p>{text.content?.fnd?.name ?? '-'}</p>
          </div>
        )
      },
    },
    {
      title: '开航起止日期',
      key: 'createTime',
      align: 'center',
      render(text) {
        return (
          <div>
            {formatTime(text.content?.etdStart, 'M-D')} 至
            {formatTime(text.content?.etdEnd, 'M-D')}
          </div>
        )
      },
    },
  ]

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefault({
      ...searchDefaultForm,
      pageIndex: pagination.current as number,
      pageSize: pagination.pageSize as number,
    })
    setImmediate(false)
  }

  const onUpdateSearch = (
    info: Pick<OrderSearchParams, 'filter'> | unknown
  ) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([key, value]) => !!value)
    )
    setSearchDefault({
      ...searchDefaultForm,
      filter: {
        ...filteredObj,
      },
    })
  }

  return (
    <Drawer
      title="关联订单"
      width={600}
      open={drawerShow}
      closeIcon={false}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onCancel} />}
      onClose={onCancel}
      classNames={{ footer: 'text-right' }}
      footer={
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={onOk}>
            确定
          </Button>
        </Space>
      }
    >
      <SearchTable
        columns={columns}
        rowKey="id"
        fetchData={getFastOrderOptions}
        searchFilter={searchDefaultForm}
        isSelection={true}
        immediate={immediate}
        onUpdatePagination={onUpdatePagination}
        onUpdateSelection={(options: string[]) => setSelected(options)}
      />
    </Drawer>
  )
}

export default RelevanceOrderDrawer
