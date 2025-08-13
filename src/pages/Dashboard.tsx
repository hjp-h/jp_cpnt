import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div>
      <Title level={2}>仪表盘</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={11280}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<UserOutlined />}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="订单数量"
              value={9280}
              precision={0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ShoppingCartOutlined />}
              suffix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总收入"
              value={112893}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="¥"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="转化率"
              value={93.5}
              precision={1}
              valueStyle={{ color: '#3f8600' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="项目进度">
            <div style={{ marginBottom: 16 }}>
              <div>React 组件开发</div>
              <Progress percent={75} status="active" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div>TypeScript 集成</div>
              <Progress percent={100} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div>单元测试</div>
              <Progress percent={60} status="active" />
            </div>
            <div>
              <div>文档编写</div>
              <Progress percent={30} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="系统状态">
            <div style={{ marginBottom: 16 }}>
              <div>CPU 使用率</div>
              <Progress percent={45} strokeColor="#52c41a" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div>内存使用率</div>
              <Progress percent={67} strokeColor="#faad14" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div>磁盘使用率</div>
              <Progress percent={23} strokeColor="#52c41a" />
            </div>
            <div>
              <div>网络带宽</div>
              <Progress percent={89} strokeColor="#ff4d4f" />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;