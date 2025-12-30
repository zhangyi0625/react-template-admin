import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styles from './login.module.scss';
import { useNavigate } from 'react-router-dom';
import { login } from '@/services/login/loginApi';
import { useDispatch } from 'react-redux';
import { setMenus } from '@/stores/store';
import { antdUtils } from '@/utils/antdUtil';
// import { buildTree } from '@/utils/tool';
import { useGeeTest } from 'react-geetest-v4';
import { getMenusList } from '@/services/system/menu/menuApi';

const LOGIN_BC =
  process.env.RS_STATIC_API + '/static/website/background-img/login-bc.png';

const LOGIN_BG =
  process.env.RS_STATIC_API + '/static/website/background-img/login-bg.png';

const WX_OFFICIAL =
  process.env.RS_STATIC_API + '/static/website/qrcode/wx-official.png';

const WX_MINI =
  process.env.RS_STATIC_API + '/static/website/qrcode/wx-mini.png';

/**
 * 登录模块
 * @returns 组件内容
 */
const Login: React.FC = () => {
  const [form] = Form.useForm();

  const inputRef = useRef(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);

  const { captcha, state } = useGeeTest('06e2fb115b4ac9a17fa2031361e52ba9', {
    product: 'bind',
    protocol: 'https://',
    // containerId: 'geetest-captcha',
  });
  const [CAPTCHA, setCAPTCHA] = useState<any>();

  // 页面挂载请求后端获取验证码
  useEffect(() => {
    if (!CAPTCHA) getAuth();
    if (state === 'success' && CAPTCHA) getLogin();
  }, [state, CAPTCHA]);

  const getAuth = () => {
    (window as any).initGeetest4(
      {
        captchaId: '06e2fb115b4ac9a17fa2031361e52ba9',
        product: 'bind',
      },
      function (captcha: any) {
        captcha.onSuccess(function () {
          var result = captcha.getValidate();
          captcha.successFn(
            result['lot_number'] +
              '|' +
              result['captcha_output'] +
              '|' +
              result['pass_token'] +
              '|' +
              result['gen_time']
          );
        });
      }
    );
  };

  /**
   * 登录表单提交
   * @param values 提交表单的数据
   */
  const submit = async () => {
    captcha?.showCaptcha();
    setLoading(true);
    captcha?.onSuccess(function () {
      let result = captcha.getValidate();
      let pickToken =
        result['lot_number'] +
        '|' +
        result['captcha_output'] +
        '|' +
        result['pass_token'] +
        '|' +
        result['gen_time'];
      sessionStorage.setItem('captchaAnswer', pickToken);
      setCAPTCHA(pickToken);
    });
  };

  const getLogin = async () => {
    const values = form.getFieldsValue();
    setLoading(true);
    // 这里考虑返回的内容不仅包括token，还包括用户登录的角色（需要存储在本地，用于刷新页面时重新根据角色获取菜单）、配置的首页地址（供登录后进行跳转）
    try {
      const res = await login(values);
      if (res?.token) {
        sessionStorage.setItem('token', res?.token);
        sessionStorage.setItem('isLogin', 'true');
        let homePath = '';
        const menu = await getMenusList();
        dispatch(setMenus(menu));
        // 判断是否配置了默认跳转的首页地址
        if (!homePath) {
          // 获取第一个是路由的地址
          const firstRoute = menu.find(
            (item: { route: string }) => item.route === '1'
          );
          if (firstRoute) {
            homePath = firstRoute.children
              ? firstRoute.children[0].path
              : firstRoute.path;
          }
        }
        // 跳转到首页
        navigate(homePath);
        antdUtils.notification?.success({
          message: '登录成功',
          description: '欢迎登录在舱管理系统!',
        });
      }
    } finally {
      setLoading(false);
      setCAPTCHA('');
    }
  };

  return (
    <>
      <div className={styles.dragArea} />
      <div
        className={styles['login-container']}
        style={{ backgroundImage: `url(${LOGIN_BC})` }}
      >
        <div
          className={styles['login-box']}
          style={{ backgroundImage: `url(${LOGIN_BG})` }}
        >
          {/* 左边图案和标题 */}
          <div className={styles['login-left']}>
            <div className={styles['login-left-qrcode']}>
              <img className="image" src={WX_OFFICIAL} alt="official" />
              <img className="image ml-[20px]" src={WX_MINI} alt="mini" />
            </div>
          </div>
          {/* 右边登陆表单 */}
          <div className={styles['login-form']}>
            <div className={styles['login-form-title']}>
              <p style={{ fontSize: '30px', textAlign: 'center', margin: 0 }}>
                <span
                  style={{
                    fontFamily:
                      '微软雅黑 Bold, 微软雅黑 Regular, 微软雅黑, sans-serif',
                    fontWeight: 500,
                  }}
                >
                  欢迎登录在舱管理系统
                </span>
              </p>
            </div>
            <div className="form" style={{ marginTop: '40px' }}>
              <Form
                form={form}
                name="login"
                labelCol={{ span: 5 }}
                initialValues={{
                  username: 'zy',
                  password: '888888',
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
                    placeholder="用户名：zy"
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
                    placeholder="密码：888888"
                    prefix={<LockOutlined />}
                  />
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
        <div
          style={{
            width: '440px',
            margin: '0 auto',
            padding: '20px 0',
            display: 'none',
          }}
        >
          <a
            target="_blank"
            rel="noreferrer"
            // href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51012202001944"
            style={{
              display: 'inline-block',
              textDecoration: 'none',
              height: '20px',
              lineHeight: '20px',
            }}
          >
            {/* <img src={filing} style={{ float: 'left' }} alt="无图片" /> */}
            <p
              style={{
                float: 'left',
                height: '20px',
                lineHeight: '20px',
                margin: '0px 0px 0px 5px',
                color: '#ffffff',
              }}
            >
              在舱 ( 浙ICP备2022007500号-1)
            </p>
          </a>
          <a
            href="https://www.zaicang.net"
            target="_blank"
            rel="noreferrer"
            style={{
              position: 'absolute',
              display: 'inline-block',
              color: '#ffffff',
              textDecoration: 'none',
              marginLeft: '6px',
            }}
          >
            版权所属：宁波真和物流科技有限公司
          </a>
        </div>
      </div>
    </>
  );
};
export default Login;
