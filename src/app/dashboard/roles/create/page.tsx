'use client'
import {Card, Button, Form, Space, Input } from "antd"
import { UnorderedListOutlined, ClearOutlined, PlusCircleOutlined } from "@ant-design/icons"
import Link from 'next/link'
import React, {useEffect, useState} from "react"
import withAuth from "@/hooks/withAuth"
import { ROUTES } from "@/constants/routes"
import PermissionGroup from './PermissionGroup'
import { getAll } from "@/api/user/permission"
import { createRole } from '@/api/user/role'
import {useRouter} from "next/navigation"
import { groupBy } from "lodash"
import { toast } from 'react-toastify'
import SpinLoading from "@/components/SpinLoading"
import Breadcrumb from "@/components/Breadcrumb"

type ActionType = 'list' | 'edit' | 'create' | 'delete' | 'detail'
interface PermissionItem {
  id: number;
  action: ActionType;
}

interface PermissionGroupInterface {
  group: 'user' | 'role';
  permissions: PermissionItem[];
  checkedValues: number[],
}

const ListRoles = () => {
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, any>>({})
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroupInterface[]>([]);

  const onFinish = async (values: any) => {
    const permissionIds = permissionGroups.flatMap(group => group.checkedValues);

    try {
      setLoadingSubmit(true)
      await createRole({...values, permission_ids: permissionIds})
      toast.success('Tạo thành công!')
      router.push(ROUTES.DASHBOARD_ROLE_LIST)
    } catch (error: any) {
      setErrors(error?.data?.errors as Record<string, string>);
    } finally {
      setLoadingSubmit(false)
    }
  };

  const onReset = () => {
    form.resetFields();
    setErrors({})
    setPermissionGroups(permissionGroups.map(item => ({...item, checkedValues: []})))
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
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  useEffect(() => {
    const getPermissions = async () => {
      try {
        setLoading(true)
        const response = await getAll();
        let groups: any = groupBy(response.data, 'group');
        groups = Object.keys(groups).map((group) => {
          const permissions = groups[group].map((item: any) => {
            return {
              id: item.id,
              action: item.action,
            } as any
          })
          return {
            group: group,
            permissions: permissions,
            checkedValues: [],
          } as any
        })
        setPermissionGroups(groups)
      } catch (error) {
        console.error("Error fetching permissions", error);
      } finally {
        setLoading(false)
      }
    };
    getPermissions();
  }, []);

  const updatePermissionGroup = (index: number, updatedData: any) => {
    setPermissionGroups(prevPermissionGroups => {
      const updatedPermissionGroups = [...prevPermissionGroups]

      updatedPermissionGroups[index] = {
        ...updatedPermissionGroups[index],
        ...updatedData
      };

      return updatedPermissionGroups
    });
  };

  return (
    <div>
      <Breadcrumb items={[{title: 'Quyền'}]} />
      <Card title="Tạo mới quyền" bordered={false} extra={actions}>
        <Form
          {...layout}
          form={form}
          onFinish={onFinish}
          style={{ width: '100%' }}
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập.' }]}
            validateStatus={ errors?.name ? 'error' : undefined}
            help={errors?.name ? errors?.name : undefined}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item label="Quyền">
            <div style={{ border: "1px solid #d9d9d9", padding: 15, borderRadius: 8}}>
              { loading && (
                <div>Đang tải...</div>
              )}
              {!loading && permissionGroups.map((item, index) => {
                return <PermissionGroup
                  key={index}
                  permissionGroup={item}
                  groupIndex={index}
                  updatePermissionGroup={updatePermissionGroup}
                />
              })}
            </div>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Space>
              <Button size="large" disabled={loadingSubmit} type="primary" htmlType="submit">
                { loadingSubmit ? <SpinLoading /> : <PlusCircleOutlined /> }
                Tạo
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

export default withAuth(ListRoles)
