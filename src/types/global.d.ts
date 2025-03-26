/**
 * 定义ajax请求的相应结果
 */
export interface Response {
  // 这里的状态码需要与后端的状态码枚举匹配
  code: number
  message: string
  data: any
  success: boolean
  token?: string
}

/**
 * 定义基础选项类型
 */
export interface BasicOptions {
  label: string
  value: string
}
