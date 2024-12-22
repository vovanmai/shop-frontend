'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Form, Input, Select, theme } from 'antd'
import Link from 'next/link'
import {
  LoginOutlined,
  EditOutlined
} from '@ant-design/icons'
import { toast } from 'react-toastify'
import SpinLoading from '@/components/SpinLoading'

import { login as requestLogin } from "@/api/user/auth/index"

import { useAppSelector } from '@/store/hooks'
import { selectCompanies, selectEmail } from "@/store/user/auth/authSlice"
import {ROUTES} from "@/constants/routes";

export default function Login() {
  const [form] = Form.useForm();
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const email = useAppSelector(selectEmail)
  const companies = useAppSelector(selectCompanies).map((item: any) => {
    return {
      value: item.id,
      label: item.name
    }
  })

  useEffect(function () {
    if (!email) {
      router.push('/login/email')
    }
  }, [email, router])

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true)
      if (companies.length === 1) {
        values.company_id = companies[0].value
      }
      const response = await requestLogin(values)
      localStorage.setItem('access_token', response.data.access_token)
      toast.success('Đăng nhập thành công!')

      const redirect = sessionStorage.getItem('redirect')
      if (redirect) {
        sessionStorage.removeItem('redirect')
        router.push(redirect)
      } else {
        router.push(ROUTES.DASHBOARD_USER_LIST);
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const companyId = companies[0] ? companies[0].value : null

  const initialValues = {
    email: email,
    company_id: companyId
  }
  return (
    <Form
      form={form}
      name="login-form"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      style={{ maxWidth: 600 }}
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
  >
    <Form.Item
      label="Email"
      name="email"
      rules={[
        { required: true, message: 'Vui lòng nhập địa chỉ email.' },
        { type: 'email', message: 'Email không đúng định dạng.'},
        { max: 50, message: 'Tối đa 50 ký tự.'}
      ]}
    >
       <Input
         disabled
         size="large"
         suffix={<Link style={{ color: colorPrimary }} href="/login/email"><EditOutlined /></Link>}
      />
    </Form.Item>

    {companies.length > 1 && <Form.Item
      name="company_id"
      label="Doanh nghiệp"
      rules={[{ required: true }]
      }>
      <Select
        size="large"
        showSearch
        options={companies}
      >
      </Select>
    </Form.Item>}

    <Form.Item
      label="Mật khẩu"
      name="password"
      rules={[{ required: true, message: 'Vui lòng nhập mật khẩu.'}]}
    >
      <Input.Password
        size="large"
      />
    </Form.Item>

    <Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        shape="round"
        block
        disabled={isLoading}
      >
        { isLoading ? <SpinLoading/> : <LoginOutlined />}
        Đăng nhập
      </Button>
    </Form.Item>
  </Form>
  );
}
