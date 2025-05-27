import React, { memo, useEffect, useState } from 'react'
import { Spin, Table, TableProps } from 'antd'
import { TablePaginationConfig } from 'antd/lib'
import useParentSize from '@/hooks/useParentSize'

type OrderTableObject = {
  orderNo: string
  affiliateName: string
  customerName: string
  [key: string]: any
}

interface SearchTableProps<T = OrderTableObject>
  extends Omit<TableProps<T>, 'columns' | 'datasource'> {
  columns: TableProps['columns']
  fetchData: (pagination: TablePaginationConfig | any) => Promise<any>
  searchFilter?: any
  rowKey: string
  onUpdatePagination: (pagination: TablePaginationConfig) => void
}

const searchTable: React.FC<SearchTableProps> = memo((props) => {
  const { columns, fetchData, searchFilter, rowKey, onUpdatePagination } = props

  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState<boolean>(false)

  const { height } = useParentSize()

  const [currentPagination, setCurrentPagination] =
    useState<TablePaginationConfig>({
      current: 1,
      pageSize: 10,
      total: 0,
    })

  const loadTableData = async (paginationConfig = currentPagination) => {
    setLoading(true)
    const response = await fetchData(searchFilter)
    setTableData(response.entries)
    setCurrentPagination({ ...paginationConfig, total: response.total })
    try {
    } catch {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTableData()
  }, [
    currentPagination.pageSize,
    currentPagination.pageSizeOptions,
    searchFilter,
  ])

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPagination({
      ...currentPagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })
    onUpdatePagination(pagination)
  }

  return (
    <Spin spinning={loading}>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={currentPagination}
        onChange={handleTableChange}
        rowKey={rowKey}
        scroll={{ x: 'max-content', y: height - 128 }}
      />
    </Spin>
  )
})

export default searchTable
