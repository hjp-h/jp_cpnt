import React from 'react';
import { Card, Space, Button as AntButton, Divider } from 'antd';
import { DownloadOutlined, PoweroffOutlined } from '@ant-design/icons';
import Button from '../../components/Button/Button';

const ButtonDemo: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card title="Button 组件演示" bordered={false}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <h3>自定义 Button 组件</h3>
            <Space wrap>
              <Button>默认按钮</Button>
              <Button type="primary">主要按钮</Button>
              <Button type="dashed">次要按钮</Button>
              <Button disabled>禁用按钮</Button>
            </Space>
          </div>

          <Divider />

          <div>
            <h3>Ant Design Button 组件</h3>
            <Space wrap>
              <AntButton>默认按钮</AntButton>
              <AntButton type="primary">主要按钮</AntButton>
              <AntButton type="dashed">虚线按钮</AntButton>
              <AntButton type="text">文本按钮</AntButton>
              <AntButton type="link">链接按钮</AntButton>
            </Space>
          </div>

          <Divider />

          <div>
            <h3>带图标的按钮</h3>
            <Space wrap>
              <AntButton type="primary" icon={<DownloadOutlined />}>
                下载
              </AntButton>
              <AntButton type="primary" icon={<PoweroffOutlined />} loading>
                加载中
              </AntButton>
              <AntButton type="primary" shape="circle" icon={<DownloadOutlined />} />
              <AntButton type="primary" shape="round" icon={<DownloadOutlined />}>
                下载
              </AntButton>
            </Space>
          </div>

          <Divider />

          <div>
            <h3>按钮尺寸</h3>
            <Space wrap>
              <AntButton type="primary" size="large">
                大号按钮
              </AntButton>
              <AntButton type="primary">
                默认按钮
              </AntButton>
              <AntButton type="primary" size="small">
                小号按钮
              </AntButton>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ButtonDemo;