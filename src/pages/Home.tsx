import React from "react";
import { Card, Typography, Row, Col } from "antd";
import Button from "../components/Button/Button";

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div>
      <Title level={2}>欢迎来到 JP Component</Title>
      <Button>12212</Button>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card title="组件库" variant="outlined">
            {" "}
            <Paragraph>
              这是一个基于 React 和 TypeScript 的组件库项目， 提供了丰富的 UI
              组件供开发使用。
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card title="技术栈" variant="outlined">
            <Paragraph>
              • React 18
              <br />
              • TypeScript
              <br />
              • Ant Design
              <br />• Vite
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card title="特性" variant="outlined">
            <Paragraph>
              • 现代化的开发体验
              <br />
              • 完整的 TypeScript 支持
              <br />
              • 响应式设计
              <br />• 易于维护和扩展
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
