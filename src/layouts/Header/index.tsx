import { Layout, Skeleton, Space } from 'antd';
import React, { Suspense } from 'react';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import BreadcrumbNav from './component/BreadcrumbNav';
import UserDropdown from './component/UserDropdown';
import { type RootState } from '@/stores/store';

const Setting = React.lazy(() => import('./component/Setting'));

/**
 * 顶部布局内容
 */
const Header: React.FC = memo(() => {
  const [openSetting, setOpenSetting] = useState<boolean>(false);
  // 从全局状态中获取配置是否开启面包屑、图标
  const { breadcrumb } = useSelector((state: RootState) => state.preferences);

  /**
   * 跳转到github
   */
  // const routeGitHub = () => {
  //   window.open('https://github.com/yecongling/fusion-admin', '_blank')
  // };

  /**
   * 检索菜单
   * @param name 菜单名
   */
  // const searchMenu = (name: string) => {
  //   console.log(name);
  // };

  return (
    <>
      <Layout.Header
        className="ant-layout-header flex"
        style={{
          borderBottom: ' 1px solid #e9edf0',
        }}
      >
        {/* 面包屑 */}
        {breadcrumb.enable && <BreadcrumbNav />}
        <Space
          size="large"
          className="flex flex-1 justify-end items-center toolbox"
        >
          <UserDropdown />
        </Space>
      </Layout.Header>
      {/* 系统设置界面 */}
      <Suspense fallback={<Skeleton />}>
        <Setting open={openSetting} setOpen={setOpenSetting} />
      </Suspense>
    </>
  );
});
export default Header;
