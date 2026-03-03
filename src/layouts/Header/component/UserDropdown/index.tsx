import { App, Avatar, Divider, Dropdown, theme, type MenuProps } from 'antd';
import avatar from '@/assets/images/avatar.png';
import { useNavigate } from 'react-router-dom';
import {
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
  // FileMarkdownOutlined,
  // LockOutlined,
  LogoutOutlined,
  // QuestionCircleFilled,
  // SyncOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { logout } from '@/services/login/loginApi';
import type { ReactNode } from 'react';
import React, { useState } from 'react';
// import { updatePreferences } from '@/stores/store';
import { useDispatch } from 'react-redux';
import ResetUserPassword from '@/views/system/User/ResetUserPassword';
import type { SysUserType } from '@/services/system/role/roleModel';
import { updateUserPassword } from '@/services/system/user/userApi';

const { useToken } = theme;

/**
 * 用户信息下拉框
 * @returns
 */
const UserDropdown: React.FC = () => {
  const dispatch = useDispatch();
  const { token } = useToken();
  const { modal } = App.useApp();

  const navigate = useNavigate();

  const [resetPassword, setResetPassword] = useState<{
    visible: boolean;
    currentRow: Pick<SysUserType, 'userId' | 'username' | 'password'> | null;
  }>({
    visible: false,
    currentRow: null,
  });

  // 菜单栏
  const items: MenuProps['items'] = [
    // {
    //   key: 'doc',
    //   label: '文档',
    //   icon: <FileMarkdownOutlined />,
    // },
    {
      key: '1',
      label: '修改密码',
      icon: <UserOutlined />,
      disabled: false,
      onClick: () => {
        // 个人中心做成一个弹窗，内部可以修改
        setResetPassword({
          visible: true,
          currentRow: {
            userId: sessionStorage.getItem('roleId') as string,
            username: '',
            password: '',
          },
        });
      },
    },
    // {
    //   key: 'help',
    //   label: '问题 & 帮助',
    //   icon: <QuestionCircleFilled />,
    // },
    // {
    //   type: 'divider',
    // },
    // {
    //   key: '3',
    //   label: '刷新缓存',
    //   icon: <SyncOutlined />,
    //   onClick: () => {
    /**
     * 后端的缓存信息（相当于把缓存数据刷新）
     * 清除local storage所有redux数据 为了重新缓存新数据
     */
    //     localStorage.clear();
    //     window.location.reload();
    //   },
    // },
    // {
    //   type: 'divider',
    // },
    // {
    //   key: 'lock',
    //   label: '锁屏',
    //   icon: <LockOutlined />,
    //   onClick: () => {
    //     dispatch(updatePreferences('widget', 'lockScreenStatus', true));
    //   },
    // },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: '退出登录',
      icon: <LogoutOutlined />,
      disabled: false,
      extra: 'alt + Q',
      onClick: () => {
        modal.confirm({
          title: '退出登录',
          icon: <ExclamationCircleOutlined />,
          content: '确认退出登录吗？',
          okText: '确认',
          onOk: () => {
            getLogout();
          },
          cancelText: '取消',
        });
      },
    },
  ];

  const getLogout = () => {
    const token = sessionStorage.getItem('token');

    // 清除后端的信息
    logout(token as string);
    // 清空token
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('roleId');
    sessionStorage.removeItem('isLogin');
    sessionStorage.removeItem('loginUser');

    // 修改回document.title
    document.title = '协会管理平台 - 登录';
    // 退出到登录页面
    navigate('/login');
  };

  /**
   * 内容样式
   */
  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  /**
   * 自定义渲染
   * @param menus 菜单
   * @returns
   */
  const renderDropdown = (menus: ReactNode) => {
    return (
      <div className="dropdownContent" style={contentStyle}>
        <div className="avatar flex items-center p-3">
          <Avatar size="large" src={avatar} />
        </div>
        <Divider style={{ margin: '2px 0' }} />
        {React.cloneElement(menus as React.ReactElement, {
          style: { boxShadow: 'none' },
        })}
      </div>
    );
  };

  const resetUserPassword = (row: SysUserType) => {
    modal.confirm({
      title: `重置密码`,
      icon: <ExclamationCircleFilled />,
      content: `确定重置密码吗？数据重置后将无法恢复！`,
      onOk() {
        updateUserPassword(row).then(() => {
          // message.success('重置成功');
          setResetPassword({ visible: false, currentRow: null });
          // // 刷新表格数据
          // onUpdateSearch(searchDefaultForm);
          getLogout();
        });
      },
    });
  };

  return (
    <>
      <Dropdown
        menu={{ items }}
        popupRender={renderDropdown}
        placement="bottomLeft"
        overlayStyle={{ width: 240 }}
      >
        <div className="login-user flex items-center cursor-pointer justify-between h-[50] transition-all duration-300">
          <Avatar size="default" src={avatar} />
          <span style={{ margin: '0 0 0 6px' }}>
            {sessionStorage.getItem('loginUser') || 'username'}
          </span>
        </div>
      </Dropdown>
      <ResetUserPassword
        params={resetPassword}
        onCancel={() => setResetPassword({ visible: false, currentRow: null })}
        onOk={resetUserPassword}
      />
    </>
  );
};

export default UserDropdown;
