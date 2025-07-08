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
  isSelection: boolean
  isPagination?: boolean
  selectionParentType?: 'checkbox' | 'radio'
  immediate?: boolean
  onUpdatePagination: (pagination: TablePaginationConfig) => void
  onUpdateSelection?: (idAdrr: string[], dataRow?: any) => void
}

const searchTable: React.FC<SearchTableProps> = memo((props) => {
  const {
    bordered,
    columns,
    fetchData,
    searchFilter,
    rowKey,
    isSelection,
    isPagination,
    selectionParentType,
    immediate,
    onUpdatePagination,
    onUpdateSelection,
    onRow,
  } = props

  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState<boolean>(false)

  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox'
  )

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
    console.log('response', response)

    setTableData(response.entries ?? response.results)
    setCurrentPagination({ ...paginationConfig, total: Number(response.total) })
    try {
    } catch {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!immediate) {
      loadTableData()
    }
    setSelectionType(selectionParentType ?? selectionType)
    console.log(props, 'props')
  }, [
    currentPagination.pageSize,
    currentPagination.pageSizeOptions,
    searchFilter,
    immediate,
    selectionParentType,
  ])

  const handleTableChange = (pagination: TablePaginationConfig) => {
    // if (isPagination) {
    setCurrentPagination({
      ...currentPagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })
    onUpdatePagination(pagination)
    // }
  }

  const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      )
      if (onUpdateSelection && isSelection)
        onUpdateSelection(
          selectedRows.map((item: { id: number }) => item.id),
          selectedRows
        )
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }

  return (
    <Spin spinning={loading}>
      <Table
        size={props.size}
        bordered
        columns={columns}
        dataSource={tableData}
        pagination={currentPagination}
        onChange={handleTableChange}
        rowKey={rowKey}
        scroll={{ x: 'max-content', y: height - 128 }}
        rowSelection={
          isSelection
            ? {
                type: selectionType,
                ...rowSelection,
              }
            : undefined
        }
      />
    </Spin>
  )
})

export default searchTable
