import message from 'antd/lib/message';
import type { DefaultOptionType } from 'antd/es/select';
import type { CustomColumn } from 'customer-search-form-table/SearchForm/type';

/**
 * 拷贝对象中部分属性
 * @param source
 * @param keys
 * @param invert
 * @returns
 */
export function filterKeys(source: any, keys: string[], invert?: boolean) {
  return Object.keys(source)
    .filter((key) => (invert ? keys.includes(key) : !keys.includes(key)))
    .reduce((res: any, key) => {
      res[key] = source[key];
      return res;
    }, {});
}

/**
 * 根据原有的属性名代替新属性名 根据index匹配 两者长度必须匹配
 * @param arr
 * @param wishName
 * @param newName
 * @returns
 */
export function replaceObjectName(
  arr: any,
  wishName: string[],
  newName: string[]
) {
  if (wishName.length !== newName.length || !arr.length) return;
  let refreshArr = [];
  arr.map((obj: any) => {
    wishName.map((name: string, index: number) => {
      // if (obj[name]) obj[newName[index]] = obj[name]
      if (obj[name]) Reflect.set(obj, newName[index], obj[name]);
    });
  });
  refreshArr = JSON.parse(JSON.stringify(arr));
  return refreshArr;
}

interface BuildTreeType {
  label: string;
  value: string;
  children: BuildTreeType[];
}

/**
 * 使用哈希表来存储节点关系 遍历构建树形结构
 * @param data
 * @returns
 */
export function buildTree(data: any | BuildTreeType[], mapId: string) {
  const map = new Map();
  const tree: BuildTreeType[] = [];
  // 将数组元素存入哈希表
  data.forEach((item: any) => {
    map.set(item[mapId], { ...item, children: [] });
  });
  data.forEach((item: any) => {
    if (item.parentId === '0' || !item.parentId)
      tree.push(map.get(item[mapId]));
    else {
      const parent = map.get(item.parentId);
      parent && parent.children.push(map.get(item[mapId]));
    }
  });
  return tree;
}

/**
 * 复制copy
 * @param elementId
 */
export function copyValue(elementId: string) {
  // 需要复制文字的节点
  const copyDOM = document.getElementById(elementId);
  const range = document.createRange(); // 创建一个range
  window.getSelection()?.removeAllRanges(); // 清楚页面中已有的selection
  range.selectNode(copyDOM as HTMLElement); // 选中需要复制的节点
  window.getSelection()?.addRange(range); // 执行选中元素
  const successful = document.execCommand('copy'); // 执行 copy 操作
  if (successful) {
    message.success('复制成功！');
  } else {
    message.warning('复制失败，请手动复制！');
  }
  // 移除选中的元素
  window.getSelection()?.removeAllRanges();
}

/**
 * 系统参数 数据结构调整
 * @param key
 * @param publicSetting
 * @returns
 */
export function getPublicSettingByKey(
  key: string,
  publicSetting: { [key: string]: string } = {}
) {
  if (!publicSetting || !publicSetting[key]) return;
  const maps = publicSetting[key] as unknown as { [key: string]: string };
  const newArr = Object.keys(maps).map((item) => {
    return {
      label: maps[item],
      value: item,
    };
  });
  return newArr;
}

/**
 * 解决JSON.parse抛出异常
 * @param text
 * @param options
 */
export function safeJsonParse(
  text: string,
  options?: {
    errorMessage?: string;
    errorCallback?: (error: Error) => void;
  }
) {
  const { errorMessage = '', errorCallback } = options || {};
  if (typeof text !== 'string') {
    return errorMessage;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    errorCallback?.(error as Error);
    return errorMessage;
  }
}

/**
 * 自定义antd-select搜索
 * @param input 搜索内容
 * @param fieldNames select fieldNames 定义节点
 * @param option options
 * @returns
 */
export function searchSelectFilterOption(
  input: string,
  fieldNames: CustomColumn['selectFileldName'],
  option: DefaultOptionType | undefined
) {
  const key = fieldNames
    ? (fieldNames['label'] as keyof DefaultOptionType)
    : ('label' as keyof DefaultOptionType);
  return String(option?.[key] ?? '')
    .toLowerCase()
    .includes(input.toLowerCase());
}
