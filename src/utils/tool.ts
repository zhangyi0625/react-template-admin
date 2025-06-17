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
  if (wishName.length !== newName.length) return
  let refreshArr = []
  arr.map((obj: any) => {
    wishName.map((name: string, index: number) => {
      if (obj[name]) obj[newName[index]] = obj[name]
    })
  })
  refreshArr = JSON.parse(JSON.stringify(arr))
  return refreshArr
}
