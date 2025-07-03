import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Col, Form, Image, Input, Row } from 'antd'
import logo from '@/assets/images/icon-512.png'
import {
  LockOutlined,
  SecurityScanOutlined,
  UserOutlined,
} from '@ant-design/icons'
import styles from './login.module.scss'
import filing from '@/assets/images/filing.png'
import { useNavigate } from 'react-router-dom'
import { getCaptcha, login } from '@/services/login/loginApi'
import {
  getAllMenus,
  getMenuListByRoleId,
} from '@/services/system/menu/menuApi'
import { useDispatch } from 'react-redux'
import { setMenus } from '@/stores/store'
import { HttpCodeEnum } from '@/enums/httpEnum'
import { antdUtils } from '@/utils/antdUtil'
import { useGeeTest } from 'react-geetest-v4'

/**
 * 登录模块
 * @returns 组件内容
 */
const Login: React.FC = () => {
  const [form] = Form.useForm()
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false)
  // 验证码（后续更改从后端获取）
  const [code, setCode] = useState<string>('')
  // 验证码的校验key，获取验证码的时候返回，用于验证码的校验
  const [checkKey, setCheckKey] = useState<string>('')

  const { captcha, state } = useGeeTest('06e2fb115b4ac9a17fa2031361e52ba9', {
    product: 'bind',
    protocol: 'https://',
    // containerId: 'geetest-captcha',
  })
  const [CAPTCHA, setCAPTCHA] = useState<any>()
  // 页面挂载请求后端获取验证码
  useEffect(() => {
    // getCode()
    // getCode()
    // getAuth()
    // ;(window as any).initGeetest4(
    //   {
    //     captchaId: '06e2fb115b4ac9a17fa2031361e52ba9',
    //     product: 'bind',
    //   },
    //   function (captcha: any) {
    //     console.log(captcha, 'captcha')
    //   }
    // )
    // 登录成功根据角色获取菜单
    // const menu: any = getMenuListByRoleId({ roleId: 'admin' })
    // const sss = getAllMenus({})
    // let homePath = ''
    // dispatch(setMenus(menu))
    // // 判断是否配置了默认跳转的首页地址
    // if (!homePath) {
    //   // 获取第一个是路由的地址
    //   const firstRoute = menu.find((item: any) => item.route === '1')
    //   if (firstRoute) {
    //     homePath = firstRoute.path
    //   }
    // }
    // // 跳转到首页
    // navigate(homePath)
    // antdUtils.notification?.success({
    //   message: '登录成功',
    //   description: '欢迎来到Fusion Admin!',
    // })
    if (CAPTCHA) loginSelf()
  }, [CAPTCHA])

  // 极验
  // const CAPTCHA: any = ref(null)
  const getAuth = () => {
    ;(window as any).initGeetest4(
      {
        captchaId: '06e2fb115b4ac9a17fa2031361e52ba9',
        product: 'bind',
      },
      function (captcha: any) {
        captcha.onSuccess(function () {
          var result = captcha.getValidate()
          captcha.successFn(
            result['lot_number'] +
              '|' +
              result['captcha_output'] +
              '|' +
              result['pass_token'] +
              '|' +
              result['gen_time']
          )
        })
        // CAPTCHA.value = captcha
        console.log(captcha, 'captcha')
        setCAPTCHA(captcha)
      }
    )
  }

  const validateCaptcha = (values: any) => {
    CAPTCHA.successFn = checkCodeIdentity
    CAPTCHA.showCaptcha()
  }

  const checkCodeIdentity = (captchaAnswer?: any) => {
    let values: any = form.getFieldsValue()
    sessionStorage.setItem('pickToken', captchaAnswer)
    setTimeout(async () => {
      try {
        // const { code, data, message } = await login(values);
        const { token } = await login(values)
        if (token) {
          sessionStorage.setItem('token', token)
          // 登录成功根据角色获取菜单
          const menu = [
            {
              id: '11231',
              name: 'sys-home',
              path: '/home',
              component: 'Home',
              route: '1',
              meta: {
                keepAlive: false,
                icon: 'HomeOutlined',
                title: '首页',
                internal: false,
              },
              children: [],
            },
            {
              id: '11232',
              name: 'sys-data',
              path: '/statics',
              component: '',
              route: '1',
              meta: {
                keepAlive: false,
                icon: 'LineChartOutlined',
                title: '数据统计',
                internal: false,
              },
              children: [
                {
                  id: '11234',
                  name: 'sys-message',
                  path: '/statics/messageSearch',
                  component: 'statics/MessageSearch',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'FileSearchOutlined',
                    title: '消息检索',
                    internal: false,
                  },
                },
                {
                  id: '11235',
                  name: 'sys-error',
                  path: '/statics/errorStatics',
                  component: 'statics/ErrorStatics',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'CloseCircleOutlined',
                    title: '错误统计',
                    internal: false,
                  },
                },
                {
                  id: '11236',
                  name: 'sys-terminal',
                  path: '/statics/terminal',
                  component: 'statics/Terminal',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'MonitorOutlined',
                    title: '终端监控',
                    internal: false,
                  },
                },
                {
                  id: '11235',
                  name: 'sys-test',
                  path: '/statics/testMessage',
                  component: 'statics/TestMessage',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'MessageOutlined',
                    title: '测试消息',
                    internal: false,
                  },
                },
              ],
            },
            {
              id: '11236',
              name: 'sys-project',
              path: '/project',
              component: '',
              route: '1',
              meta: {
                keepAlive: false,
                icon: 'ClusterOutlined',
                title: '项目管理',
                internal: false,
              },
              children: [
                {
                  id: '21236',
                  name: 'sys-project',
                  path: '/project/endpointType',
                  component: 'project/EndpointType',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'ShareAltOutlined',
                    title: '端点类型配置',
                    internal: false,
                  },
                },
                {
                  id: '11236',
                  name: 'sys-project',
                  path: '/project/endpoint',
                  component: 'project/Endpoint',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'ApiOutlined',
                    title: '端点维护',
                    internal: false,
                  },
                },
                {
                  id: '11335',
                  name: 'sys-project',
                  path: '/project/design',
                  component: 'project/Project',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'ContainerOutlined',
                    title: '项目设计',
                    internal: false,
                  },
                  // 子路由（不在左侧菜单栏显示出来）
                  childrenRoute: [
                    {
                      id: '16335',
                      name: 'sys-project-design',
                      path: '/project/designer',
                      component: 'project/Designer',
                      route: '1',
                      meta: {
                        keepAlive: false,
                        icon: 'ContainerOutlined',
                        title: '流程设计',
                        internal: false,
                        menuType: 0,
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: '11237',
              name: 'sys-resources',
              path: '/resources',
              component: '',
              route: '1',
              meta: {
                keepAlive: false,
                icon: 'DeploymentUnitOutlined',
                title: '资源管理',
                internal: false,
              },
              children: [
                {
                  id: '11238',
                  name: 'sys-resources',
                  path: '/resources/database',
                  component: 'resources/Database',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'DatabaseOutlined',
                    title: '数据库资源',
                    internal: false,
                  },
                },
                {
                  id: '11239',
                  name: 'sys-resources',
                  path: '/resources/dataMode',
                  component: 'resources/DataMode',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'FundOutlined',
                    title: '数据模式',
                    internal: false,
                  },
                },
                {
                  id: '112323',
                  name: 'sys-resources',
                  path: '/resources/transfer',
                  component: 'resources/DataTransfer',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'SwapOutlined',
                    title: '数据转换',
                    internal: false,
                  },
                },
                {
                  id: '11239',
                  name: 'sys-resources',
                  path: '/resources/ssl',
                  component: 'resources/SSL',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: 'SSL',
                    internal: false,
                  },
                },
                {
                  id: '112349',
                  name: 'sys-resources',
                  path: '/resources/web',
                  component: 'resources/Web',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: 'Web服务',
                    internal: false,
                  },
                },
                {
                  id: '23423',
                  name: 'sys-resources',
                  path: '/resources/dll',
                  component: 'resources/DLL',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '原生库',
                    internal: false,
                  },
                },
              ],
            },
            {
              id: '11239',
              name: 'sys-connection',
              path: '/connection',
              component: '',
              route: '1',
              meta: {
                keepAlive: false,
                icon: 'ApartmentOutlined',
                title: '连接管理',
                internal: false,
              },
              children: [
                {
                  id: '11239',
                  name: 'sys-connection',
                  path: '/connection/database',
                  component: 'connection/Database',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '数据库',
                    internal: false,
                  },
                },
                {
                  id: '11239',
                  name: 'sys-connection',
                  path: '/connection/jms',
                  component: 'connection/JMS',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: 'JMS',
                    internal: false,
                  },
                },
              ],
            },
            {
              id: '11239',
              name: 'sys-dataHandle',
              path: '/dataHandle',
              component: '',
              route: '1',
              meta: {
                keepAlive: false,
                icon: 'HeatMapOutlined',
                title: '数据处理',
                internal: false,
              },
              children: [
                {
                  id: '11279',
                  name: 'sys-dataHandle',
                  path: '/dataHandle/dataTransfer',
                  component: 'dataHandle/DataTransfer',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '数据转换',
                    internal: false,
                  },
                },
                {
                  id: '112795454',
                  name: 'sys-dataHandle',
                  path: '/dataHandle/variable',
                  component: 'dataHandle/Variable',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '变量配置',
                    internal: false,
                  },
                },
                {
                  id: '1127923423',
                  name: 'sys-dataHandle',
                  path: '/dataHandle/codeSet',
                  component: 'dataHandle/CodeSet',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '编码集',
                    internal: false,
                  },
                },
                {
                  id: '21279',
                  name: 'sys-dataHandle',
                  path: '/dataHandle/script',
                  component: 'dataHandle/Script',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '共享脚本',
                    internal: false,
                  },
                },
              ],
            },
            {
              id: '1122341179',
              name: 'sys-system',
              path: '/system',
              component: '',
              route: '1',
              meta: {
                keepAlive: false,
                icon: 'SettingOutlined',
                title: '系统管理',
                internal: false,
              },
              children: [
                {
                  id: '11237898909',
                  name: 'sys-system',
                  path: '/system/order',
                  component: 'system/Order',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'UserOutlined',
                    title: '普通订单',
                    internal: false,
                  },
                },
                {
                  id: '11235233479',
                  name: 'sys-system',
                  path: '/system/user',
                  component: 'system/User',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'UserOutlined',
                    title: '系统用户',
                    internal: false,
                  },
                },
                {
                  id: '11222479',
                  name: 'sys-system',
                  path: '/system/role',
                  component: 'system/Role',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'UsergroupDeleteOutlined',
                    title: '系统角色',
                    internal: false,
                  },
                },
                {
                  id: '1134579',
                  name: 'sys-system',
                  path: '/system/menu',
                  component: 'system/Menu',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'MenuOutlined',
                    title: '系统菜单',
                    internal: false,
                  },
                },
                {
                  id: '11234279',
                  name: 'sys-system',
                  path: '/system/permission',
                  component: 'system/Permission',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '权限分配',
                    internal: false,
                  },
                },
                {
                  id: '11298779',
                  name: 'sys-system',
                  path: '/system/dictionary',
                  component: 'system/Dictionary',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '数据字典',
                    internal: false,
                  },
                },
                {
                  id: '112455479',
                  name: 'sys-system',
                  path: '/system/dictionaryCategory',
                  component: 'system/DictionaryCategory',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '字典分类',
                    internal: false,
                  },
                },
                {
                  id: '118844279',
                  name: 'sys-system',
                  path: '/system/announcement',
                  component: 'system/Announcement',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '系统公告',
                    internal: false,
                  },
                },
              ],
            },
            {
              id: '112744339',
              name: 'sys-monitor',
              path: '/monitor',
              component: '',
              route: '1',
              meta: {
                keepAlive: false,
                icon: 'MonitorOutlined',
                title: '系统监控',
                internal: false,
              },
              children: [
                {
                  id: '1127555559',
                  name: 'sys-monitor',
                  path: '/monitor/timer',
                  component: 'monitor/Timer',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'FieldTimeOutlined',
                    title: '定时器',
                    internal: false,
                  },
                },
                {
                  id: '11273333339',
                  name: 'sys-monitor',
                  path: '/monitor/dataLog',
                  component: 'monitor/DataLog',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '数据日志',
                    internal: false,
                  },
                },
                {
                  id: '11223479',
                  name: 'sys-monitor',
                  path: '/monitor/log',
                  component: 'monitor/Log',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '日志管理',
                    internal: false,
                  },
                },
                {
                  id: '1128545579',
                  name: 'sys-monitor',
                  path: '/monitor/sql',
                  component: 'monitor/SQL',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'ConsoleSqlOutlined',
                    title: 'SQL监控',
                    internal: false,
                  },
                },
                {
                  id: '112791231255',
                  name: 'sys-monitor',
                  path: '/monitor/performance',
                  component: 'monitor/Performance',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '性能监控',
                    internal: false,
                  },
                },
                {
                  id: '1112279',
                  name: 'sys-monitor',
                  path: '/monitor/gateway',
                  component: 'monitor/Gateway',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'GatewayOutlined',
                    title: '网关路由',
                    internal: false,
                  },
                },
              ],
            },
            {
              id: '1112354543279',
              name: 'sys-message',
              path: '/message',
              component: '',
              route: '1',
              meta: {
                keepAlive: false,
                icon: 'CommentOutlined',
                title: '消息管理',
                internal: false,
              },
              children: [
                {
                  id: '1122345666479',
                  name: 'sys-message',
                  path: '/message/msgCenter',
                  component: 'message/MsgCenter',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '消息中心',
                    internal: false,
                  },
                },
                {
                  id: '112112312379',
                  name: 'sys-message',
                  path: '/message/template',
                  component: 'message/Template',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'HomeOutlined',
                    title: '消息模板',
                    internal: false,
                  },
                },
              ],
            },
            {
              id: '11273553239',
              name: 'sys-emr',
              path: '/editor',
              component: '',
              route: '1',
              meta: {
                keepAlive: false,
                icon: 'FileDoneOutlined',
                title: '编辑器',
                internal: false,
              },
              children: [
                {
                  id: '112735529',
                  name: 'sys-emr',
                  path: '/editor/docEditor',
                  component: 'editor/DocEditor',
                  route: '1',
                  meta: {
                    keepAlive: false,
                    icon: 'EditOutlined',
                    title: '文档编辑器',
                    internal: false,
                  },
                },
              ],
            },
          ]
          let homePath = ''
          dispatch(setMenus(menu))
          // 判断是否配置了默认跳转的首页地址
          if (!homePath) {
            // 获取第一个是路由的地址
            const firstRoute = menu.find((item: any) => item.route === '1')
            if (firstRoute) {
              homePath = firstRoute.path
            }
          }
          // 跳转到首页
          navigate(homePath)
          antdUtils.notification?.success({
            message: '登录成功',
            description: '欢迎来到Fusion Admin!',
          })
        }
        return
        // 根据code判定登录状态（和枚举的状态码进行判定） 只会存在几种情况，用户名不存在，用户名或密码错误，用户名冻结，验证码错误或者过期
        // case中使用{}包裹的目的是为了保证变量做用于仅限于case块
        switch (code) {
          // 用户名不存在或禁用
          case HttpCodeEnum.RC107:
          case HttpCodeEnum.RC102:
            form.setFields([{ name: 'username', errors: [message] }])
            form.getFieldInstance('username').focus()
            // 刷新验证码
            getCode()
            break
          // 密码输入错误
          case HttpCodeEnum.RC108:
            form.setFields([{ name: 'password', errors: [message] }])
            form.getFieldInstance('password').focus()
            // 刷新验证码
            getCode()
            break
          // 验证码错误或过期
          case HttpCodeEnum.RC300:
          case HttpCodeEnum.RC301:
            form.setFields([{ name: 'captcha', errors: [message] }])
            form.getFieldInstance('captcha').focus()
            // 刷新验证码
            getCode()
            break
          // 登录成功
          case HttpCodeEnum.SUCCESS:
            {
              // 没有配置首页地址默认跳到第一个菜单
              const { token, roleId } = data
              let { homePath } = data
              console.log(data, token)

              sessionStorage.setItem('token', token)
              sessionStorage.setItem('isLogin', 'true')
              sessionStorage.setItem('roleId', roleId)
              // 存储登录的用户名
              sessionStorage.setItem('loginUser', values.username)
              // 登录成功根据角色获取菜单
              // const menu = await getMenuListByRoleId({ roleId })
              // dispatch(setMenus(menu))
              // // 判断是否配置了默认跳转的首页地址
              // if (!homePath) {
              //   // 获取第一个是路由的地址
              //   const firstRoute = menu.find((item: any) => item.route === '1')
              //   if (firstRoute) {
              //     homePath = firstRoute.path
              //   }
              // }
              // 跳转到首页
              navigate(homePath)
              antdUtils.notification?.success({
                message: '登录成功',
                description: '欢迎来到Fusion Admin!',
              })
            }
            break
          default:
            // 默认按登录失败处理
            antdUtils.modal?.error({
              title: '登录失败',
              content: (
                <>
                  <p>错误状态码:{code}</p>
                  <p>失败原因:{message}</p>
                </>
              ),
            })
            // 刷新验证码
            getCode()
            break
        }
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  /**
   * 登录表单提交
   * @param values 提交表单的数据
   */
  const submit = async (values: any) => {
    captcha?.showCaptcha()
    if (state === 'success') {
      // 加入验证码校验key
      values.checkKey = checkKey
      setLoading(true)
    }
    captcha?.onSuccess(function () {
      let result = captcha.getValidate()
      let pickToken =
        result['lot_number'] +
        '|' +
        result['captcha_output'] +
        '|' +
        result['pass_token'] +
        '|' +
        result['gen_time']
      sessionStorage.setItem('captchaAnswer', pickToken)
      setCAPTCHA(pickToken)
    })
    console.log(values, 'values', state, captcha)
    return
  }

  const loginSelf = async () => {
    // 这里考虑返回的内容不仅包括token，还包括用户登录的角色（需要存储在本地，用于刷新页面时重新根据角色获取菜单）、配置的首页地址（供登录后进行跳转）
    try {
      const { code, data, message, token } = await login(form.getFieldsValue())
      console.log(code, data, message, token)
      if (token) {
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('isLogin', 'true')
        // 登录成功根据角色获取菜单
        const menu = [
          {
            id: '11231',
            name: 'sys-home',
            path: '/home',
            component: 'Home',
            route: '1',
            meta: {
              keepAlive: false,
              icon: 'HomeOutlined',
              title: '首页',
              internal: false,
            },
            children: [],
          },
          {
            id: '11232',
            name: 'sys-data',
            path: '/statics',
            component: '',
            route: '1',
            meta: {
              keepAlive: false,
              icon: 'LineChartOutlined',
              title: '数据统计',
              internal: false,
            },
            children: [
              {
                id: '11234',
                name: 'sys-message',
                path: '/statics/messageSearch',
                component: 'statics/MessageSearch',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'FileSearchOutlined',
                  title: '消息检索',
                  internal: false,
                },
              },
              {
                id: '11235',
                name: 'sys-error',
                path: '/statics/errorStatics',
                component: 'statics/ErrorStatics',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'CloseCircleOutlined',
                  title: '错误统计',
                  internal: false,
                },
              },
              {
                id: '11236',
                name: 'sys-terminal',
                path: '/statics/terminal',
                component: 'statics/Terminal',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'MonitorOutlined',
                  title: '终端监控',
                  internal: false,
                },
              },
              {
                id: '11235',
                name: 'sys-test',
                path: '/statics/testMessage',
                component: 'statics/TestMessage',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'MessageOutlined',
                  title: '测试消息',
                  internal: false,
                },
              },
            ],
          },
          {
            id: '11236',
            name: 'sys-project',
            path: '/project',
            component: '',
            route: '1',
            meta: {
              keepAlive: false,
              icon: 'ClusterOutlined',
              title: '项目管理',
              internal: false,
            },
            children: [
              {
                id: '21236',
                name: 'sys-project',
                path: '/project/endpointType',
                component: 'project/EndpointType',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'ShareAltOutlined',
                  title: '端点类型配置',
                  internal: false,
                },
              },
              {
                id: '11236',
                name: 'sys-project',
                path: '/project/endpoint',
                component: 'project/Endpoint',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'ApiOutlined',
                  title: '端点维护',
                  internal: false,
                },
              },
              {
                id: '11335',
                name: 'sys-project',
                path: '/project/design',
                component: 'project/Project',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'ContainerOutlined',
                  title: '项目设计',
                  internal: false,
                },
                // 子路由（不在左侧菜单栏显示出来）
                childrenRoute: [
                  {
                    id: '16335',
                    name: 'sys-project-design',
                    path: '/project/designer',
                    component: 'project/Designer',
                    route: '1',
                    meta: {
                      keepAlive: false,
                      icon: 'ContainerOutlined',
                      title: '流程设计',
                      internal: false,
                      menuType: 0,
                    },
                  },
                ],
              },
            ],
          },
          {
            id: '11237',
            name: 'sys-resources',
            path: '/resources',
            component: '',
            route: '1',
            meta: {
              keepAlive: false,
              icon: 'DeploymentUnitOutlined',
              title: '资源管理',
              internal: false,
            },
            children: [
              {
                id: '11238',
                name: 'sys-resources',
                path: '/resources/database',
                component: 'resources/Database',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'DatabaseOutlined',
                  title: '数据库资源',
                  internal: false,
                },
              },
              {
                id: '11239',
                name: 'sys-resources',
                path: '/resources/dataMode',
                component: 'resources/DataMode',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'FundOutlined',
                  title: '数据模式',
                  internal: false,
                },
              },
              {
                id: '112323',
                name: 'sys-resources',
                path: '/resources/transfer',
                component: 'resources/DataTransfer',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'SwapOutlined',
                  title: '数据转换',
                  internal: false,
                },
              },
              {
                id: '11239',
                name: 'sys-resources',
                path: '/resources/ssl',
                component: 'resources/SSL',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: 'SSL',
                  internal: false,
                },
              },
              {
                id: '112349',
                name: 'sys-resources',
                path: '/resources/web',
                component: 'resources/Web',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: 'Web服务',
                  internal: false,
                },
              },
              {
                id: '23423',
                name: 'sys-resources',
                path: '/resources/dll',
                component: 'resources/DLL',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '原生库',
                  internal: false,
                },
              },
            ],
          },
          {
            id: '11239',
            name: 'sys-connection',
            path: '/connection',
            component: '',
            route: '1',
            meta: {
              keepAlive: false,
              icon: 'ApartmentOutlined',
              title: '连接管理',
              internal: false,
            },
            children: [
              {
                id: '11239',
                name: 'sys-connection',
                path: '/connection/database',
                component: 'connection/Database',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '数据库',
                  internal: false,
                },
              },
              {
                id: '11239',
                name: 'sys-connection',
                path: '/connection/jms',
                component: 'connection/JMS',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: 'JMS',
                  internal: false,
                },
              },
            ],
          },
          {
            id: '11239',
            name: 'sys-dataHandle',
            path: '/dataHandle',
            component: '',
            route: '1',
            meta: {
              keepAlive: false,
              icon: 'HeatMapOutlined',
              title: '数据处理',
              internal: false,
            },
            children: [
              {
                id: '11279',
                name: 'sys-dataHandle',
                path: '/dataHandle/dataTransfer',
                component: 'dataHandle/DataTransfer',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '数据转换',
                  internal: false,
                },
              },
              {
                id: '112795454',
                name: 'sys-dataHandle',
                path: '/dataHandle/variable',
                component: 'dataHandle/Variable',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '变量配置',
                  internal: false,
                },
              },
              {
                id: '1127923423',
                name: 'sys-dataHandle',
                path: '/dataHandle/codeSet',
                component: 'dataHandle/CodeSet',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '编码集',
                  internal: false,
                },
              },
              {
                id: '21279',
                name: 'sys-dataHandle',
                path: '/dataHandle/script',
                component: 'dataHandle/Script',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '共享脚本',
                  internal: false,
                },
              },
            ],
          },
          {
            id: '1122341179',
            name: 'sys-system',
            path: '/system',
            component: '',
            route: '1',
            meta: {
              keepAlive: false,
              icon: 'SettingOutlined',
              title: '系统管理',
              internal: false,
            },
            children: [
              {
                id: '11237898909',
                name: 'sys-system',
                path: '/system/order',
                component: 'system/Order',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'UserOutlined',
                  title: '普通订单',
                  internal: false,
                },
              },
              {
                id: '11235233479',
                name: 'sys-system',
                path: '/system/user',
                component: 'system/User',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'UserOutlined',
                  title: '系统用户',
                  internal: false,
                },
              },
              {
                id: '11222479',
                name: 'sys-system',
                path: '/system/role',
                component: 'system/Role',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'UsergroupDeleteOutlined',
                  title: '系统角色',
                  internal: false,
                },
              },
              {
                id: '1134579',
                name: 'sys-system',
                path: '/system/menu',
                component: 'system/Menu',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'MenuOutlined',
                  title: '系统菜单',
                  internal: false,
                },
              },
              {
                id: '11234279',
                name: 'sys-system',
                path: '/system/permission',
                component: 'system/Permission',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '权限分配',
                  internal: false,
                },
              },
              {
                id: '11298779',
                name: 'sys-system',
                path: '/system/dictionary',
                component: 'system/Dictionary',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '数据字典',
                  internal: false,
                },
              },
              {
                id: '112455479',
                name: 'sys-system',
                path: '/system/dictionaryCategory',
                component: 'system/DictionaryCategory',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '字典分类',
                  internal: false,
                },
              },
              {
                id: '118844279',
                name: 'sys-system',
                path: '/system/announcement',
                component: 'system/Announcement',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '系统公告',
                  internal: false,
                },
              },
            ],
          },
          {
            id: '112744339',
            name: 'sys-monitor',
            path: '/monitor',
            component: '',
            route: '1',
            meta: {
              keepAlive: false,
              icon: 'MonitorOutlined',
              title: '系统监控',
              internal: false,
            },
            children: [
              {
                id: '1127555559',
                name: 'sys-monitor',
                path: '/monitor/timer',
                component: 'monitor/Timer',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'FieldTimeOutlined',
                  title: '定时器',
                  internal: false,
                },
              },
              {
                id: '11273333339',
                name: 'sys-monitor',
                path: '/monitor/dataLog',
                component: 'monitor/DataLog',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '数据日志',
                  internal: false,
                },
              },
              {
                id: '11223479',
                name: 'sys-monitor',
                path: '/monitor/log',
                component: 'monitor/Log',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '日志管理',
                  internal: false,
                },
              },
              {
                id: '1128545579',
                name: 'sys-monitor',
                path: '/monitor/sql',
                component: 'monitor/SQL',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'ConsoleSqlOutlined',
                  title: 'SQL监控',
                  internal: false,
                },
              },
              {
                id: '112791231255',
                name: 'sys-monitor',
                path: '/monitor/performance',
                component: 'monitor/Performance',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '性能监控',
                  internal: false,
                },
              },
              {
                id: '1112279',
                name: 'sys-monitor',
                path: '/monitor/gateway',
                component: 'monitor/Gateway',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'GatewayOutlined',
                  title: '网关路由',
                  internal: false,
                },
              },
            ],
          },
          {
            id: '1112354543279',
            name: 'sys-message',
            path: '/message',
            component: '',
            route: '1',
            meta: {
              keepAlive: false,
              icon: 'CommentOutlined',
              title: '消息管理',
              internal: false,
            },
            children: [
              {
                id: '1122345666479',
                name: 'sys-message',
                path: '/message/msgCenter',
                component: 'message/MsgCenter',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '消息中心',
                  internal: false,
                },
              },
              {
                id: '112112312379',
                name: 'sys-message',
                path: '/message/template',
                component: 'message/Template',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'HomeOutlined',
                  title: '消息模板',
                  internal: false,
                },
              },
            ],
          },
          {
            id: '11273553239',
            name: 'sys-emr',
            path: '/editor',
            component: '',
            route: '1',
            meta: {
              keepAlive: false,
              icon: 'FileDoneOutlined',
              title: '编辑器',
              internal: false,
            },
            children: [
              {
                id: '112735529',
                name: 'sys-emr',
                path: '/editor/docEditor',
                component: 'editor/DocEditor',
                route: '1',
                meta: {
                  keepAlive: false,
                  icon: 'EditOutlined',
                  title: '文档编辑器',
                  internal: false,
                },
              },
            ],
          },
        ]
        let homePath = ''
        dispatch(setMenus(menu))
        // 判断是否配置了默认跳转的首页地址
        if (!homePath) {
          // 获取第一个是路由的地址
          const firstRoute = menu.find((item: any) => item.route === '1')
          if (firstRoute) {
            homePath = firstRoute.path
          }
        }
        console.log(homePath)

        // 跳转到首页
        navigate(homePath)
        antdUtils.notification?.success({
          message: '登录成功',
          description: '欢迎来到Fusion Admin!',
        })
      }

      return
      // 根据code判定登录状态（和枚举的状态码进行判定） 只会存在几种情况，用户名不存在，用户名或密码错误，用户名冻结，验证码错误或者过期
      // case中使用{}包裹的目的是为了保证变量做用于仅限于case块
      switch (code) {
        // 用户名不存在或禁用
        case HttpCodeEnum.RC107:
        case HttpCodeEnum.RC102:
          form.setFields([{ name: 'username', errors: [message] }])
          form.getFieldInstance('username').focus()
          // 刷新验证码
          getCode()
          break
        // 密码输入错误
        case HttpCodeEnum.RC108:
          form.setFields([{ name: 'password', errors: [message] }])
          form.getFieldInstance('password').focus()
          // 刷新验证码
          getCode()
          break
        // 验证码错误或过期
        case HttpCodeEnum.RC300:
        case HttpCodeEnum.RC301:
          form.setFields([{ name: 'captcha', errors: [message] }])
          form.getFieldInstance('captcha').focus()
          // 刷新验证码
          getCode()
          break
        // 登录成功
        case HttpCodeEnum.SUCCESS:
          {
            // 没有配置首页地址默认跳到第一个菜单
            const { token, roleId } = data
            let { homePath } = data
            sessionStorage.setItem('token', token)
            sessionStorage.setItem('isLogin', 'true')
            sessionStorage.setItem('roleId', roleId)
            // 存储登录的用户名
            sessionStorage.setItem('loginUser', values.username)
            // 登录成功根据角色获取菜单
            const menu = await getMenuListByRoleId({ roleId })
            dispatch(setMenus(menu))
            // 判断是否配置了默认跳转的首页地址
            if (!homePath) {
              // 获取第一个是路由的地址
              const firstRoute = menu.find((item: any) => item.route === '1')
              if (firstRoute) {
                homePath = firstRoute.path
              }
            }
            // 跳转到首页
            navigate(homePath)
            antdUtils.notification?.success({
              message: '登录成功',
              description: '欢迎来到Fusion Admin!',
            })
          }
          break
        default:
          // 默认按登录失败处理
          antdUtils.modal?.error({
            title: '登录失败',
            content: (
              <>
                <p>错误状态码:{code}</p>
                <p>失败原因:{message}</p>
              </>
            ),
          })
          // 刷新验证码
          getCode()
          break
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 获取验证码
   */
  const getCode = async () => {
    // 时间key
    const key = new Date().getTime().toString()
    const code = await getCaptcha(key)
    setCode(code)
    setCheckKey(key)
  }

  return (
    <>
      <div className={styles.dragArea} />
      <div className={styles['login-container']}>
        <div className={styles['login-box']}>
          {/* 左边图案和标题 */}
          <div className={styles['login-left']}>
            <div className="logo mt-[60]">
              <img
                className="login-icon my-0 mx-auto"
                width="70"
                src={logo}
                alt="logo"
              />
            </div>
            <div className="title">
              <p style={{ fontSize: '20px', margin: 0 }}>
                <span
                  style={{
                    fontFamily:
                      '微软雅黑 Bold, 微软雅黑 Regular, 微软雅黑, sans-serif',
                    fontWeight: 700,
                  }}
                >
                  融合管理平台
                </span>
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                <span
                  style={{
                    fontFamily: '微软雅黑, sans-serif',
                    fontWeight: 400,
                    color: '#999999',
                  }}
                >
                  Fusion Admin
                </span>
              </p>
            </div>
          </div>
          {/* 右边登陆表单 */}
          <div className={styles['login-form']}>
            <div className="login-title">
              <p style={{ fontSize: '28px', textAlign: 'center', margin: 0 }}>
                <span
                  style={{
                    fontFamily:
                      '微软雅黑 Bold, 微软雅黑 Regular, 微软雅黑, sans-serif',
                    fontWeight: 700,
                  }}
                >
                  用户登录
                </span>
              </p>
            </div>
            <div className="form" style={{ marginTop: '40px' }}>
              <Form
                form={form}
                name="login"
                labelCol={{ span: 5 }}
                initialValues={{
                  username: 'admin',
                  password: '123456qwe,.',
                  remember: true,
                }}
                size="large"
                autoComplete="off"
                onFinish={submit}
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input
                    size="large"
                    ref={inputRef}
                    autoFocus
                    autoComplete="off"
                    allowClear
                    placeholder="用户名：admin"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input.Password
                    size="large"
                    allowClear
                    autoComplete="off"
                    placeholder="密码：123456qwe,."
                    prefix={<LockOutlined />}
                  />
                </Form.Item>
                {/* <Form.Item>
                  <Row gutter={8}>
                    <Col span={18}>
                      <Form.Item
                        name="captcha"
                        noStyle
                        rules={[{ required: true, message: '请输入验证码' }]}
                      >
                        <Input
                          size="large"
                          allowClear
                          placeholder="输入右侧验证码"
                          prefix={<SecurityScanOutlined />}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Button
                        size="large"
                        onClick={getCode}
                        style={{
                          width: '100%',
                          backgroundColor: '#f0f0f0',
                          padding: '2px',
                        }}
                      >
                        <Image
                          src={code}
                          preview={false}
                          width="100%"
                          height="100%"
                        />
                      </Button>
                    </Col>
                  </Row>
                </Form.Item> */}
                {/* 记住密码 */}
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>记住密码</Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={loading}
                    size="large"
                    style={{ width: '100%' }}
                    type="primary"
                    htmlType="submit"
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '440px', margin: '0 auto', padding: '20px 0' }}>
        <a
          target="_blank"
          rel="noreferrer"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51012202001944"
          style={{
            display: 'inline-block',
            textDecoration: 'none',
            height: '20px',
            lineHeight: '20px',
          }}
        >
          <img src={filing} style={{ float: 'left' }} alt="无图片" />
          <p
            style={{
              float: 'left',
              height: '20px',
              lineHeight: '20px',
              margin: '0px 0px 0px 5px',
              color: '#939393',
            }}
          >
            川公网安备51012202001944
          </p>
        </a>
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noreferrer"
          style={{
            position: 'absolute',
            display: 'inline-block',
            color: '#939393',
            textDecoration: 'none',
            marginLeft: '6px',
          }}
        >
          蜀ICP备2023022276号-2
        </a>
      </div>
    </>
  )
}
export default Login
