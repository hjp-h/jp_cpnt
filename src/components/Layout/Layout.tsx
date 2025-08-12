import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout as AntLayout, Menu, theme, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { menuItems, getMenuItems, MenuItem } from "../../config/menuConfig";
import "./Layout.css";

const { Header, Sider, Content } = AntLayout;

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 根据当前路径获取选中的菜单项
  const getSelectedKeys = () => {
    const currentPath = location.pathname;
    const menuItem = menuItems.find((item) => item.path === currentPath);
    return menuItem ? [menuItem.key] : ["home"];
  };

  // 递归查找菜单项（包括子菜单）
  const findMenuItemByKey = (items: MenuItem[], key: string): MenuItem | null => {
    for (const item of items) {
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const found = findMenuItemByKey(item.children, key);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  // 处理菜单点击事件
  const handleMenuClick = ({ key }: { key: string }) => {
    const menuItem = findMenuItemByKey(menuItems, key);
    console.log("menuItem", menuItems, key);
    if (menuItem) {
      navigate(menuItem.path);
    }
  };

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={getMenuItems()}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
