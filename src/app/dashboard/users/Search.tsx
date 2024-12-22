import { Button, Col, Form, Input, Row, Space, theme } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import RangeDatePicker from '@/components/RangeDatePicker';
import {ROUTES} from "@/constants/routes";

type PropsType = {
  formData: {
    name?: string,
    email?: string,
    created_at_from?: string,
    created_at_to?: string,
    updated_at_from?: string,
    updated_at_to?: string
  },
  onSearch: (values: any) => void,
  resetForm: () => void
};

const Search = ({ formData, onSearch, resetForm }: PropsType) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { token: { colorPrimary } } = theme.useToken();

  const [expand, setExpand] = useState(false);

  useEffect(() => {
    if (formData) {
      form.setFieldsValue({
        name: formData.name,
        email: formData.email,
        created_at_from: formData.created_at_from ? dayjs(formData.created_at_from) : null,
        created_at_to: formData.created_at_to ? dayjs(formData.created_at_to) : null,
        updated_at_from: formData.updated_at_from ? dayjs(formData.updated_at_from) : null,
        updated_at_to: formData.updated_at_to ? dayjs(formData.updated_at_to) : null,
      });
    }
  }, [formData, form]);

  const formatDates = (values: any) => {
    ['created_at_from', 'created_at_to', 'updated_at_from', 'updated_at_to'].forEach((field) => {
      if (values[field]) {
        values[field] = dayjs(values[field]).format('YYYY-MM-DD HH:mm:ss');
      }
    });
  };

  const onSubmit = (values: any) => {
    formatDates(values);
    onSearch(values);
  };

  const clearForm = () => {
    form.resetFields();
    router.push(ROUTES.DASHBOARD_USER_LIST);
    resetForm();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} style={{ padding: '0px 0px 24px 0px' }}>
      <Row gutter={30}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="name" label="Tên">
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="email" label="Email">
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Ngày tạo">
            <RangeDatePicker fromName="created_at_from" toName="created_at_to" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="Ngày cập nhật">
            <RangeDatePicker fromName="updated_at_from" toName="updated_at_to" />
          </Form.Item>
        </Col>
      </Row>
      <div style={{ textAlign: 'right' }}>
        <Space size="small">
          <Button size="large" type="primary" htmlType="submit">
            <SearchOutlined /> Tìm kiếm
          </Button>
          <Button size="large" onClick={clearForm}>
            <ClearOutlined /> Xoá
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default Search;
