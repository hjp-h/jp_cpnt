import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Typography,
  Divider,
  Space,
  message,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  BellOutlined,
  GlobalOutlined,
  SaveOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface SettingsFormData {
  username: string;
  email: string;
  language: string;
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
  };
}

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 初始设置数据
  const initialValues: SettingsFormData = {
    username: 'hongjiapeng',
    email: 'hongjiapeng@example.com',
    language: 'zh-CN',
    theme: 'light',
    notifications: {
      email: true,
      push: false,
      sms: true,
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
    },
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // 模拟保存操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('保存设置:', values);
      message.success('设置保存成功！');
    } catch (error) {
      message.error('保存失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info('已重置为默认设置');
  };

  return (
    <div>
      <Title level={2}>系统设置</Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSave}
      >
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title={<><UserOutlined /> 个人信息</>} style={{ height: '100%' }}>
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
              </Form.Item>
              
              <Form.Item
                label="邮箱地址"
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="请输入邮箱地址" />
              </Form.Item>
              
              <Form.Item label="语言设置" name="language">
                <Select prefix={<GlobalOutlined />}>
                  <Option value="zh-CN">简体中文</Option>
                  <Option value="en-US">English</Option>
                  <Option value="ja-JP">日本語</Option>
                </Select>
              </Form.Item>
              
              <Form.Item label="主题设置" name="theme">
                <Select>
                  <Option value="light">浅色主题</Option>
                  <Option value="dark">深色主题</Option>
                  <Option value="auto">跟随系统</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title={<><BellOutlined /> 通知设置</>} style={{ height: '100%' }}>
              <Form.Item label="邮件通知" name={['notifications', 'email']} valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              <Text type="secondary">接收重要系统邮件通知</Text>
              
              <Divider />
              
              <Form.Item label="推送通知" name={['notifications', 'push']} valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              <Text type="secondary">接收浏览器推送通知</Text>
              
              <Divider />
              
              <Form.Item label="短信通知" name={['notifications', 'sms']} valuePropName="checked">
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              <Text type="secondary">接收重要事件短信提醒</Text>
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title={<><LockOutlined /> 隐私设置</>}>
              <Form.Item label="个人资料可见性" name={['privacy', 'profileVisible']} valuePropName="checked">
                <Switch checkedChildren="公开" unCheckedChildren="私密" />
              </Form.Item>
              <Text type="secondary">控制其他用户是否可以查看您的个人资料</Text>
              
              <Divider />
              
              <Form.Item label="活动记录可见性" name={['privacy', 'activityVisible']} valuePropName="checked">
                <Switch checkedChildren="公开" unCheckedChildren="私密" />
              </Form.Item>
              <Text type="secondary">控制其他用户是否可以查看您的活动记录</Text>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="安全设置">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="default" block>
                  修改密码
                </Button>
                <Button type="default" block>
                  两步验证设置
                </Button>
                <Button type="default" block>
                  登录设备管理
                </Button>
                <Button type="default" danger block>
                  注销所有设备
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
        
        <Card style={{ marginTop: 24 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              保存设置
            </Button>
            <Button onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default Settings;