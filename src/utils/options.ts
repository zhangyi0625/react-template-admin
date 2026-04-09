import type { SelectProps } from 'antd';

const defaultSelectOptions: SelectProps['options'] = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 0,
  },
];

/**
 * 改变select选项的label
 * @param labelOptions 标签数组
 * @returns 新的select选项
 */

export function changeSelectOptionsByLabel(
  labelOptions: string[] = ['是', '否'],
): SelectProps['options'] {
  const newSelect = defaultSelectOptions?.map((item) => {
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
