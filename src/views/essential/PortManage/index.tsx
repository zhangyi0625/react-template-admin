import { useState } from 'react'
import {
  App,
  Button,
  Card,
  ConfigProvider,
  Space,
  Switch,
  TablePaginationConfig,
  TableProps,
  Tag,
} from 'antd'
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import AddPortManage from './AddPortManage'
import {
  addPortManage,
  deletePortManage,
  getAllPortManageList,
  updatePortManageStatus,
} from '@/services/essential/portManage/portManageModel'
import type {
  PortManageParams,
  PortManageType,
} from '@/services/essential/portManage/portManageApi'
import { SelectPortManageOptions } from './config'
import { filterKeys } from '@/utils/tool'

const RouteManage: React.FC = () => {
  const { modal, message } = App.useApp()

  const [searchDefaultForm, setSearchDefaultForm] = useState<PortManageParams>({
    page: 1,
    size: 10,
  })

  const [params, setParams] = useState<{
    visible: boolean
    currentRow: any
    view: boolean
  }>({
    visible: false,
    currentRow: null,
    view: false,
  })

  const columns: TableProps['columns'] = [
    {
      title: '港口编码',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      align: 'center',
    },
    {
      title: '热门港口',
      key: 'isPopularity',
      align: 'center',
      width: 100,
      render(value) {
        return <div>{value.isPopularity ? '热门' : ''}</div>
      },
    },
    {
      title: '港口中文名',
      dataIndex: 'cnName',
      key: 'cnName',
      width: 150,
      align: 'center',
    },
    {
      title: '港口英文名',
      dataIndex: 'enName',
      key: 'enName',
      width: 150,
      align: 'center',
    },
    {
      title: '一级航线',
      dataIndex: 'parentRouteName',
      key: 'parentRouteName',
      width: 150,
      align: 'center',
    },
    {
      title: '二级航线',
      dataIndex: 'routeName',
      width: 100,
      key: 'routeName',
      align: 'center',
    },
    {
      title: '所属国家',
      dataIndex: 'countryName',
      key: 'countryName',
      width: 100,
      align: 'center',
    },
    {
      title: '标签',
      width: 100,
      align: 'center',
      render(value) {
        return (
          <Space>
            <Tag
              style={value.isPor !== 1 ? { display: 'none' } : {}}
              color="blue"
            >
              起运港
            </Tag>
            <Tag
              style={value.isFnd !== 1 ? { display: 'none' } : {}}
              color="green"
            >
              目的港
            </Tag>
          </Space>
        )
      },
    },
    {
      title: '状态',
      key: 'enabled',
      align: 'center',
      render(value) {
        return (
          <Switch
            value={value.enabled}
            onChange={(e) => statusChange(e, value.id)}
          />
        )
      },
    },
    {
      title: '修改人',
      dataIndex: 'modifier',
      key: 'modifier',
      align: 'center',
    },
    {
      title: '修改时间',
      dataIndex: 'modified',
      key: 'modified',
      width: 200,
      align: 'center',
    },
    {
      title: '操作',
      width: '10%',
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

  const statusChange = (e: boolean, id: string) => {
    updatePortManageStatus({ id: id, enabled: Number(e) }).then(() => {
      message.success('修改成功')
      onUpdateSearch(searchDefaultForm)
    })
  }

  const deleteBatch = (id: string) => {
    modal.confirm({
      title: '删除港口',
      icon: <ExclamationCircleFilled />,
      content: '确定删除该港口吗？数据删除后将无法恢复！',
      onOk() {
        deletePortManage(id).then(() => {
          message.success('删除成功')
          // 刷新表格数据
          onUpdateSearch()
        })
      },
    })
  }

  const onEditOk = async (customerRow: PortManageType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addPortManage(customerRow)
      } else {
        // 编辑数据
        await addPortManage(customerRow)
      }
      // 操作成功，关闭弹窗，刷新数据
      message.success('保存成功')
      setParams({ visible: false, currentRow: null, view: false })
      onUpdateSearch()
    } catch (error) {}
  }

  const onUpdateSearch = (info?: PortManageParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    let pageInfo = filterKeys(searchDefaultForm, ['page', 'size'], true)
    // 港口标签isPor、isFnd多字段重新匹配接口
    let isPor =
      Object.keys(filteredObj).length > 0
        ? {
            ...filterKeys(filteredObj, ['tag'], false),
            isPor:
              filteredObj.tag === 'isPor'
                ? Number(filteredObj.tag === 'isPor')
                : null,
            iisFnd:
              filteredObj.tag === 'isFnd'
                ? Number(filteredObj.tag === 'isFnd')
                : null,
          }
        : {}
    setSearchDefaultForm({
      ...(isPor ? pageInfo : searchDefaultForm),
      ...isPor,
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
            columns={SelectPortManageOptions}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={true}
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
              新增港口
            </Button>
          </Space>
          <SearchTable
            size="large"
            columns={columns}
            bordered
            rowKey="id"
            fetchData={getAllPortManageList}
            searchFilter={searchDefaultForm}
            isSelection={false}
            onUpdatePagination={onUpdatePagination}
          />
        </Card>
      </ConfigProvider>
      <AddPortManage
        params={params}
        onOk={onEditOk}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, view: false })
        }
      />
    </>
  )
}

export default RouteManage
