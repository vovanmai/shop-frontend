import { Layout } from "antd";
const { Footer } = Layout;

const LayoutFooter = () => {
  return (
    <Footer style={{ textAlign: 'center' }}>
      XDCorp ©{new Date().getFullYear()} Created by Lionel Vo
    </Footer>
  )
}

export default LayoutFooter