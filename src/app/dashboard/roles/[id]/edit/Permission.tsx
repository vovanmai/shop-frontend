import { Checkbox, Col } from "antd"
import React from "react";

type ActionType = 'list' | 'edit' | 'create' | 'delete' | 'detail'
interface PermissionItem {
  id: number;
  action: ActionType;
}

type PropsType = {
  permission: PermissionItem
}

const Permission = ({ permission }: PropsType) => {
  const actions = {
    list: 'Danh sách',
    edit: 'Cập nhật',
    create: 'Tạo ',
    delete: 'Xoá',
    detail: 'Chi tiết',
  }

  return (
    <Col xs={12} md={8} lg={4}>
      <Checkbox value={permission.id}>
        { actions[permission.action] }
      </Checkbox>
    </Col>
  )
}

export default Permission