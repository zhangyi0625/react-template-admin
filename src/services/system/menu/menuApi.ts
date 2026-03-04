import { HttpRequest } from '@/utils/request';
import { MenuParams } from './menuModel';

/**
 * 枚举菜单相关的请求API
 */
export enum MenuApi {
  // 根据token获取菜单（多用于框架上根据角色获取菜单那种）
  // getMenuList = '/system/getMenusByRole',
  getMenuList = '/system/menu',
  getMenuListByPage = '/system/menu/page',
  // 获取所有菜单
  // getAllMenus = '/system/menu',
  // 获取所有上级菜单
  getDirectory = '/system/menu/getDirectory',
  // 批量删除菜单
  deleteMenuBatch = '/system/menu/batch',
  // 导出（Excel）
  exportMenus = '/system/menu/export',
  // 批量导入
  importMenus = '/system/menu/import',
  // 验证菜单权限
  checkPermission = '/system/menu/checkPermission',
}

/**
 * @description 根据角色获取菜单
 * @param roleId 角色ID
 * @returns
 */
export const getMenuListByRoleId = (roleId: string) => {
  return HttpRequest.get(
    {
      url: MenuApi.getMenuList + roleId,
    },
    { successMessageMode: 'none' },
  );
};

/**
 * @description 查询所有菜单
 * @param params 查询条件
 * @returns 菜单列表
 */
export const getMenusList = (params?: MenuParams) => {
  return HttpRequest.get(
    {
      url: MenuApi.getMenuList,
      params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * @description 分页查询菜单
 * @param params 查询条件
 * @returns 菜单列表
 */
export const getMenusByPage = (params: MenuParams) => {
  return HttpRequest.get(
    {
      url: MenuApi.getMenuListByPage,
      params: params,
    },
    {
      successMessageMode: 'none',
    },
  );
};

/**
 * @description 获取所有的一级菜单
 * @returns 一级菜单列表
 */
export const getDirectory = () => {
  return HttpRequest.get(
    { url: MenuApi.getDirectory },
    { successMessageMode: 'none' },
  );
};

/**
 * @description 新增菜单
 * @param params 菜单数据
 * @returns
 */
export const addMenu = (params: Record<string, any>) => {
  return HttpRequest.post({
    url: MenuApi.getMenuList,
    data: params,
  });
};

/**
 * @description 修改菜单数据
 * @param params 菜单数据
 * @returns
 */
export const updateMenu = (params: Record<string, any>) => {
  return HttpRequest.put({
    url: MenuApi.getMenuList,
    data: params,
  });
};

/**
 * @description 删除菜单
 * @param menuId 菜单ID
 * @returns
 */
export const deleteMenu = (menuId: string) => {
  return HttpRequest.delete({
    url: MenuApi.getMenuList + '/' + menuId,
  });
};

/**
 * @description 批量删除菜单
 * @param menuIds  选中的菜单ID列表
 * @returns
 */
export const deleteMenuBatch = (menuIds: string[]) => {
  return HttpRequest.delete({
    url: MenuApi.deleteMenuBatch,
    data: menuIds,
  });
};

/**
 * @description 导出菜单（导出到Excel）
 * @param menus 需要导出的菜单数据
 * @returns
 */
export const exportMenu = (menus: any) => {
  return HttpRequest.post({
    url: MenuApi.exportMenus,
    data: menus,
  });
};

/**
 * @description 导入菜单（从Excel里面导入）
 * @param file 文件内容（Excel文件）
 * @returns
 */
export const importMenu = (file: any) => {
  return HttpRequest.post({
    url: MenuApi.importMenus,
    data: file,
  });
};

/**
 * @description 验证菜单权限
 * @param params 菜单数据
 * @returns 结果
 */
export const checkPermission = (params: any) => {
  return HttpRequest.post({
    url: MenuApi.checkPermission,
    data: params,
  });
};
