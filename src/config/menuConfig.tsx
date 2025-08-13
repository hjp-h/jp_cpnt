import React from "react";
import {
  HomeOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  AppstoreOutlined,
  BuildOutlined,
  LayoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  path: string;
  children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "首页",
    path: "/",
  },
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "仪表盘",
    path: "/dashboard",
  },
  {
    key: "users",
    icon: <UserOutlined />,
    label: "用户管理",
    path: "/users",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "设置",
    path: "/settings",
  },
  // 新增组件库菜单
  {
    key: "components",
    icon: <AppstoreOutlined />,
    label: "组件",
    path: "/components",
    children: [
      {
        key: "button",
        icon: <BuildOutlined />,
        label: "Button",
        path: "/components/button",
      },
      {
        key: "layout",
        icon: <LayoutOutlined />,
        label: "Layout",
        path: "/components/layout",
      },
      {
        key: "pixijs",
        icon: <LayoutOutlined />,
        label: "Pixijs",
        path: "/components/pixijs",
      },
      {
        key: "gsap-demo",
        icon: <LayoutOutlined />,
        label: "GsapDemo",
        path: "/components/gsap-demo",
      },
      {
        key: "dndkit",
        icon: <LayoutOutlined />,
        label: "DndKit",
        path: "/components/dndkit",
      },
    ],
  },
];

// 转换为 Antd Menu 组件所需的格式
export const getMenuItems = (): MenuProps["items"] => {
  return menuItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    children: item.children?.map((child) => ({
      key: child.key,
      icon: child.icon,
      label: child.label,
    })),
  }));
};
