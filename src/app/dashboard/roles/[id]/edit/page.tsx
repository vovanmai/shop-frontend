'use client'
import {Card, Button, Form, Space, Input } from "antd"
import {UnorderedListOutlined, ClearOutlined, EditOutlined, PlusCircleOutlined} from "@ant-design/icons"
import Link from 'next/link'
import React, {useEffect, useState} from "react"
import withAuth from "@/hooks/withAuth"
import { ROUTES } from "@/constants/routes"
import PermissionGroup from './PermissionGroup'
import { getAll } from "@/api/user/permission"
import { updateRole, getRole } from '@/api/user/role'
import {useRouter, useParams } from "next/navigation"
import { groupBy } from "lodash"
import { toast } from 'react-toastify'
import {ROLE} from "@/constants/common"
import Breadcrumb from "@/components/Breadcrumb"
import SpinLoading from "@/components/SpinLoading";

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
  const params = useParams()
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, any>>({
    name: undefined,
  })
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroupInterface[]>([]);
  const [disabledForm, setDisabledForm] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const onFinish = async (values: any) => {
    const permissionIds = permissionGroups.flatMap(group => group.checkedValues);

    try {
      setLoadingSubmit(true)
      const id = Number(params.id);
      await updateRole(id, {...values, permission_ids: permissionIds})
      toast.success('Cập nhật thành công!')
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
  )

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 17 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      const { data } = await getAll();
      return data
    };

    const fetchRoleDetail = async () => {
      const id = Number(params.id);
      if (!id) return;
      const { data } = await getRole(id);
      return data
    };

    const groupPermissions = (permissions: any[], checkedPermissions: any) => {
      checkedPermissions = groupBy(checkedPermissions, 'group')
      const groups = groupBy(permissions, 'group');
      return Object.keys(groups).map((group) => ({
        group,
        permissions: groups[group].map((item: any) => ({
          id: item.id,
          action: item.action,
        })),
        checkedValues: checkedPermissions[group] ? checkedPermissions[group].map((item: any) => item.id) : [],
      }));
    };

    const initializeData = async () => {
      try {
        setLoading(true)
        const role = await fetchRoleDetail();
        setDisabledForm(role?.type === ROLE.TYPE.DEFAULT)
        form.setFieldsValue({ name: role.name });
        const permissions = await fetchPermissions();
        const groupedPermissions = groupPermissions(permissions, role.permissions);
        setPermissionGroups(groupedPermissions as PermissionGroupInterface[]);
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    };

    initializeData();
  }, [params.id, form]);

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
          disabled={disabledForm}
          {...layout}
          form={form}
          onFinish={onFinish}
          style={{ width: '100%' }}
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập.' }]}
            validateStatus={ errors.name ? 'error' : undefined}
            help={errors.name ? errors.name : undefined}
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
              <Button size="large" disabled={disabledForm ? disabledForm : loadingSubmit} type="primary" htmlType="submit">
                { loadingSubmit ? <SpinLoading /> : <EditOutlined /> }
                Cập nhật
              </Button>
              <Button size="large" htmlType="button" onClick={onReset}>
                <ClearOutlined />Xoá</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default withAuth(ListRoles)
