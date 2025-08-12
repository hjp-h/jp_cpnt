import React from 'react';
import { Card, Space, Divider, Row, Col } from 'antd';

const LayoutDemo: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card title="Layout 组件演示" bordered={false}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <h3>自定义 Layout 组件</h3>
            <p>当前页面使用的就是自定义的 Layout 组件，包含侧边栏、头部和内容区域。</p>
          </div>

          <Divider />

          <div>
            <h3>Layout 组件特性</h3>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card size="small" title="响应式设计">
                  <p>支持桌面端和移动端自适应布局</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="侧边栏折叠">
                  <p>可折叠的侧边栏，节省屏幕空间</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="路由集成">
                  <p>与 React Router 深度集成</p>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="主题支持">
                  <p>支持亮色和暗色主题切换</p>
                </Card>
              </Col>
            </Row>
          </div>

          <Divider />

          <div>
            <h3>组件结构</h3>
            <Card size="small">
              <pre style={{ margin: 0, fontSize: '12px' }}>
{`Layout
├── Header (头部导航)
│   ├── Logo
│   ├── 折叠按钮
│   └── 用户信息
├── Sider (侧边栏)
│   ├── 菜单导航
│   └── 折叠控制
└── Content (内容区域)
    └── 页面内容`}
              </pre>
            </Card>
          </div>

          <Divider />

          <div>
            <h3>使用方式</h3>
            <Card size="small">
              <pre style={{ margin: 0, fontSize: '12px' }}>
{`import Layout from './components/Layout/Layout';

function App() {
  return (
    <Layout>
      <YourPageContent />
    </Layout>
  );
}`}
              </pre>
            </Card>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default LayoutDemo;