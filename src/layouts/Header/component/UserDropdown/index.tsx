import { App, Avatar, Divider, Dropdown, theme, type MenuProps } from 'antd';
import avatar from '@/assets/images/avatar.png';
import { useNavigate } from 'react-router-dom';
import {
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { logout } from '@/services/login/loginApi';
import type { ReactNode } from 'react';
import React, { useState } from 'react';
import ResetUserPassword from '@/views/system/User/ResetUserPassword';
import type { SysUserType } from '@/services/system/role/roleModel';
import { putUserPassword } from '@/services/system/user/userApi';

const { useToken } = theme;

/**
 * 用户信息下拉框
 * @returns
 */
const UserDropdown: React.FC = () => {
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
    {
      key: '1',
      label: '修改密码',
      icon: <UserOutlined />,
      disabled: false,
      onClick: () => {
        // 个人中心做成一个弹窗，内部可以修改
        setResetPassword({
          visible: true,
          currentRow: null,
        });
      },
    },
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
      title: `修改密码`,
      icon: <ExclamationCircleFilled />,
      content: `确定修改密码吗？数据重置后将无法恢复！`,
      onOk() {
        putUserPassword(row).then(() => {
          setResetPassword({ visible: false, currentRow: null });
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
