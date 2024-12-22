'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes";

const Dashboard = () => {
  const router = useRouter()
  useEffect(() => {
    router.push(ROUTES.DASHBOARD_ROLE_LIST)
  }, [router])
  return (
    <div>Đang tải...</div>
  )
}

export default Dashboard