export enum PermissionSetting {
  AFA = 'AFA',
  BKG = '订舱功能',
  PBK = '预定功能',
  CAA = '绑定船公司账号权限',
  NTF = '消息订阅权限',
  CUP = '上传舱位权限',
}

export enum ComboPermission {
  REALTIME_RATE = '实时运价',
  RATE_SUBSCRIBE = '运价订阅',
  CARGO_TRACE = '箱货跟踪',
  CARRIER_SCHEDULE = '船舶计划',
  TRUCK_TRAJECTORY = '国内卡车轨迹',
  US_CLEARANCE = '美国清关放行查询',
  NA_TRUCK_RATE = '北美卡车实时运价',
  US_HTS_CODE = '美国清关HTS Code',
  CARRIER_ZONE = '船司专区',
  PORT_WIKI = '港口百科',
  HSCODE_QUERY = 'HSCODE查询',
  SMS_NOTIFY = '短信服务',
}

export enum LevelSetting {
  L0 = '普通用户',
  L1 = '新注册用户',
  L5 = '个人周卡',
  L7 = '个人年卡',
  L9 = '子账号权益会员',
  L10 = '认证企业',
  L11 = '查询会员',
  L12 = '认证买家',
  L13 = '认证卖家',
  L21 = '定制会员',
}
