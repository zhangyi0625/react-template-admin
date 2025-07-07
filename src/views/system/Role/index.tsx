import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  MoreOutlined,
  PlusOutlined,
  RedoOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import useParentSize from '@/hooks/useParentSize'
import {
  App,
  Button,
  Card,
  Col,
  ConfigProvider,
  Dropdown,
  Form,
  Input,
  type MenuProps,
  Row,
  Select,
  Space,
  Table,
  Tag,
  type TableProps,
  TablePaginationConfig,
} from 'antd'
import type React from 'react'
import { useEffect, useState } from 'react'
import {
  addRole,
  deleteRole,
  editRole,
  getRoleList,
} from '@/services/system/role/roleApi'
import SearchForm from '@/components/searchForm'
import SearchTable from '@/components/searchTable'
import { SelectRoleOptions } from './config'
import RoleInfoModal from './RoleInfoModal'
import RoleMenuDrawer from './RoleMenuDrawer'
import RoleUserDrawer from './RoleUserDrawer'
import { SysRoleParams, SysRoleType } from '@/services/system/role/roleModel'

/**
 * 系统角色维护
 * @returns
 */
const Role: React.FC = () => {
  const { modal } = App.useApp()
  // 检索表单
  // const [form] = Form.useForm()
  // 容器高度计算（表格）
  const { parentRef, height } = useParentSize()

  // 表格数据
  const [tableData, setTableData] = useState<any[]>([])
  // 表格加载状态
  const [loading, setLoading] = useState<boolean>(false)
  // 当前选中的行数据
  const [selRows, setSelectedRows] = useState<any[]>([])

  // const [selected, setSelected] = useState<string[]>([])

  // 将当前编辑行和窗口开关合并为一个状态对象
  const [params, setParams] = useState<{
    visible: boolean
    currentRow: any
    view: boolean
  }>({
    visible: false,
    currentRow: null,
    view: false,
  })

  const [searchDefaultForm, setSearchDefaultForm] = useState<SysRoleParams>({
    page: 1,
    size: 10,
  })

  // 抽屉窗口打开关闭
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  // 角色用户分配抽屉
  const [drawerOpenUser, setDrawerOpenUser] = useState<boolean>(false)

  useEffect(() => {
    // 查询角色数据
    // queryRoleData()
  }, [])

  // 更多操作中的选项
  const more: (row: any) => MenuProps['items'] = (row) => [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined className="text-orange-400" />,
      onClick: () => {
        // 编辑选中的行数据
        setParams({ visible: true, currentRow: row, view: false })
      },
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined className="text-red-400" />,
      onClick: () => {
        // 删除选中的行数据
        modal.confirm({
          title: '删除角色',
          icon: <ExclamationCircleFilled />,
          content: '确定删除该角色吗？数据删除后将无法恢复！',
          onOk() {
            deleteRole(row.id).then(() => {
              // 刷新表格数据
              onUpdateSearch()
            })
          },
        })
      },
    },
  ]

  // 表格的列配置
  const columns: TableProps['columns'] = [
    {
      title: '角色名称',
      width: 160,
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
    {
      title: '备注',
      width: 160,
      dataIndex: 'comments',
      key: 'comments',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
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
              onClick={() => {
                setParams({ visible: true, currentRow: record, view: true })
              }}
            >
              详情
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setParams({ visible: false, currentRow: record, view: false })
                setDrawerOpenUser(true)
              }}
            >
              用户
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setParams({ visible: false, currentRow: record, view: false })
                setDrawerOpen(true)
              }}
            >
              授权菜单
            </Button>
            <Dropdown
              menu={{ items: more(record) }}
              placement="bottom"
              trigger={['click']}
            >
              <Button type="link" size="small" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        )
      },
    },
  ]

  const onUpdateSearch = (info?: SysRoleParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    setSearchDefaultForm({
      ...searchDefaultForm,
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

  /**
   * 新增角色
   */
  const onAddRoleClick = () => {
    setParams({ visible: true, currentRow: null, view: false })
  }

  /**
   * 取消
   */
  const onCancel = () => {
    setParams({ visible: false, currentRow: null, view: false })
  }

  /**
   * 隐藏抽屉
   */
  const hideDrawer = () => {
    setDrawerOpen(false)
    setDrawerOpenUser(false)
  }

  /**
   * 点击确定的回调
   * @param roleData 角色数据
   */
  const onEditOk = async (roleData: SysRoleType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addRole(roleData)
      } else {
        // 编辑数据
        await editRole(roleData)
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
            columns={SelectRoleOptions}
            gutterWidth={24}
            labelPosition="left"
            btnSeparate={false}
            isShowReset={true}
            isShowExpend={false}
            onUpdateSearch={onUpdateSearch}
          />
        </Card>
        {/* 查询表格 */}
        <Card
          style={{ flex: 1, marginTop: '8px' }}
          styles={{ body: { height: '100%' } }}
          ref={parentRef}
        >
          {/* 操作按钮 */}
          <Space className="mb-[20px]">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddRoleClick}
            >
              新增
            </Button>
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              disabled={selRows.length === 0}
            >
              批量删除
            </Button>
          </Space>
          {/* 表格数据 */}
          {/* <Table
            size="small"
            onRow={onRow}
            style={{ marginTop: '8px' }}
            bordered
            pagination={false}
            dataSource={tableData}
            columns={columns}
            loading={loading}
            rowKey="id"
            scroll={{ x: 'max-content', y: height - 128 }}
            rowSelection={{ ...rowSelection }}
          /> */}
          <SearchTable
            columns={columns}
            bordered
            rowKey="id"
            fetchData={getRoleList}
            searchFilter={searchDefaultForm}
            isSelection={true}
            onUpdatePagination={onUpdatePagination}
            onUpdateSelection={(options: string[]) => setSelectedRows(options)}
          />
        </Card>
      </ConfigProvider>

      {/* 编辑弹窗 */}
      <RoleInfoModal params={params} onCancel={onCancel} onOk={onEditOk} />
      {/* 权限分配抽屉 */}
      <RoleMenuDrawer
        roleId={params.currentRow?.id}
        onOk={hideDrawer}
        open={drawerOpen}
        onCancel={hideDrawer}
      />
      {/* 用户分配抽屉 */}
      <RoleUserDrawer
        roleId={params.currentRow?.id}
        onCancel={hideDrawer}
        open={drawerOpenUser}
      />
    </>
  )
}
export default Role
