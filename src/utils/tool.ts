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
      res[key] = source[key]
      return res
    }, {})
}
