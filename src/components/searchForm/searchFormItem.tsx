import { memo, useState } from 'react'
import { Form, Select, Input, DatePicker } from 'antd'
import { CustomColumn } from '.'
import { debounce } from 'lodash-es'
import { SelectProps } from 'antd/lib'

type fetchValueType = Pick<CustomColumn, 'name' | 'api' | 'tag'> & {
  value: string | null
}

const fetchSearch = debounce(
  (value: fetchValueType, callback: (data: any) => void) => {
    value.api({ keyword: value.value, tag: value.tag }).then((res: any) => {
      callback(res)
    })
  },
  300
)

const SearchFormItem: React.FC<CustomColumn> = memo((props) => {
  const { label, name, formType, api, tag, options, isRules } = props

  const { RangePicker } = DatePicker

  const portNameOptions = ['porCode', 'fndCode', 'porId', 'fndId']

  const [defalueOptions, setDefaultOptions] =
    useState<SelectProps['options']>(options)

  const handleSearch = (
    newVal: string,
    type: string,
    API: any,
    tag: string | undefined
  ) => {
    fetchSearch({ value: newVal, name: type, api: API, tag }, setDefaultOptions)
  }

  const selectFoucs = (name: string, API: any, tag: string | undefined) => {
    if (portNameOptions.includes(name)) {
      fetchSearch({ value: null, name: name, api: API, tag }, setDefaultOptions)
    } else setDefaultOptions(options)
  }

  const selectOptions = () => {
    return (defalueOptions || []).map((item) =>
      portNameOptions.includes(name)
        ? {
            label: (
              <div className="">
                <p>
                  {item.localName} - {item.name}
                </p>
                <p>
                  {item.countryLocalName} - {item.countryName}
                </p>
              </div>
            ),
            value:
              name === 'porCode' || name === 'fndCode'
                ? item.unlocode
                : item.id,
          }
        : {
            value: item.id,
            label: item.name,
          }
    )
  }

  return (
    <div className={'search-form-item'}>
      <Form.Item
        label={label}
        name={name}
        rules={
          isRules
            ? [
                {
                  required: true,
                  message: `请${
                    formType === 'input' ? '输入' : '选择'
                  }${label}`,
                },
              ]
            : undefined
        }
      >
        {formType === 'input' && (
          <Input
            autoFocus={false}
            allowClear
            autoComplete="off"
            placeholder={`请输入${label}`}
          />
        )}
        {formType === 'select' && (
          <Select
            allowClear
            placeholder={`请输入${label}`}
            showSearch
            defaultActiveFirstOption={false}
            filterOption={false}
            onSearch={(value: string) => handleSearch(value, name, api, tag)}
            onFocus={() => selectFoucs(name, api, tag)}
            popupMatchSelectWidth={portNameOptions.includes(name) ? 240 : true}
            classNames={{
              popup: {
                root: portNameOptions.includes(name) ? 'portSelect' : '',
              },
            }}
            options={selectOptions()}
          />
        )}
        {formType === 'date-picker' && (
          <RangePicker format={'YY-MM-DD HH:mm:ss'} />
        )}
      </Form.Item>
    </div>
  )
})

export default SearchFormItem
