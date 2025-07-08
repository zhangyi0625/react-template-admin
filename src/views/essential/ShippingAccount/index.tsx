import { useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
} from 'antd'
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  ImportOutlined,
  LoginOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { SelectShippingAccountOptions } from './config'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import {
  ShippingAccounParams,
  ShippingAccounType,
} from '@/services/essential/shippingAccount/shippingAccountModel'
import {
  getCarrierList,
  getShippingAccountList,
} from '@/services/essential/shippingAccount/shippingAccountApi'
import AddShippingAccount from './AddShippingAccount'
import ImportShippingAccout from './ImportShippingAccout'
import { filterKeys } from '@/utils/tool'
import { formatTime } from '@/utils/format'

const API = process.env.VITE_STATIC_API

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

  const [carrierOptions, setCarrierOptions] = useState<
    { id: string; name: string }[]
  >([])

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: any
    view: boolean
  }>({
    visible: false,
    currentRow: null,
    view: false,
  })

  const [importModel, setImportModel] = useState<boolean>(false)

  const columns: TableProps['columns'] = [
    {
      title: '船公司',
      dataIndex: 'carrier',
      key: 'carrier',
      align: 'center',
    },
    {
      title: '客户简称',
      dataIndex: 'customer',
      key: 'customer',
      align: 'center',
    },
    {
      title: '船司账号',
      dataIndex: 'account',
      key: 'account',
      width: 200,
      align: 'center',
    },
    {
      title: '账号抬头',
      dataIndex: 'accountHeader',
      key: 'accountHeader',
      align: 'center',
    },
    {
      title: '账号类型',
      key: 'accountType',
      align: 'center',
      render(text) {
        return <div>{text.accountType === 'search' ? '查询' : '下单'}</div>
      },
    },
    {
      title: '账号状态',
      key: 'vaild',
      align: 'center',
      render(text) {
        return (
          <div className={`text-${text.vaild ? 'blue' : 'red'}-500`}>
            {text.vaild ? '有效' : '无效'}
          </div>
        )
      },
    },
    {
      title: '更新时间',
      key: 'updated',
      align: 'center',
      render(text) {
        return <div>{formatTime(text.updated, 'Y-M-D h:m')}</div>
      },
    },
    {
      title: '操作',
      width: '14%',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      render(_, record) {
        return (
          <Space size={0}>
            <Button
              type="link"
              size="small"
              onClick={() =>
                setParams({ visible: true, currentRow: record, view: true })
              }
            >
              修改
            </Button>
            <Button
              type="link"
              danger
              size="small"
              onClick={() => deleteBatch(record.id)}
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    loadCarrierList()
  }, [])

  const loadCarrierList = async () => {
    let res = await getCarrierList()
    let carrier = res.map((item: { carrierCode: string }) => {
      return {
        id: item.carrierCode,
        name: item.carrierCode,
      }
    })
    selectoptions.map((item) => {
      if (item.name === 'carrier') item.options = carrier
    })
    setSelectOptions([...selectoptions])
    setCarrierOptions(carrier)
  }

  const onAddClick = () => {}

  const deleteBatch = (id: string) => {
    modal.confirm({
      title: '删除角色',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该角色吗？数据删除后将无法恢复！',
      onOk() {
        // deleteRole(id).then(() => {
        //   // 刷新表格数据
        //   onUpdateSearch()
        // })
      },
    })
  }

  const downLoadFile = () => {
    let elemIF = document.createElement('iframe')
    elemIF.src = `${API}/static/file/exportBatch-template.xlsx`
    elemIF.style.display = 'none'
    document.body.appendChild(elemIF)
  }

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

  const onEditOk = async (roleData: ShippingAccounType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        // await addRole(roleData)
      } else {
        // 编辑数据
        // await editRole(roleData)
      }
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, view: false })
      onUpdateSearch()
    } catch (error) {
      modal.error({
        title: '操作失败',
        content: `原因：${error}`,
      })
    }
  }

  const importShippingAccount = (info: any) => {
    console.log(info, 'info')
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                setParams({ visible: true, currentRow: null, view: true })
              }
            >
              添加账号
            </Button>
            <Button
              color="orange"
              icon={<ImportOutlined />}
              variant="solid"
              onClick={() => setImportModel(true)}
            >
              批量导入账号
            </Button>
            <Button
              variant="solid"
              icon={<LoginOutlined />}
              color="green"
              // disabled={selRows.length === 0}
            >
              账号预登陆
            </Button>
            <div
              className="underline text-blue-500 text-sm cussor-pointer"
              onClick={downLoadFile}
            >
              下载账号导入模版
            </div>
          </Space>
          <SearchTable
            size="large"
            columns={columns}
            bordered
            rowKey="id"
            fetchData={getShippingAccountList}
            searchFilter={searchDefaultForm}
            isSelection={true}
            onUpdatePagination={onUpdatePagination}
            onUpdateSelection={(options: string[]) => setSelectedRows(options)}
          />
        </Card>
      </ConfigProvider>
      <AddShippingAccount
        params={params}
        carrierOptions={carrierOptions}
        onOk={() => onEditOk}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, view: false })
        }
      />
      <ImportShippingAccout
        visible={importModel}
        onOk={() => importShippingAccount}
        onCancel={() => setImportModel(false)}
      />
    </>
  )
}

export default ShippingAccount
