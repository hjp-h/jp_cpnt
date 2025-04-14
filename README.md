# JP Component

一个基于 React 的 TypeScript 组件库。

## 安装

```bash
npm install @hongjiapeng/jp_cpnt
# 或者
yarn add @hongjiapeng/jp_cpnt
```

## 使用

```jsx
import { Button } from '@hongjiapeng/jp_cpnt';

function App() {
  return (
    <Button type="primary" size="large">
      点击我
    </Button>
  );
}
```

## 组件

### Button 按钮

按钮用于开始一个即时操作。

#### 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | 'primary' \| 'default' \| 'dashed' \| 'text' \| 'link' | 'default' |
| size | 按钮大小 | 'large' \| 'middle' \| 'small' | 'middle' |
| disabled | 是否禁用 | boolean | false |
| onClick | 点击按钮时的回调 | (event) => void | - |

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## 许可证

MIT
