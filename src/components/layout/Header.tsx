'use client'
import { Button, theme, Layout, MenuProps, Dropdown, Avatar } from "antd";
const { Header } = Layout;
import { MenuFoldOutlined, MenuUnfoldOutlined, LoginOutlined, InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import React, {useEffect} from "react";
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectCurrentUser } from "@/store/user/auth/authSlice";
import { logout as requestLogout } from '@/api/user/auth'
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getProfile as requestProfile} from "@/api/user/auth/index"
import { setCurrentUser } from '@/store/user/auth/authSlice'

const LayoutHeader = ({collapsed, toggleSider}: {collapsed: boolean, toggleSider: Function}) => {
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();
  const router = useRouter()
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectCurrentUser)
  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <InfoCircleOutlined />
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LoginOutlined />,
    },
  ];


  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return
    }
    const getProfile = async () => {
      try {
        const response = await requestProfile()
        dispatch(setCurrentUser(response?.data))
      } catch (error) {

      }
    }
    getProfile()
  }, [dispatch])

  const logout = async () => {
    try {
      await requestLogout()
      localStorage.removeItem('access_token')
      toast.success('Đăng xuất thành công.')
      router.push('/login/email')
    } catch (error) {

    }
  }

  const handleMenuClick = async (menuInfo: { key: string }) => {
    switch (menuInfo.key) {
      case 'profile':
        break;
      case 'logout':
        await logout()
    }
  }
  return (
    <Header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: colorBgContainer,
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(5, 5, 5, 0.06)'
    }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => toggleSider(collapsed)}
        style={{
          fontSize: '16px',
          width: 35,
          height: 35,
        }}
      />
      <div>
        <Dropdown
          menu={{
            items: items,
            onClick: handleMenuClick,
          }}
        >
          <Avatar style={{ backgroundColor: colorPrimary }} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

export default LayoutHeader