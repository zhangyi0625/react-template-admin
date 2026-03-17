import type React from 'react';
import { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import type { RouteItem } from '@/types/route';
import { useSelector } from 'react-redux';
import type { RootState } from '@/stores/store';
import { getIcon } from '@/utils/utils';

/**
 * 面包屑
 * @return JSX
 */
const BreadcrumbNav: React.FC = () => {
  // 获取路由的地址，地址变化的时候去获取对应的菜单项，以此来拼接面包屑
  const location = useLocation();
  // 从后台获取的路由菜单
  const menuState = useSelector((state: RootState) => state.menuState);
  const { menus } = menuState;
  const [items, setItems] = useState<Record<string, any>[]>([]);
  // 从全局状态中获取配置是否开启面包屑、图标
  const { breadcrumb } = useSelector((state: RootState) => state.preferences);
  useEffect(() => {
    // 将menu里面的内容和path进行对照获取
    const breadItems = patchBreadcrumb(
      menus,
      location.pathname,
      breadcrumb.showIcon,
    );

    if (breadItems.length > 0) {
      setItems(breadItems);
    }
    // 设置面包屑内容
  }, [location.pathname, menus, breadcrumb]);

  // 组件的DOM内容
  return (
    <>
      <Breadcrumb
        items={items}
        className="flex justify-between items-center"
        style={{ marginLeft: '10px' }}
      />
    </>
  );
};
export default BreadcrumbNav;

/**
 * 根据路径生成面包屑的路径内容
 * @param routerList 菜单集合
 * @param pathname 路径
 * @returns 面包屑内容集合
 */
function patchBreadcrumb(
  routerList: RouteItem[],
  pathname: string,
  joinIcon: boolean,
): Record<string, any>[] {
  const result: Record<string, any>[] = [];

  if (routerList) {
    for (let i = 0; i < routerList.length; i++) {
      const item = routerList[i];

      // 检查当前路径是否匹配当前路由或其子路径
      const isMatch =
        pathname === item.path ||
        (pathname.includes(item.path) &&
          pathname.length > item.path.length &&
          pathname.substring(item.path.length, item.path.length + 1) === '/');

      if (isMatch) {
        // 创建面包屑项
        const pth: Record<string, any> = {};
        pth.key = item.path;

        // 对于详情页，创建可点击的父路由面包屑
        if (pathname !== item.path) {
          // 父路由面包屑项 - 只有有component的路由才是可点击的
          pth.title = (
            <>
              {joinIcon && item.icon && getIcon(item.icon)}
              {item.component ? (
                <Link to={item.path}>{item.meta?.title}</Link>
              ) : (
                <span style={{ padding: '0 4px' }}>{item.meta?.title}</span>
              )}
            </>
          );
          result.push(pth);

          // 检查是否有子路由
          if (item.children && item.children.length > 0) {
            const childResult = patchBreadcrumb(
              item.children,
              pathname,
              joinIcon,
            );
            if (childResult.length > 0) {
              return [...result, ...childResult];
            }
          }

          // 如果没有子路由匹配，创建详情页面包屑
          const detailPth: Record<string, any> = {};
          detailPth.key = pathname;
          detailPth.title = (
            <>
              {joinIcon && item.icon && getIcon(item.icon)}
              <span style={{ padding: '0 4px' }}>{item.meta?.title}详情</span>
            </>
          );
          result.push(detailPth);
          return result;
        } else {
          // 对于普通页面，创建可点击的面包屑 - 只有有component的路由才是可点击的
          pth.title = (
            <>
              {joinIcon && item.icon && getIcon(item.icon)}
              {item.component ? (
                <Link to={item.path}>{item.meta?.title}</Link>
              ) : (
                <span style={{ padding: '0 4px' }}>{item.meta?.title}</span>
              )}
            </>
          );
          result.push(pth);

          // 检查是否有子路由
          if (item.children && item.children.length > 0) {
            const childResult = patchBreadcrumb(
              item.children,
              pathname,
              joinIcon,
            );
            if (childResult.length > 0) {
              return [...result, ...childResult];
            }
          }
        }
      }

      // 检查子路由
      if (item.children && item.children.length > 0) {
        const childResult = patchBreadcrumb(item.children, pathname, joinIcon);
        if (childResult.length > 0) {
          // 如果子路由匹配，添加当前路由到面包屑
          if (isMatch) {
            // 只有有component的路由才添加到面包屑
            if (item.component || pathname !== item.path) {
              const pth: Record<string, any> = {};
              pth.key = item.path;
              pth.title = (
                <>
                  {joinIcon && item.icon && getIcon(item.icon)}
                  {item.component ? (
                    <Link to={item.path}>{item.meta?.title}</Link>
                  ) : (
                    <span style={{ padding: '0 4px' }}>{item.meta?.title}</span>
                  )}
                </>
              );
              result.push(pth);
              return [...result, ...childResult];
            }
            return childResult;
          }
          return childResult;
        }
      }
    }
  }
  return result;
}
