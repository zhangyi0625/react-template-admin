import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import {
  DeleteOutlined,
  ImportOutlined,
  LoginOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
} from 'antd'
import { useState } from 'react'
import { SelectShippingAccountOptions } from './config'
import { ShippingAccounParams } from '@/services/essential/shippingAccount/shippingAccountModel'
import { filterKeys } from '@/utils/tool'

const ShippingAccount: React.FC = () => {
  const { modal, message } = App.useApp()

  const [selectoptions, setSelectOptions] = useState(
    SelectShippingAccountOptions
  )
  const [selRows, setSelectedRows] = useState<any[]>([])

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<ShippingAccounParams>({
      page: 1,
      size: 10,
      carrier: null,
      account: null,
    })

  const onAddClick = () => {}

  const onUpdateSearch = (info?: ShippingAccounParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'size'], true)
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
  }

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      size: pagination.pageSize as number,
    })
  }
  return (
    <>
      {/* 菜单检索条件栏 */}
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 0,
            },
          },
        }}
      >
        <Card>
          <SearchForm
            columns={selectoptions}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
            isShowReset={true}
            isShowExpend={false}
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
        <Card>
          <Space className="mb-[20px]">
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick}>
              添加账号
            </Button>
            <Button
              color="orange"
              icon={<ImportOutlined />}
              variant="solid"
              onClick={onAddClick}
            >
              批量导入账号
            </Button>
            <Button
              variant="solid"
              icon={<LoginOutlined />}
              color="green"
              disabled={selRows.length === 0}
            >
              账号预登陆
            </Button>
            <div className="underline text-blue-500 text-sm">
              下载账号导入模版
            </div>
          </Space>
          {/* <SearchTable
            size="large"
            columns={columns}
            bordered
            rowKey="id"
            fetchData={getRoleList}
            searchFilter={searchDefaultForm}
            isSelection={true}
            onUpdatePagination={onUpdatePagination}
            onUpdateSelection={(options: string[]) => setSelectedRows(options)}
          /> */}
        </Card>
      </ConfigProvider>
    </>
  )
}

export default ShippingAccount
