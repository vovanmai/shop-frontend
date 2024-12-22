'use client'
import React, {useState, ReactNode, Suspense } from 'react';
import type { MenuProps } from 'antd';
import { Layout, theme } from 'antd';
import LayoutHeader from '@/components/layout/Header'
import LayoutSider from '@/components/layout/Sider'
import LayoutFooter from '@/components/layout/Footer'
type MenuItem = Required<MenuProps>['items'][number];
interface DashboardLayoutUserProps {
  children: ReactNode;
}

import menu from "./menus";

const { Content } = Layout;

const DashboardLayoutUser = ({ children }: DashboardLayoutUserProps) => {
  const {
      token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [marginInlineStart, SetMarginInlineStart] = useState<number>(200);
  const toggleSider = (collapsed: boolean) => {
    setCollapsed(!collapsed)
    SetMarginInlineStart(!collapsed ? 80 : 200)
  }

  const menuItems: MenuItem[] = menu

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Layout hasSider>
        <LayoutSider
          collapsed={collapsed}
          menus={menuItems}
        />
        <Layout style={{ marginInlineStart: marginInlineStart }}>
          <LayoutHeader
            collapsed={collapsed}
            toggleSider={toggleSider}
          />
          <Content style={{ margin: '10px 12px 0px 12px' }}>
            {children}
          </Content>
          <LayoutFooter/>
        </Layout>
      </Layout>
    </Suspense>
  );
};

export default DashboardLayoutUser;