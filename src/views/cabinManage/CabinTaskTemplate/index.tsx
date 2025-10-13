// import '../index.scss'
import styles from '../index.module.scss'
import { memo, useCallback, useEffect, useState } from 'react'
import {
  App,
  Button,
  Card,
  Col,
  ConfigProvider,
  Form,
  Row,
  Space,
  TablePaginationConfig,
  TableProps,
  TabsProps,
} from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { SearchForm, SearchTable } from 'customer-search-form-table'
import {
  CabinTaskTemplateStatusOptions,
  SelectCabinTaskTemplateOptions,
} from './config'
import type {
  CabinTaskTemplateParams,
  CabinTaskTemplateType,
} from '@/services/cabinManage/cabinManageModel'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, setEssentail } from '@/stores/store'
import useParentSize from '@/hooks/useParentSize'
import AddCabinTask from './AddCabinTask'
import OperationLogDrawer from './OperationLogDrawer'
import SetFrequecnyDrawer from './SetFrequecnyDrawer'
import MonitoringFrequncy from './MonitoringFrequncy'
import { getTemplateSetting } from './columns'
import {
  getCabinManageListByPage,
  addCabinManageList,
  closeBatchCabinManage,
  openBatchCabinByFrequency,
  openBatchCabinByImmdiate,
  stopBatchCabin,
  putCabinManageList,
  updateLoginAccount,
} from '@/services/cabinManage/cabinManageApi'
import { getRouteManageList } from '@/services/customerInformation/routeManage/routeManageApi'
import {
  getFndPortManageList,
  getPorPortManageList,
} from '@/services/essential/portManage/portManageModel'
import { getCustomerManageList } from '@/services/essential/customerManage/customerManageApi'
import type { RouteMangeType } from '@/services/customerInformation/routeManage/routeManageModel'
import ImportShippingAccout from '@/views/customerInformation/ShippingAccount/ImportShippingAccout'
import { filterKeys } from '@/utils/tool'

const API = process.env.VITE_STATIC_API

type CabinTaskTemplateProps = {
  carrier: string
  setting: unknown
}

const CabinTaskTemplate: React.FC<CabinTaskTemplateProps> = memo(
  ({ carrier, setting }) => {
    const { message, modal } = App.useApp()

    const { parentRef, height } = useParentSize()

    const dispatch = useDispatch()

    const [items, setItems] = useState<TabsProps['items']>([])

    const [searchColumns, setSearchColumns] = useState(
      SelectCabinTaskTemplateOptions
    )

    const essential = useSelector((state: RootState) => state.essentail)

    const [current, setCurrent] = useState<string>('NOT_STARTED')

    const [immediate, setImmediate] = useState<boolean>(false)

    const [loading, setLoading] = useState<boolean>(false)

    const [frequencyVisible, setFrequecnyVisible] = useState<{
      visible: boolean
      currentId: string | null
    }>({
      visible: false,
      currentId: null,
    })

    const [seleced, setSelected] = useState<string[]>([])

    const [operationLog, setOperationLog] = useState<{
      visible: boolean
      id: null | string
    }>({
      visible: false,
      id: null,
    })

    const [frequecnyParams, setFrequecnyParams] = useState<{
      visible: boolean
      selRow: string[]
    }>({ visible: false, selRow: [] })

    const [importModel, setImportModel] = useState<boolean>(false)

    const [searchDefaultForm, setSearchDefaultForm] =
      useState<CabinTaskTemplateParams>({
        page: 1,
        limit: 10,
        routeFndId: null,
        status: 'NOT_STARTED',
        carrier: carrier,
      })

    const [params, setParams] = useState<{
      visible: boolean
      currentRow: CabinTaskTemplateType | null
      view: boolean
    }>({
      visible: false,
      currentRow: null,
      view: false,
    })

    useEffect(() => {
      if (!carrier) return
      setImmediate(true)
      setLoading(true)
      if (
        !essential.routeData?.length ||
        !essential.porPortData?.length ||
        !essential.fndPortData?.length ||
        !essential.customerData?.length
      ) {
        loadSearchList()
      } else {
        getReduxData()
      }
    }, [carrier, essential])

    const isSelected = useCallback(() => {
      if (seleced.length === 0) {
        message.error('请至少选择一条数据！')
        return false
      } else return true
    }, [seleced.length])

    const tableColumns = useCallback(() => {
      let columns = getTemplateSetting(carrier, current)['columns'] ?? []
      let newArr: TableProps['columns'] = [
        {
          title: '任务编号',
          key: 'taskNo',
          align: 'center',
          width: 100,
          render(value) {
            return (
              <div
                className="text-blue-500 cursor-pointer underline text-sm"
                onClick={() => editTaskTemplate(value)}
              >
                {value.taskNo}
              </div>
            )
          },
        },
        ...columns.concat({
          title: '操作',
          width: '8%',
          fixed: 'right',
          align: 'center',
          render(_, record) {
            return (
              <Space>
                {/* <Button
                color="green"
                hidden={current !== 'NOT_STARTED'}
                style={{ background: '#07C160' }}
                variant="solid"
                onClick={() => openImmediate(_)}
              >
                即刻抢舱
              </Button> */}
                <Button
                  color="green"
                  hidden={current !== 'NOT_STARTED'}
                  variant="solid"
                  onClick={() =>
                    setFrequecnyVisible({ visible: true, currentId: _.id })
                  }
                  disabled={carrier !== 'MSK'}
                >
                  高频启动
                </Button>
                <Button
                  hidden={current !== 'RUNNING'}
                  color="red"
                  variant="solid"
                  onClick={() => CabinImmediately('stop', [_.id])}
                >
                  停止抢舱
                </Button>
                <Button
                  type="default"
                  onClick={() =>
                    setOperationLog({ visible: true, id: record.id })
                  }
                >
                  操作日志
                </Button>
              </Space>
            )
          },
        }),
      ]
      return newArr
    }, [getTemplateSetting, current, carrier])

    // 重新更新查询部分数据 并存储进redux
    const loadSearchList = () => {
      console.log('重新更新查询条件')
      Promise.all([
        getRouteManageList(),
        getPorPortManageList(),
        getFndPortManageList(),
        getCustomerManageList(),
      ]).then((resp) => {
        let key = ['routeData', 'porPortData', 'fndPortData', 'customerData']
        key.map((_, index: number) => {
          dispatch(setEssentail({ value: resp[index], key: key[index] }))
        })
        getReduxData()
      })
    }

    const getReduxData = () => {
      let { routeData, porPortData, fndPortData, customerData } = essential
      let newRoute = (routeData || []).map((item: RouteMangeType) => {
        return {
          key: String(item.id),
          label: item.routeName,
        }
      })
      setItems([{ label: '全航线', key: '' }].concat(newRoute))
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
      searchColumns.map((item) => {
        if (item.name === 'porCode' || item.name === 'fndCode') {
          item.options = item.name === 'porCode' ? resetPorData : resetFndData
        }
        if (item.name === 'customerId') item.options = customerData
      })
      console.log(essential, 'essentail', searchColumns)
      setSearchColumns([...searchColumns])
      setLoading(false)
      setImmediate(false)
    }

    const tabChange = (key: string) => {
      setSearchDefaultForm({ ...searchDefaultForm, routeFndId: key })
    }

    const changeStatus = (name: string) => {
      setCurrent(name)
      onUpdateSearch({ ...searchDefaultForm, status: name })
    }

    const onUpdateSearch = (info?: CabinTaskTemplateParams | unknown) => {
      const filteredObj = Object.fromEntries(
        Object.entries(info ?? {}).filter(([, value]) => !!value)
      )
      let pageInfo = filterKeys(
        searchDefaultForm,
        ['page', 'limit', 'routeFndId', 'status'],
        true
      )
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

    const downLoadFile = () => {
      let elemIF = document.createElement('iframe')
      elemIF.src = `${API}/static/file/exportBatch-template.xlsx`
      elemIF.style.display = 'none'
      document.body.appendChild(elemIF)
    }

    const addCabinTask = async (info: CabinTaskTemplateType) => {
      try {
        if (params.currentRow == null) {
          // 新增数据
          await addCabinManageList({ ...info, carrier: carrier })
        } else {
          // 编辑数据
          await putCabinManageList({ ...info, carrier: carrier })
        }
        message.success(
          !params.currentRow ? '订舱任务添加成功' : '订舱任务修改成功'
        )
        setParams({ visible: false, currentRow: null, view: false })
        onUpdateSearch(searchDefaultForm)
      } catch (error) {}
    }

    const editTaskTemplate = (row: any) => {
      if (row.status !== 'NOT_STARTED') return
      setParams({ visible: true, currentRow: row, view: false })
    }

    const CabinImmediately = async (
      type?: string,
      selectedArr?: string[],
      params?: unknown
    ) => {
      // console.log(type, 'type', seleced,setting)
      switch (type) {
        case 'close':
          await closeBatchCabinManage(selectedArr ?? seleced).then((res) => {
            res.failures && res.failures.length && showMessage(res.failures)
            !res.failures.length &&
              res.success === seleced.length &&
              message.success('操作成功！')
          })
          break
        case 'immediate':
          await openBatchCabinByImmdiate({ ids: selectedArr ?? seleced }).then(
            (res) => {
              res.failures && res.failures.length && showMessage(res.failures)
              !res.failures.length &&
                res.success === seleced.length &&
                message.success('操作成功！')
            }
          )
          break
        case 'frequency':
          await openBatchCabinByFrequency({
            ids: selectedArr ?? seleced,
            ...(params as { frequency: string }),
          }).then((res) => {
            res.failures && res.failures.length && showMessage(res.failures)
            !res.failures.length &&
              res.success === seleced.length &&
              message.success('操作成功！')
          })
          break
        case 'stop':
          await stopBatchCabin({ ids: selectedArr ?? seleced }).then((res) => {
            res.failures && res.failures.length && showMessage(res.failures)
            !res.failures.length &&
              res.success === seleced.length &&
              message.success('操作成功！')
          })
          break
      }
      setImmediate(true)
      setTimeout(() => {
        setImmediate(false)
      }, 300)
    }

    const confirmFrequecnyDrawer = (ids: string[]) => {
      openBatchCabinByFrequency({
        ids: seleced,
        sameFrequencyTaskId: ids[0],
      }).then((res) => {
        res.failures && res.failures.length && showMessage(res.failures)
        !res.failures.length &&
          res.success === seleced.length &&
          message.success('操作成功！')
        setFrequecnyParams({ visible: false, selRow: [] })
        onUpdateSearch(searchDefaultForm)
      })
    }

    const MonitoringFrequncyOk = (currentRow: { frequency: string }) => {
      CabinImmediately('frequency', [frequencyVisible.currentId as string], {
        frequency: currentRow.frequency.replace(/秒/, ''),
      })
      setTimeout(() => {
        setFrequecnyVisible({ visible: false, currentId: null })
      }, 200)
    }

    const showMessage = (failures: { index: number; failMsg: string }[]) => {
      failures && message.error('操作失败！')
    }

    const refreshLoginAccount = () => {
      modal.confirm({
        title: '重登查询账号',
        icon: <ExclamationCircleFilled />,
        content: '是否已更新船司高频查询账户！',
        onOk() {
          updateLoginAccount(carrier).then(() => {
            // 刷新表格数据
            onUpdateSearch()
          })
        },
      })
    }
    return (
      <>
        <ConfigProvider>
          <Card
            tabList={items}
            onTabChange={tabChange}
            loading={loading}
            className={styles['search-card']}
          >
            <Form labelAlign="left" colon={false}>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label="任务状态">
                    <div className="grid grid-cols-3 w-fit">
                      {CabinTaskTemplateStatusOptions.map((item) => (
                        <div
                          className={`w-[80px] h-[32px] leading-[30px] text-center rounded-[4px] mr-[8px] cursor-pointer ${
                            current === item.name
                              ? 'text-blue-500 border-1 border-blue-500'
                              : 'text-dull-grey border-1 border-slate-400'
                          }`}
                          key={item.name}
                          onClick={() => changeStatus(item.name)}
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <SearchForm
              columns={SelectCabinTaskTemplateOptions}
              gutterWidth={24}
              labelPosition="left"
              btnSeparate={false}
              iconHidden={true}
              isShowReset={true}
              isShowExpend={false}
              onUpdateSearch={onUpdateSearch}
            />
          </Card>
        </ConfigProvider>
        <Card
          loading={loading}
          style={{ flex: 1, marginTop: '8px', minHeight: 0 }}
          styles={{ body: { height: '100%' } }}
          ref={parentRef}
        >
          {current === 'NOT_STARTED' ? (
            <Space className="mb-[8px]">
              <Button
                type="primary"
                onClick={() =>
                  setParams({ visible: true, currentRow: null, view: true })
                }
              >
                创建任务
              </Button>
              <Button
                color="orange"
                variant="solid"
                onClick={() => setImportModel(true)}
              >
                导入任务
              </Button>
              <Button
                color="green"
                style={{ background: '#07C160' }}
                variant="solid"
                onClick={() => isSelected() && CabinImmediately('immediate')}
              >
                即刻抢舱
              </Button>
              <Button
                color="green"
                variant="solid"
                onClick={() =>
                  isSelected() &&
                  setFrequecnyParams({ visible: true, selRow: [] })
                }
                disabled={carrier !== 'MSK'}
              >
                设置放舱同频
              </Button>
              <Button
                color="red"
                variant="solid"
                onClick={() => isSelected() && CabinImmediately('close')}
              >
                关闭任务
              </Button>
              <div
                className="underline text-blue-500 text-sm cursor-pointer"
                onClick={downLoadFile}
              >
                下载{carrier}抢舱模版
              </div>
              <Button type="primary" onClick={refreshLoginAccount}>
                重登查询账号
              </Button>
            </Space>
          ) : current === 'RUNNING' ? (
            <Space className="mb-[8px]">
              <Button
                hidden={current !== 'RUNNING'}
                color="red"
                variant="solid"
                onClick={() => isSelected() && CabinImmediately('stop')}
              >
                批量停止
              </Button>
            </Space>
          ) : null}
          <SearchTable
            size="middle"
            columns={tableColumns()}
            totalKey="count"
            fetchResultKey="list"
            isPagination={true}
            bordered
            rowKey="id"
            scroll={{ x: 'max-content', y: height - 158 }}
            pageIndexKey="page"
            pageSizeKey="limit"
            immediate={immediate}
            fetchData={getCabinManageListByPage}
            searchFilter={searchDefaultForm}
            isSelection={true}
            onUpdatePagination={onUpdatePagination}
            onUpdateSelection={(options: string[]) => setSelected(options)}
          />
        </Card>
        <AddCabinTask
          params={params}
          carrier={carrier}
          onOk={addCabinTask}
          onCancel={() =>
            setParams({ visible: false, currentRow: null, view: false })
          }
        />
        <OperationLogDrawer
          params={operationLog}
          onCancel={() => setOperationLog({ visible: false, id: null })}
        />
        <ImportShippingAccout
          type="importCabinTask"
          title="批量导入任务"
          visible={importModel}
          onOk={() => {}}
          onCancel={() => setImportModel(false)}
        />
        <SetFrequecnyDrawer
          visible={frequecnyParams.visible}
          onCancel={() => setFrequecnyParams({ visible: false, selRow: [] })}
          onOk={confirmFrequecnyDrawer}
        />
        <MonitoringFrequncy
          visible={frequencyVisible.visible}
          onCancel={() =>
            setFrequecnyVisible({ visible: false, currentId: null })
          }
          onOk={MonitoringFrequncyOk}
        />
      </>
    )
  }
)

export default CabinTaskTemplate
