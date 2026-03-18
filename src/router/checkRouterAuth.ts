import type { RouteObject } from '@/types/route';
import { dynamicRoutes } from './router';

// 根据路径获取路由
const checkAuth = (routes: RouteObject[], path: string): RouteObject | null => {
  for (const data of routes) {
    if (data.path === path) return data;
    if (data.children) {
      const res: RouteObject | null = checkAuth(data.children, path);
      if (res) return res;
    }
  }
  return null;
};

// 检查路由权限
export const checkRouterAuth = (path: string) => {
  return checkAuth(dynamicRoutes, path);
};
