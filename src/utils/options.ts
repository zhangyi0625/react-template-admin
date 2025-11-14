import { SelectProps } from 'antd';

const BaseSelectOptions: SelectProps['options'] = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
];

export function changeSelectOptionsByLabel(
  labelOptions: string[] = ['是', '否']
) {
  const newSelect = BaseSelectOptions?.map((item) => {
    if (item.value)
      return {
        label: labelOptions[0],
        value: item.value,
      };
    else
      return {
        label: labelOptions[1],
        value: item.value,
      };
  });
  return newSelect;
}

// changeSelectOptionsByLabel(['开启', '关闭']);
