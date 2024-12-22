'use client'
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

const SpinLoading = () => {
  return (
    <Spin className="loading" indicator={<LoadingOutlined spin />} />
  )
}

export default SpinLoading