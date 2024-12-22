'use client'
import {Card, Button, Table, Tooltip, Space, theme, Tag } from "antd"
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { getUsers, deleteUser } from '@/api/user/user'
import dayjs from 'dayjs'
import Search from "./Search"
import { removeEmptyFields } from "@/helper/common"
import qs from 'qs'
import withAuth from "@/hooks/withAuth";
import Link from 'next/link'
import { ROUTES } from "@/constants/routes"
import { toast } from 'react-toastify'
import ConfirmModal from "@/components/ConfirmModal"
import Breadcrumb from "@/components/Breadcrumb"
import { useAppSelector} from "../../../store/hooks"
import { selectCurrentUser } from "@/store/user/auth/authSlice";

import type { GetProp, TableProps } from 'antd';
import { USER } from "@/constants/common";
type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
  id: number
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

const Page = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deletedId, setDeletedId] = useState<any>(null)
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false)
  const actions = (
    <Link href={ROUTES.DASHBOARD_USER_CREATE}>
      <Button
        size="large"
        onClick={() => { router.push(ROUTES.DASHBOARD_USER_CREATE) }}
        type="primary"
      >
        <PlusCircleOutlined />Tạo mới
      </Button>
    </Link>
  );

  type SearchDataType = {
    name?: string,
    email?: string,
    created_at_from?: string,
    created_at_to?: string,
    updated_at_from?: string,
    updated_at_to?: string,
  }

  type SortDataType = {
    sort?: string,
    order?: string,
  }

  type QueryParamType = SearchDataType & SortDataType & {
    page?: number,
    per_page?: number,
  }

  const [searchData] = useState<SearchDataType>({
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    created_at_from: searchParams.get('created_at_from') || '',
    created_at_to: searchParams.get('created_at_to') || '',
    updated_at_from: searchParams.get('updated_at_from') || '',
    updated_at_to: searchParams.get('updated_at_to') || '',
  })

  const [queryParams, setQueryParams] = useState<QueryParamType>({
    ...searchData,
    sort: searchParams.get('sort') || '',
    order: searchParams.get('order') || '',
    page: 1,
    per_page: 10,
  })

  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  })

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getUsers(removeEmptyFields(params));
      const { data: responseData } = response;
      setData(responseData.data);
      setPagination({
        current: responseData.current_page,
        pageSize: responseData.per_page,
        total: responseData.total,
      });
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(queryParams)
  }, [queryParams]);

  const handleTableChange: TableProps<DataType>['onChange'] = async (pagination, filters, sorter) => {
    setPagination(pagination)
    const isSorterArray = Array.isArray(sorter);
    const sortField = isSorterArray ? sorter[0]?.field : sorter?.field;
    const sortOrder = isSorterArray ? sorter[0]?.order : sorter?.order;

    const sort = typeof sortField === 'string' ? sortField : '';
    let order = sortOrder ? sortOrder : '';
    order = order ? (order === 'ascend' ? 'asc' : 'desc') : ''

    const params = {
      ...queryParams,
      page: pagination.current,
      per_page: pagination.pageSize,
      sort: sort,
      order: order,
    }
    setQueryParams(params)
    const queryString = qs.stringify(removeEmptyFields(params));
    router.push(`${ROUTES.DASHBOARD_USER_LIST}?${queryString}`)
  }

  const onSearch = async (data: any) => {
    const params = {
      name: data.name,
      email: data.email,
      created_at_from: data.created_at_from,
      created_at_to: data.created_at_to,
      updated_at_from: data.updated_at_from,
      updated_at_to: data.updated_at_to,
    }
    setQueryParams(params)
    const queryString = qs.stringify(removeEmptyFields(params));
    router.push(`${ROUTES.DASHBOARD_USER_LIST}?${queryString}`)
  }

  const getStatusLabel = (status: string) => {
    let color = ''
    let label = ''
    switch (status) {
      case USER.STATUS.ACTIVE:
        color = 'green'
        label = 'Đang hoạt động'
        break;
      case USER.STATUS.INACTIVE:
        color = 'magenta'
        label = 'Vô hiệu hoá'
    }

    return <Tag color={color}>{label}</Tag>
  }

  const currentUser = useAppSelector(selectCurrentUser)
  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      sorter: true,
      render: (text, record) => {
        return (
          <Link style={{ color: colorPrimary }} href={`/dashboard/users/${record.id}/edit`}>{text}</Link>
        )
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      sorter: true,
      render: (text: string) => getStatusLabel(text),
    },
    {
      title: 'Quyền',
      dataIndex: 'role',
      render: (data: any) => {
        return <Tag color="volcano">{data?.name}</Tag>
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      sorter: true,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      sorter: true,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Hành động',
      render: (record) => {
        if (currentUser?.id === record.id) return

        return (
          <Space>
            <Tooltip title="Chỉnh sửa">
              <Link href={`/dashboard/users/${record.id}/edit`}>
                <Button shape="circle" icon={<EditOutlined />} />
              </Link>
            </Tooltip><Tooltip title="">
              <Button onClick={() => {showDeleteConfirm(record.id)}} danger shape="circle" icon={<DeleteOutlined />} />
            </Tooltip>
          </Space>
        )
      },
    },
  ];

  const deleteRecord = async () => {
    try {
      setLoadingDelete(true)
      await deleteUser(deletedId)
      setData(data.filter((item) => item.id !== deletedId))
      setShowConfirmDelete(false)
      toast.success('Xoá thành công!')
    } catch (error: any) {
      toast.error(error.data.message)
    } finally {
      setLoadingDelete(false)
    }
  }

  const showDeleteConfirm = (id: number) => {
    setShowConfirmDelete(true)
    setDeletedId(id)
  };

  return (
    <div>
      <Breadcrumb items={[{title: 'Người dùng'}]} />
      <ConfirmModal
        visible={showConfirmDelete}
        onOk={deleteRecord}
        onCancel={() => setShowConfirmDelete(false)}
        confirmLoading={loadingDelete}
      />
      <Card title="Danh sách người dùng" bordered={false} extra={actions}>
        <Search
          onSearch={onSearch}
          resetForm={() => { setQueryParams({}) }}
          formData={searchData}
        />
        <div>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </Card>
    </div>
  );
}

export default withAuth(Page)
