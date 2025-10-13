import { useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  TablePaginationConfig,
  TableProps,
  Tabs,
  TabsProps,
} from 'antd'
import useParentSize from '@/hooks/useParentSize'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, setEssentail } from '@/stores/store'
import { SearchForm, SearchTable } from 'customer-search-form-table'
import type {
  CabinTaskTemplateParams,
  TodayPlanParams,
} from '@/services/cabinManage/cabinManageModel'
import { getRouteManageList } from '@/services/customerInformation/routeManage/routeManageApi'
import {
  getFndPortManageList,
  getPorPortManageList,
} from '@/services/essential/portManage/portManageModel'
import { getCarrierManageList } from '@/services/essential/carrierManage/carrierManageApi'
import {
  SelectAffilateAccountOptions,
  SelectScheduleAccountOptions,
} from './config'
import { filterKeys } from '@/utils/tool'
import { getCustomerManageList } from '@/services/essential/customerManage/customerManageApi'
import AddSearchByAffilate from './AddSearchByAffilate'
import ShippingAccountDrawer from './ShippingAccountDrawer'
import {
  addBatchLogin,
  addLoginAccount,
  addTodayLoginRecord,
  getAffilateAccountList,
  getScheduleAccountList,
} from '@/services/todayPlan/todayPlanApi'
import { AffilateAccountType } from '@/services/todayPlan/todayPlanModal'
import { getShippingAccountList } from '@/services/customerInformation/shippingAccount/shippingAccountApi'

const TodayPlan: React.FC = () => {
  const { parentRef, height } = useParentSize()

  const { message } = App.useApp()

  const [today, setToday] = useState<string>(
    '日一二三四五六'.charAt(new Date().getDay())
  )

  const dispatch = useDispatch()

  const essential = useSelector((state: RootState) => state.essentail)

  const [immediate, setImmediate] = useState<boolean>(true)

  const [seleced, setSelected] = useState<string[]>([])

  const [defaultActiveKey, setDefaultActiveKey] =
    useState<string>('searchBySchedule')

  const [searchColumns, setSearchColumns] = useState(
    SelectScheduleAccountOptions
  )

  const [params, setParams] = useState<{
    visible: boolean
    type: 'search' | 'login'
    carrier: string
    currentRow: AffilateAccountType[] | null
  }>({
    visible: false,
    type: 'search',
    carrier: '',
    currentRow: null,
  })

  const [searchDefaultForm, setSearchDefaultForm] = useState<TodayPlanParams>({
    page: 1,
    limit: 10,
  })

  const [addCustomer, setAddCustomer] = useState<boolean>(false)

  const components: TabsProps['items'] = [
    {
      label: '按船期账号预登录',
      key: 'searchBySchedule',
    },
    {
      label: '按公司账号预登录',
      key: 'searchByAffilate',
    },
  ]

  useEffect(() => {
    setImmediate(true)
    if (
      !essential.routeData?.length ||
      !essential.porPortData?.length ||
      !essential.fndPortData?.length ||
      !essential.carrierData?.length ||
      !essential.customerData?.length
    ) {
      loadSearchList()
    } else {
      getReduxData()
    }
  }, [essential, immediate])

  const tableColumns: TableProps['columns'] = [
    {
      title: '船公司',
      key: 'carrier',
      dataIndex: 'carrier',
      align: 'center',
      width: 80,
    },
    {
      title: '起运港',
      key: 'porCode',
      dataIndex: 'porCode',
      hidden: defaultActiveKey === 'searchByAffilate',
      align: 'center',
      width: 100,
    },
    {
      title: '目的港',
      key: 'fndCode',
      dataIndex: 'fndCode',
      hidden: defaultActiveKey === 'searchByAffilate',
      align: 'center',
      width: 100,
    },
    {
      title: '船司航线',
      key: 'routeFndName',
      dataIndex: 'routeFndName',
      hidden: defaultActiveKey === 'searchByAffilate',
      align: 'center',
      width: 100,
    },
    {
      title: '客户名称',
      key: 'customerName',
      dataIndex: 'customerName',
      hidden: defaultActiveKey === 'searchBySchedule',
      align: 'center',
      width: 100,
    },
    {
      title: '预登录时间',
      key: 'time',
      dataIndex: 'time',
      hidden: defaultActiveKey === 'searchBySchedule',
      align: 'center',
      width: 100,
    },
    {
      title: '关联客户',
      key: 'customer',
      align: 'center',
      hidden: defaultActiveKey === 'searchByAffilate',
      width: 100,
      render(_) {
        return (
          <div
            className="cursor-pointer text-normal-blue text-sm"
            onClick={() => {
              setParams({
                visible: true,
                type: 'login',
                carrier: _.carrier,
                currentRow: _.customers ?? [],
              })
            }}
          >
            {_.customers.length ?? 0}个客户
          </div>
        )
      },
    },
    {
      title: '操作',
      key: 'customer',
      align: 'center',
      hidden: defaultActiveKey === 'searchBySchedule',
      width: 100,
      render(_) {
        return (
          <div className="flex items-center justify-center">
            <div
              className="cursor-pointer text-normal-blue text-sm"
              onClick={() => {
                searchOrderAccount(_.customerId, _.carrier)
              }}
            >
              查看账号
            </div>
            <div
              className="cursor-pointer text-normal-blue text-sm ml-[40px]"
              onClick={() => {
                onLoginAccount(_.customerId, _.carrier)
              }}
            >
              登陆账号
            </div>
          </div>
        )
      },
    },
  ]

  // 重新更新查询部分数据 并存储进redux
  const loadSearchList = () => {
    Promise.all([
      getRouteManageList(),
      getPorPortManageList(),
      getFndPortManageList(),
      getCarrierManageList({ enabled: 1 }),
      getCustomerManageList(),
    ]).then((resp) => {
      let key = [
        'routeData',
        'porPortData',
        'fndPortData',
        'carrierData',
        'customerData',
      ]
      key.map((_, index: number) => {
        dispatch(setEssentail({ value: resp[index], key: key[index] }))
      })
      getReduxData()
    })
  }

  const getReduxData = () => {
    let { routeData, porPortData, fndPortData, carrierData, customerData } =
      essential
    let resetPorData = (porPortData || []).map(
      (item: { code: string; enName: string; cnName: string }) => {
        return {
          value: item.code,
          label: item.enName + '-' + item.cnName,
        }
      }
    )
    let resetFndData = (fndPortData || []).map(
      (item: { code: string; enName: string; cnName: string }) => {
        return {
          value: item.code,
          label: item.enName + '-' + item.cnName,
        }
      }
    )

    console.log(searchColumns, 'searchColumns')
    searchColumns.map((item) => {
      if (item.name === 'porCode' || item.name === 'fndCode') {
        item.options = item.name === 'porCode' ? resetPorData : resetFndData
      }
      if (item.name === 'carrier') item.options = carrierData
      if (item.name === 'router') item.options = routeData
      if (item.name === 'customerId') item.options = customerData
    })

    setSearchColumns([...searchColumns])
    setImmediate(false)
  }

  const getTabsItem = () => {
    const items = [
      {
        label: '周一',
        key: '一',
      },
      {
        label: '周二',
        key: '二',
        children() {
          return <div className="">123</div>
        },
      },
      {
        label: '周三',
        key: '三',
      },
      {
        label: '周四',
        key: '四',
      },
      {
        label: '周五',
        key: '五',
      },
      {
        label: '周六',
        key: '六',
      },
      {
        label: '周日',
        key: '日',
      },
    ]
    return items
  }

  const changeDay = (key: string) => {
    setToday(key)
  }

  const searchOrderAccount = (customerId: string, carrier: string) => {
    getShippingAccountList({ customerId: customerId, isOrder: true }).then(
      (resp) => {
        setParams({
          visible: true,
          type: 'search',
          carrier: carrier,
          currentRow: resp,
        })
      }
    )
  }

  const onUpdateSearch = (info?: CabinTaskTemplateParams | unknown) => {
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

  const onChange = (type: string) => {
    setImmediate(true)
    setDefaultActiveKey(type)
    setSearchColumns(
      type === 'searchBySchedule'
        ? SelectScheduleAccountOptions
        : SelectAffilateAccountOptions
    )
    setTimeout(() => {
      setImmediate(false)
    }, 300)
  }

  const batchLogin = () => {
    if (!seleced.length) {
      message.error('至少选择一条记录批量登陆！')
      return
    }
    onBatchLogin(seleced)
  }

  const addCustomerOk = (currentRow: AffilateAccountType) => {
    addTodayLoginRecord(currentRow).then(() => {
      message.success('添加成功！')
      setImmediate(true)
      setAddCustomer(false)
    })
    setTimeout(() => {
      setImmediate(false)
    }, 300)
  }

  const onLoginAccount = (customerId: string, carrier?: string) => {
    console.log(customerId, 'customerId', params)
    addLoginAccount({
      customerId: customerId,
      carrier: carrier ?? params.carrier,
    })
      .then(() => {
        message.success('预登陆成功')
        setImmediate(true)
        setTimeout(() => {
          setImmediate(false)
        }, 300)
      })
      .catch(() => {
        setTimeout(() => {
          setImmediate(false)
        }, 300)
      })
  }
  const onBatchLogin = (ids: string[]) => {
    console.log(ids, 'customerId', params)
    let newArr = ids.map((item) => {
      return {
        customerId: item,
        carrier: params.carrier,
      }
    })
    addBatchLogin(newArr)
      .then(() => {
        message.success('批量登陆成功')
        setImmediate(true)
        setTimeout(() => {
          setImmediate(false)
        }, 300)
      })
      .catch(() => {
        setTimeout(() => {
          setImmediate(false)
        }, 300)
      })
  }

  const getRowKey = (record: any) => {
    return defaultActiveKey === 'searchBySchedule'
      ? record.porCode + '-' + record.fndCode
      : record.customerId
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
          <div className="w-full flex items-center justify-between">
            {getTabsItem().map((item, index) => (
              <div
                className={`font-semibold text-base cursor-pointer ${
                  new Date().getDay() === 0 || new Date().getDay() === index + 1
                    ? 'text-normal-blue'
                    : 'text-light-grey'
                }`}
                key={item.label}
                onClick={() => changeDay(item.key)}
              >
                <p className="text-center">
                  <span className="mr-[6px]">
                    {new Date().getDay() === 0 ||
                      (new Date().getDay() === index + 1 && '今日')}
                  </span>
                  {item.label}
                </p>
                <div
                  className={`w-[160px] h-[2px] mt-[8px] ${
                    new Date().getDay() === 0 ||
                    new Date().getDay() === index + 1
                      ? 'bg-normal-blue'
                      : 'bg-gray-200'
                  }`}
                ></div>
                <div></div>
              </div>
            ))}
          </div>
        </Card>
      </ConfigProvider>
      <Card
        style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
        styles={{ body: { height: '100%' } }}
        ref={parentRef}
      >
        <Tabs
          activeKey={defaultActiveKey}
          items={components}
          onChange={onChange}
        />
        <SearchForm
          columns={searchColumns}
          gutterWidth={24}
          labelPosition="left"
          iconHidden={true}
          btnSeparate={defaultActiveKey === 'searchBySchedule'}
          isShowReset={true}
          isShowExpend={false}
          onUpdateSearch={onUpdateSearch}
        />
        {defaultActiveKey === 'searchByAffilate' && (
          <Space className="">
            <Button type="primary" onClick={() => setAddCustomer(true)}>
              添加公司
            </Button>
            <Button type="primary" onClick={batchLogin}>
              批量登陆
            </Button>
          </Space>
        )}
        {!immediate && (
          <SearchTable
            style={{ marginTop: '10px' }}
            size="middle"
            pageIndexKey="page"
            pageSizeKey="limit"
            totalKey={defaultActiveKey === 'searchBySchedule' ? '' : 'count'}
            fetchResultKey={
              defaultActiveKey === 'searchBySchedule' ? 'data' : 'list'
            }
            isPagination={true}
            columns={tableColumns}
            bordered
            rowKey={getRowKey}
            scroll={{ x: 'max-content', y: height - 298 }}
            immediate={immediate}
            fetchData={
              defaultActiveKey === 'searchBySchedule'
                ? getScheduleAccountList
                : getAffilateAccountList
            }
            searchFilter={searchDefaultForm}
            isSelection={defaultActiveKey === 'searchBySchedule' ? false : true}
            onUpdatePagination={onUpdatePagination}
            onUpdateSelection={(options: string[]) => setSelected(options)}
          />
        )}
      </Card>
      <AddSearchByAffilate
        visible={addCustomer}
        onCancel={() => setAddCustomer(false)}
        onOk={addCustomerOk}
      />
      <ShippingAccountDrawer
        params={params}
        onCancel={() =>
          setParams({
            visible: false,
            type: 'search',
            carrier: '',
            currentRow: null,
          })
        }
        onLoginAccount={onLoginAccount}
        onBatchLogin={onBatchLogin}
      />
    </>
  )
}

export default TodayPlan
