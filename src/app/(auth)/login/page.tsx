import { Card } from 'antd';
import ComponentLogin from './Login';

export const metadata = {
  title: 'Đăng nhập',
  description: 'Chào mừng bạn đến với ứng dụng.',
};

export default function Login() {
  const title = <h2 style={{ textAlign: "center" }}>Đăng nhập</h2>
  return (
    <Card title={title} bordered={false} className="auth-page" style={{ margin: 'auto', marginTop: 100 }}>
      <ComponentLogin/>
    </Card>
  );
}
