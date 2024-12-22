'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation"
import { ROUTES } from "../constants/routes";

const IndexPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.push(ROUTES.DASHBOARD_USER_LIST)
  }, [router])
  return (
    <div>Đang tải...</div>
  )
}

export default IndexPage