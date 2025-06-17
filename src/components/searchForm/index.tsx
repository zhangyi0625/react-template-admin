import style from './index.module.scss'
import { memo, useEffect, useState } from 'react'
import { Button, Col, Form, Row, Space } from 'antd'
import { SelectProps } from 'antd'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import SearchFormItem from './searchFormItem'
import { RedoOutlined, SearchOutlined } from '@ant-design/icons'
import { filterKeys, replaceObjectName } from '@/utils/tool'
import { formatTime } from '@/utils/format'

export interface CustomColumn {
  label: string
  name: string
  api?: any
  formType: string
  options?: SelectProps['options']
  publicSettingKey?: string
  span: number
  tag?: string | undefined | 'POR' | 'FND'
  filterSearch?: boolean
}

type SearchFormPorps = {
  gutterWidth: number
  // showRow?: number
  columns: CustomColumn[]
  byHeight: boolean
  btnSeparate: boolean
  labelPosition: any
  onUpdateSearch: (filter?: unknown) => void
}

type ExtendSelectType = {
  id: string
  name: string
  [key: string | number]: string
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const SearchForm: React.FC<SearchFormPorps> = memo((props) => {
  const {
    gutterWidth,
    columns,
    byHeight,
    labelPosition,
    btnSeparate,
    onUpdateSearch,
  } = props

  const [searchForm] = Form.useForm()

  const publicData = useSelector(
    (state: RootState) => state.publicSetting.publicData
  )

  const [isExpend, setIsExpend] = useState<boolean>(false)

  const onFinish = (value: unknown) => {
    onUpdateSearch(value)
  }

  const [searchColumns, setSerachColumns] = useState<CustomColumn[]>(columns)

  useEffect(() => {
    const getData = async (api?: any) => {
      let result = await replaceObjectName(
        await api(),
        ['carrierCode', 'carrierCode'],
        ['id', 'name']
      )
      return result
    }
    searchColumns.map(async (item: CustomColumn) => {
      if (item.filterSearch) item.options = await getData(item.api)
      if (item.publicSettingKey)
        item.options = extendsOptions(publicData[item.publicSettingKey])
      console.log(item, 'item')
    })
    setTimeout(() => {
      setSerachColumns([...searchColumns])
    }, 500)
  }, [...searchColumns])

  const extendsOptions = (options: Record<string, any>) => {
    let arr = []
    for (let i in options) {
      arr.push({
        id: i,
        name: options[i],
      })
    }
    return arr
  }

  const onSearch = () => {
    let date = searchForm.getFieldsValue()['date-picker'] ?? []
    let params = {
      ...filterKeys(searchForm.getFieldsValue(), ['date-picker'], false),
      createdStart: formatTime(date[0], 'Y-M-D h:m:s'),
      createdEnd: formatTime(date[1], 'Y-M-D h:m:s'),
    }
    onUpdateSearch(params)
  }

  const onReset = () => {
    searchForm.resetFields()
    onSearch()
  }

  return (
    <div className={style['search-form']}>
      <Form
        onFinish={onFinish}
        {...formItemLayout}
        colon={false}
        labelAlign={labelPosition}
        form={searchForm}
      >
        <Row
          gutter={gutterWidth}
          className={
            byHeight && !isExpend ? 'no-show gap-y-[10px]' : 'gap-y-[10px]'
          }
        >
          {columns.map((item, index) => (
            <Col key={index} span={item.span}>
              <SearchFormItem
                label={item.label}
                name={item.name}
                api={item.api}
                options={item.options}
                formType={item.formType}
                span={item.span}
                tag={item.tag}
                publicSettingKey={item.publicSettingKey}
              />
            </Col>
          ))}
          {!btnSeparate ? (
            <Col>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  搜索
                </Button>
                <Button
                  type="default"
                  icon={<RedoOutlined />}
                  onClick={onReset}
                >
                  重置
                </Button>
              </Space>
            </Col>
          ) : null}
        </Row>
      </Form>
      {btnSeparate ? (
        <div className="flex justify-end mt-[10px]">
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              onClick={onSearch}
              icon={<SearchOutlined />}
            >
              搜索
            </Button>
            <Button type="default" icon={<RedoOutlined />} onClick={onReset}>
              重置
            </Button>
          </Space>
        </div>
      ) : null}
    </div>
  )
})

export default SearchForm
