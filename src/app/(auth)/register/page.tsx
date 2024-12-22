import { Card } from 'antd';
// import RegisterComponent from '@/components/Register';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login pape",
};


export default function Register() {
  const title = <h2 style={{ textAlign: "center" }}>Đăng ký</h2>

  return (
    <Card title={title} bordered={false} style={{ width: 700, margin: 'auto', marginTop: 200 }}>
      {/*<RegisterComponent/>*/}
    </Card>
  );
}
