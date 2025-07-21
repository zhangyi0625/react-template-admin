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
  ExclamationCircleFilled,
  ImportOutlined,
  LoginOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, setEssentail } from '@/stores/store'
import { SelectShippingAccountOptions } from './config'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import {
  ShippingAccounParams,
  ShippingAccounType,
} from '@/services/customerInformation/shippingAccount/shippingAccountModel'
import {
  getShippingAccountListByPage,
  addShippingAccountList,
  batchImportShippingAccount,
  putShippingAccountList,
  deleteShippingAccountList,
} from '@/services/customerInformation/shippingAccount/shippingAccountApi'
import AddShippingAccount from './AddShippingAccount'
import ImportShippingAccout from './ImportShippingAccout'
import { getCarrierManageList } from '@/services/essential/carrierManage/carrierManageApi'
import { getCustomerManageList } from '@/services/essential/customerManage/customerManageApi'
import type { CustomerManageType } from '@/services/essential/customerManage/customerManageModel'
import type { CarrierManageType } from '@/services/essential/carrierManage/carrierManageModel'
import { filterKeys } from '@/utils/tool'
import { formatTime } from '@/utils/format'
import useParentSize from '@/hooks/useParentSize'

const API = process.env.VITE_STATIC_API

const ShippingAccount: React.FC = () => {
  const { modal, message } = App.useApp()

  const { parentRef, height } = useParentSize()

  const dispatch = useDispatch()

  const essential = useSelector((state: RootState) => state.essentail)

  const [selectoptions, setSelectOptions] = useState(
    SelectShippingAccountOptions
  )
  const [selRows, setSelectedRows] = useState<any[]>([])

  const [searchDefaultForm, setSearchDefaultForm] =
    useState<ShippingAccounParams>({
      page: 1,
      limit: 10,
      carrier: null,
      account: null,
    })

  const [carrierOptions, setCarrierOptions] = useState<
    { id: string; name: string }[]
  >([])

  const [customerOptions, setCustomerOptions] = useState<CustomerManageType[]>(
    []
  )

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
    // {
    //   title: '客户简称',
    //   dataIndex: 'custometName',
    //   key: 'custometName',
    //   align: 'center',
    // },
    {
      title: '船司账号',
      dataIndex: 'account',
      key: 'account',
      width: 200,
      align: 'center',
    },
    {
      title: '账号抬头',
      dataIndex: 'accountHead',
      key: 'accountHead',
      align: 'center',
    },
    {
      title: '账号类型',
      key: 'type',
      align: 'center',
      render(text) {
        return <div>{text.type === 'QUERY' ? '查询' : '下单'}</div>
      },
    },
    {
      title: '账号状态',
      key: 'vaild',
      align: 'center',
      render(text) {
        return (
          <div className={`text-${text.isValid ? 'blue' : 'red'}-500`}>
            {text.vaild ? '有效' : '无效'}
          </div>
        )
      },
    },
    {
      title: '更新时间',
      key: 'updateTime',
      align: 'center',
      render(text) {
        return <div>{formatTime(text.updateTime, 'Y-M-D h:m')}</div>
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
    if (!essential.carrierData) {
      loadSearchList()
    } else {
      getReduxData()
    }
  }, [])

  // 重新更新查询部分数据 并存储进redux
  const loadSearchList = () => {
    Promise.all([getCarrierManageList(), getCustomerManageList]).then(
      (resp) => {
        let key = ['carrierData', 'customerData']
        key.map((_, index: number) => {
          dispatch(setEssentail({ value: resp[index], key: key[index] }))
        })
        setTimeout(() => {
          getReduxData()
        }, 500)
      }
    )
  }

  const getReduxData = () => {
    let { carrierData = [], customerData = [] } = essential
    let carrier = carrierData.map((item: Pick<CarrierManageType, 'code'>) => {
      return {
        id: item.code,
        name: item.code,
      }
    })
    let customer = customerData.map((item: CustomerManageType) => {
      return {
        value: item.id,
        label: item.name,
      }
    })
    selectoptions.map((item) => {
      if (item.name === 'carrier') item.options = carrier
      if (item.name === 'customerId') item.options = customer
    })
    setCustomerOptions(customerData)
    setSelectOptions(selectoptions)
    setCarrierOptions(carrier)
  }

  const readyLogin = () => {
    if (selRows.length === 0) {
      message.error('请选择预登陆账号！')
    } else {
    }
  }

  const deleteBatch = (id: string) => {
    modal.confirm({
      title: '删除船司账号',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该船司账号吗？数据删除后将无法恢复！',
      onOk() {
        deleteShippingAccountList(id).then(() => {
          // 刷新表格数据
          onUpdateSearch()
        })
      },
    })
  }

  const downLoadFile = () => {
    let elemIF = document.createElement('iframe')
    elemIF.src = `${API}/static/file/importShippingAccount-template.xlsx`
    elemIF.style.display = 'none'
    document.body.appendChild(elemIF)
  }

  const onUpdateSearch = (info?: ShippingAccounParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'limit'], true)
    setSearchDefaultForm({
      ...pageInfo,
      ...filteredObj,
    })
  }

  const onUpdatePagination = (pagination: TablePaginationConfig) => {
    setSearchDefaultForm({
      ...searchDefaultForm,
      page: pagination.current as number,
      limit: pagination.pageSize as number,
    })
  }

  const onEditOk = async (roleData: ShippingAccounType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addShippingAccountList(roleData)
      } else {
        // 编辑数据
        await putShippingAccountList(roleData)
      }
      message.success(!params.currentRow ? '添加成功' : '修改成功')
      // 操作成功，关闭弹窗，刷新数据
      setParams({ visible: false, currentRow: null, view: false })
      onUpdateSearch()
    } catch (error) {}
  }

  const importShippingAccount = (info: any) => {
    batchImportShippingAccount(info).then(() => {
      message.success('导入成功')
      setImportModel(false)
      onUpdateSearch()
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
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <Space className="mb-[8px]">
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
            onClick={readyLogin}
          >
            账号预登陆
          </Button>
          <div
            className="underline text-blue-500 text-sm cursor-pointer"
            onClick={downLoadFile}
          >
            下载账号导入模版
          </div>
        </Space>
        <SearchTable
          size="middle"
          columns={columns}
          bordered
          rowKey="id"
          scroll={{ x: 'max-content', y: height - 158 }}
          fetchData={getShippingAccountListByPage}
          searchFilter={searchDefaultForm}
          isSelection={true}
          onUpdatePagination={onUpdatePagination}
          onUpdateSelection={(options: string[]) => setSelectedRows(options)}
        />
      </Card>
      <AddShippingAccount
        params={params}
        carrierOptions={carrierOptions}
        customerOptions={customerOptions}
        onOk={onEditOk}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, view: false })
        }
      />
      <ImportShippingAccout
        title="导入船司账号"
        options={customerOptions}
        type="importShippingAccount"
        visible={importModel}
        onOk={importShippingAccount}
        onCancel={() => setImportModel(false)}
      />
    </>
  )
}

export default ShippingAccount
