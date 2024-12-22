import React from "react"
import { HomeOutlined } from "@ant-design/icons"
import { Breadcrumb as AntBreadcrumb } from "antd"
import { ROUTES } from "@/constants/routes"

type PropsType = {
  items: any
}

const Breadcrumb = ({ items }: PropsType) => {
  const breadcrumbItems = [
    {
      href: ROUTES.DASHBOARD,
      title: <HomeOutlined />,
    },
    ...items
  ]
  return (
    <AntBreadcrumb
      items={breadcrumbItems}
      style={{ marginBottom: 10 }}
    />
  )
}

export default Breadcrumb