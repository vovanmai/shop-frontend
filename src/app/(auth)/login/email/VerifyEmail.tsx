'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { Button, Form, Input, Spin } from 'antd';
import {
  LoginOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { getCompanies } from '@/api/user/auth'
import { useAppDispatch } from '@/store/hooks'
import { setCompanies, setEmail } from '@/store/user/auth/authSlice'
import SpinLoading from '@/components/SpinLoading'

export default function VerifyEmail() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      router.push('/dashboard')
    }
  }, [router])

  const onFinish = async (values: any) => {
    setIsLoading(true)
    try {
      const response = await getCompanies(values)
      if (response.data.length > 0) {
        dispatch(setCompanies(response.data))
        dispatch(setEmail(values.email))
        router.push('/login')
      } else {
        toast.error('Email không tồn tại.')
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  };

  const onFinishFailed = async (errorInfo: any) => {
  };
  
  return (
    <Form
      form={form}
      name="login-form"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      style={{ maxWidth: 600 }}
      initialValues={{ }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
  >
    <Form.Item
      label="Email"
      name="email"
      // hasFeedback
      rules={[
        { required: true, message: 'Vui lòng nhập.'},
        { type: 'email', message: 'Email không đúng định dạng.'},
      ]}
    >
       <Input
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
