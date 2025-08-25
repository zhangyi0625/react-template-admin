import React, { useEffect, useMemo, useState } from 'react'
import { Button, Drawer, Space, Table, TableProps } from 'antd'
import { SearchTable } from 'customer-search-form-table'
import { getCustomerManageList } from '@/services/essential/customerManage/customerManageApi'
import type { AffilateAccountType } from '@/services/todayPlan/todayPlanModal'

export type ShippingAccountDrawerProps = {
  params: {
    visible: boolean
    type: 'search' | 'login'
    currentRow: AffilateAccountType[] | null
  }
  onCancel: () => void
  onLoginAccount: (customerId: string) => void
  onBatchLogin: (ids: string[]) => void
}

const ShippingAccountDrawer: React.FC<ShippingAccountDrawerProps> = ({
  params,
  onCancel,
  onLoginAccount,
  onBatchLogin,
}) => {
  const { visible, type, currentRow = [] } = params

  const [dataSource, setDataSource] = useState<AffilateAccountType[]>([])

  const title = useMemo(() => {
    return type === 'search' ? '船司账号' : '账号预登陆'
  }, [type])

  useEffect(() => {
    if (!visible) return
    setDataSource(currentRow ?? [])
    console.log(params, type)
  }, [visible])

  const tableColumns: TableProps['columns'] = [
    {
      title: '序号',
      width: 70,
      render: (_, _blank, index) => `${index + 1}`,
      align: 'center',
    },
    {
      title: '船司账号',
      key: 'carrier',
      dataIndex: 'carrier',
      hidden: type === 'login',
      align: 'center',
      width: 80,
    },
    {
      title: '账号抬头',
      key: 'accountHead',
      dataIndex: 'accountHead',
      hidden: type === 'login',
      align: 'center',
      width: 100,
    },
    {
      title: '客户',
      key: 'customerName',
      dataIndex: 'customerName',
      hidden: type === 'search',
      align: 'center',
      width: 100,
    },
    {
      title: '预登录时间',
      key: 'loginTime',
      dataIndex: 'loginTime',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      key: 'customer',
      align: 'center',
      hidden: type === 'search',
      width: 100,
      render(_) {
        return (
          <div
            className="cursor-pointer text-normal-blue text-sm"
            onClick={() => {
              onLoginAccount(_.customerId)
            }}
          >
            登陆账号
          </div>
        )
      },
    },
  ]

  return (
    <Drawer
      title={title}
      width={736}
      open={visible}
      onClose={onCancel}
      classNames={{ footer: 'text-right' }}
      extra={
        <Space>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      }
    >
      <Space>
        {type === 'login' && (
          <Button
            onClick={() =>
              onBatchLogin(dataSource.map((item) => item.customerId))
            }
            type="primary"
          >
            批量登陆
          </Button>
        )}
      </Space>
      <Table
        style={{ marginTop: '10px' }}
        size="middle"
        columns={tableColumns}
        dataSource={dataSource}
        rowKey={type === 'search' ? 'id' : 'fndCode'}
      />
      {/* <SearchTable
        style={{ marginTop: '10px' }}
        size="middle"
        totalKey=""
        fetchResultKey="data"
        isPagination={false}
        columns={tableColumns}
        bordered
        rowKey="id"
        // scroll={{ x: 'max-content', y: height - 298 }}
        fetchData={getCustomerManageList}
        // searchFilter={searchDefaultForm}
        isSelection={false}
        onUpdatePagination={() => {}}
      /> */}
    </Drawer>
  )
}

export default ShippingAccountDrawer
