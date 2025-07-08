import type React from 'react'
import { useEffect, useState } from 'react'
import { App, Button, Card, ConfigProvider, Space, type TableProps } from 'antd'
import {
  addDictionaryById,
  deleteDictionaryById,
  getDictionaryList,
  updateDictionaryById,
  batchDeleteDictionaryById,
  getDictionaryListById,
} from '@/services/system/dictionary/dictionaryApi'
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
} from '@ant-design/icons'
import {
  SysDictionaryParams,
  SysDictionaryType,
} from '@/services/system/dictionary/dictionaryModel'
import SearchForm, { CustomColumn } from '@/components/searchForm'
import DictonaryModal from './DictonaryModal'
import SearchTable from '@/components/searchTable'

const Dictionary: React.FC = () => {
  const { modal } = App.useApp()

  const [dictionaryClass, setDictionaryClass] = useState<
    { id: string; name: string }[]
  >([])

  const [searchDefaultForm, setSearchDefaultForm] = useState<
    Partial<SysDictionaryParams>
  >({
    id: null,
  })

  // 将当前编辑行和窗口开关合并为一个状态对象
  const [params, setParams] = useState<{
    visible: boolean
    currentRow: SysDictionaryType | null
    view: boolean
  }>({
    visible: false,
    currentRow: null,
    view: false,
  })

  const [selRows, setSelectedRows] = useState<any[]>([])

  const [immediate, setImmediate] = useState<boolean>(true)

  useEffect(() => {
    getDicOptions()
  }, [])

  const getDicOptions = async () => {
    setImmediate(true)
    let res = await getDictionaryList()
    let newArr = res.map((item: any) => {
      return {
        id: item.id,
        name: item.dictName,
      }
    })
    setDictionaryClass(newArr)
    newArr.length && setSearchDefaultForm({ id: newArr[0]?.id })
    setTimeout(() => {
      setImmediate(false)
    }, 300)
  }

  const columns: TableProps['columns'] = [
    {
      title: '字典项名称',
      dataIndex: 'dictName',
      key: 'dictName',
      align: 'center',
    },
    {
      title: '背景色',
      dataIndex: 'dictCode',
      key: 'dictCode',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
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
                setParams({
                  visible: true,
                  currentRow: record as SysDictionaryType,
                  view: true,
                })
              }}
            >
              修改
            </Button>
            <Button
              type="link"
              danger
              size="small"
              onClick={() => deleteDic(record.id)}
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  const SelectDictionaryOptions: CustomColumn[] = [
    {
      label: '标签分类',
      name: 'id',
      formType: 'select',
      options: dictionaryClass,
      defaultValue: searchDefaultForm?.id,
      span: 6,
    },
    {
      label: '搜索关键字',
      name: 'dictName',
      formType: 'input',
      span: 6,
    },
  ]

  const deleteDic = (id: string[] | string, type?: string) => {
    // 删除操作需要二次确定
    modal.confirm({
      title: `${type ? '批量' : ''}删除字典分类`,
      icon: <ExclamationCircleFilled />,
      content: `确定${
        type ? '批量' : ''
      }删除字典分类吗？数据删除后将无法恢复！`,
      onOk() {
        // 调用删除接口，删除成功后刷新页面数据
        ;(type
          ? batchDeleteDictionaryById({ ids: id as string[] })
          : deleteDictionaryById(id as string)
        ).then(() => {
          // 刷新表格数据
          onUpdateSearch()
          // 清空选择项
          setSelectedRows([])
        })
      },
    })
  }

  const onAddDicClick = () => {
    setParams({ visible: true, currentRow: null, view: false })
  }

  const onEditOk = async (roleData: SysDictionaryType) => {
    try {
      if (params.currentRow == null) {
        // 新增数据
        await addDictionaryById(roleData)
      } else {
        // 编辑数据
        await updateDictionaryById(roleData)
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

  const onUpdateSearch = (info?: SysDictionaryParams | unknown) => {
    const filteredObj = Object.fromEntries(
      Object.entries(info ?? {}).filter(([, value]) => !!value)
    )
    setSearchDefaultForm({
      ...filteredObj,
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
          {!immediate && (
            <SearchForm
              columns={SelectDictionaryOptions}
              gutterWidth={24}
              labelPosition="left"
              btnSeparate={false}
              isShowReset={true}
              isShowExpend={false}
              onUpdateSearch={onUpdateSearch}
            />
          )}
        </Card>
        {/* 查询表格 */}
        <Card
          style={{ flex: 1, marginTop: '8px' }}
          styles={{ body: { height: '100%' } }}
        >
          {/* 操作按钮 */}
          <Space className="mb-[20px]">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddDicClick}
            >
              新增
            </Button>
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              disabled={selRows.length === 0}
              onClick={() => deleteDic(selRows)}
            >
              批量删除
            </Button>
          </Space>
          <SearchTable
            size="small"
            columns={columns}
            bordered
            rowKey="id"
            fetchData={getDictionaryListById}
            searchFilter={searchDefaultForm}
            isSelection={true}
            isPagination={false}
            immediate={immediate}
            onUpdatePagination={() => {
              return
            }}
            onUpdateSelection={(options: string[]) => setSelectedRows(options)}
          />
        </Card>
      </ConfigProvider>
      <DictonaryModal
        params={params}
        onOk={onEditOk}
        onCancel={() =>
          setParams({ visible: false, currentRow: null, view: false })
        }
      />
    </>
  )
}

export default Dictionary
