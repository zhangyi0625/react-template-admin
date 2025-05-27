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
  const { label, name, formType, api, tag, options } = props

  const { RangePicker } = DatePicker

  const [defalueOptions, setDefaultOptions] =
    useState<SelectProps['options']>(options)

  const handleSearch = (
    newVal: string,
    type: string,
    API: any,
    tag: string | undefined
  ) => {
    console.log(newVal, 'handleSearch')
    fetchSearch({ value: newVal, name: type, api: API, tag }, setDefaultOptions)
  }

  const selectFoucs = (name: string, API: any, tag: string | undefined) => {
    if (name === 'porCode' || name === 'fndCode') {
      console.log('zzzz', name, API)
      fetchSearch({ value: null, name: name, api: API, tag }, setDefaultOptions)
    } else setDefaultOptions(options)
  }

  const selectOptions = () => {
    return (defalueOptions || []).map((item) =>
      name === 'porCode' || name === 'fndCode'
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
            value: item.unlocode,
          }
        : {
            value: item.id,
            label: item.name,
          }
    )
  }

  return (
    <div className={'search-form-item'}>
      <Form.Item label={label} name={name}>
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
            popupMatchSelectWidth={
              name === 'porCode' || name === 'fndCode' ? 240 : true
            }
            classNames={{
              popup: {
                root:
                  name === 'porCode' || name === 'fndCode' ? 'portSelect' : '',
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
