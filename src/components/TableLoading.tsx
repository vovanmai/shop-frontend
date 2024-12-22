'use client'
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

const TableLoading = () => {
  return (
    <Spin size="large" style={{ top: "50%"}} indicator={<LoadingOutlined spin />} />
  )
}

export default TableLoading