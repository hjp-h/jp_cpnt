import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Input,
  Card,
  Avatar,
  Popconfirm,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Search } = Input;

interface UserData {
  key: string;
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

const Users: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  
  // 模拟用户数据
  const userData: UserData[] = [
    {
      key: '1',
      id: 'U001',
      name: '张三',
      email: 'zhangsan@example.com',
      role: '管理员',
      status: 'active',
    },
    {
      key: '2',
      id: 'U002',
      name: '李四',
      email: 'lisi@example.com',
      role: '编辑者',
      status: 'active',
    },
    {
      key: '3',
      id: 'U003',
      name: '王五',
      email: 'wangwu@example.com',
      role: '查看者',
      status: 'inactive',
    },
    {
      key: '4',
      id: 'U004',
      name: '赵六',
      email: 'zhaoliu@example.com',
      role: '编辑者',
      status: 'active',
    },
  ];

  const columns: ColumnsType<UserData> = [
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (_, record) => (
        <Avatar icon={<UserOutlined />} src={record.avatar} />
      ),
    },
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toString().toLowerCase()) ||
        record.email.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let color = 'blue';
        if (role === '管理员') color = 'red';
        if (role === '编辑者') color = 'orange';
        if (role === '查看者') color = 'green';
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '活跃' : '非活跃'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: UserData) => {
    console.log('编辑用户:', record);
    // 这里可以打开编辑模态框
  };

  const handleDelete = (key: string) => {
    console.log('删除用户:', key);
    // 这里可以实现删除逻辑
  };

  const handleAdd = () => {
    console.log('添加新用户');
    // 这里可以打开添加用户模态框
  };

  return (
    <div>
      <Title level={2}>用户管理</Title>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Search
            placeholder="搜索用户姓名或邮箱"
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            style={{ width: 300 }}
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加用户
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={userData}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default Users;