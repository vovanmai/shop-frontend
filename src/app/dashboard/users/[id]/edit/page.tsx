'use client'

import {Card, Button, Form, Space, Input, Select} from "antd"
import { UnorderedListOutlined, ClearOutlined, PlusCircleOutlined } from "@ant-design/icons"
import Link from 'next/link'
import React, {useEffect, useState} from "react"
import withAuth from "@/hooks/withAuth"
import { ROUTES } from "@/constants/routes"
import { getAll } from "@/api/user/role"
import { updateUser } from '@/api/user/user'
import {useParams, useRouter} from "next/navigation"
import { toast } from 'react-toastify'
import SpinLoading from "@/components/SpinLoading"
import Breadcrumb from "@/components/Breadcrumb"
import { validateMessages } from "@/helper/common";
import {getUser} from "../../../../../api/user/user";

type RoleType = {
  value: number,
  label: string
}

const Page = () => {
  const router = useRouter()
  const params = useParams()
  const [errors, setErrors] = useState<Record<string, any>>({})
  const [form] = Form.useForm();
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [roles, setRoles] = useState<RoleType[]>([]);

  const onFinish = async (values: any) => {
    try {
      setLoadingSubmit(true)
      const id = Number(params.id)
      await updateUser(id, values)
      toast.success('Cập nhật thành công!')
      router.push(ROUTES.DASHBOARD_USER_LIST)
    } catch (error: any) {
      setErrors(error?.data?.errors as Record<string, string>);
    } finally {
      setLoadingSubmit(false)
    }
  };

  const onReset = () => {
    form.resetFields();
    setErrors({})
  };
  const actions = (
    <Link href={ROUTES.DASHBOARD_ROLE_LIST}>
      <Button
        size="large"
        type="primary"
      >
        <UnorderedListOutlined />Danh sách
      </Button>
    </Link>
  );

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 12 },
  };

  const tailLayout = {
    wrapperCol: { offset: 5, span: 12 },
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await getAll()
        setRoles(data.map((item: any) => {
          return {
            value: item.id,
            label: item.name,
          }
        }))
      } catch (error) {
        console.error("Error fetching", error);
      }
    };

    const fetchUser = async (id: any) => {
      try {
        const { data } = await getUser(id)
        form.setFieldsValue({
          name: data.name,
          email: data.email,
          role_id: Number(data.role_id),
        });
      } catch (error) {
        console.error("Error fetching", error);
      }
    };

    const initData = async () => {
      const id = params?.id
      if (id) {
        await fetchUser(id)
        // Promise.all([fetchRoles(), fetchUser()])
        await fetchRoles()
      }
    }
    initData()
  }, [params.id, form]);


  const rules: any = {
    name: [
      { required: true },
      { max: 255 },
    ],
    email: [
      { required: true },
      { type: 'email' },
      { max: 255 },
    ],
    password: [
      { min: 6 },
    ],
    password_confirmation: [
      { min: 6 },
      ({ getFieldValue }: {getFieldValue: any}) => ({
        validator(_: any, value: any) {
          if (getFieldValue('password')) {
            if (!value) {
              return Promise.reject(new Error('Vui lòng nhập.'))
            }

            if (getFieldValue('password') !== value) {
              return Promise.reject(new Error('Mật khẩu không khớp.'));
            }
          }
          return Promise.resolve()
        },
      }),
    ],
    role_id: [
      { required: true },
    ],
  }


  return (
    <div>
      <Breadcrumb items={[{title: 'Người dùng'}]} />
      <Card title="Tạo mới quyền" bordered={false} extra={actions}>
        <Form
          validateMessages={validateMessages}
          {...layout}
          form={form}
          onFinish={onFinish}
          style={{ width: '100%' }}
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={rules.name}
            validateStatus={ errors?.name ? 'error' : undefined}
            help={errors?.name ? errors?.name : undefined}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={rules.email}
            validateStatus={ errors?.email ? 'error' : undefined}
            help={errors?.email ? errors?.email : undefined}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={rules.password}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            label="Xác nhận mật khẩu"
            rules={rules.password_confirmation}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            name="role_id"
            label="Quyền"
            rules={rules.role_id}>
            <Select
              size="large"
              showSearch
              options={roles}
            >
            </Select>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Space>
              <Button size="large" disabled={loadingSubmit} type="primary" htmlType="submit">
                { loadingSubmit ? <SpinLoading /> : <PlusCircleOutlined /> }Cập nhật
              </Button>
              <Button size="large" htmlType="button" onClick={onReset}>
                <ClearOutlined />
                Xoá
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default withAuth(Page)
