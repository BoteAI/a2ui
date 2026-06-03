# a2ui

A2UI 协议的 React 渲染生态，包含协议渲染引擎与自定义组件开发工具集，支持 A2UI v0.8 / v0.9 协议。

---

## 包结构

```
packages/
├── a2ui-render        @boteteam/a2ui-render      协议渲染引擎
└── a2ui-custom-kit    @boteteam/a2ui-custom-kit  自定义组件开发工具集
```

---

## @boteteam/a2ui-render — 协议渲染引擎

**把 A2UI 协议消息 JSON 渲染为 React 页面界面。**

Agent / 后端下发的是描述「界面该怎么长」的结构化消息数组，本包负责将其渲染为可交互界面，覆盖主题样式、事件回调、自定义组件挂载等。

### 核心导出

| 导出名 | 说明 |
|---|---|
| `BaseRenderer` | 核心渲染器组件，接收 messages + 可选注册表 |
| `BoteRenderer` | 博特定制渲染器（基于 BaseRenderer 扩展） |
| `LitSurfaceHost` | 底层 Lit 渲染宿主（高级用法） |
| `A2UI_THEME_PRESETS` | 内置主题预设列表 |
| `loadRemoteA2UICustomRegistry` | 加载单个远程自定义组件 `.mjs` |
| `loadRemoteA2UICustomRegistries` | 批量加载多个远程自定义组件 |
| `inferProtocolVersionFromMessages` | 从消息自动推断协议版本 |
| `useResponsive` / `isMobile` 等 | 响应式工具函数 |

### 快速使用

```tsx
import { BaseRenderer, type A2UIMessage } from '@boteteam/a2ui-render';

const messages: A2UIMessage[] = [ /* 协议消息 */ ];

<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  onAction={({ name, context }) => {
    // 处理按钮等交互事件
  }}
/>
```

携带自定义组件时，将注册表传入 `customComponents`：

```tsx
<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  customComponents={customComponents}
  onAction={handleAction}
/>
```

> 详细文档见 [`packages/a2ui-render/README.md`](./packages/a2ui-render/README.md) 与 [`packages/a2ui-render/styleVars.md`](./packages/a2ui-render/styleVars.md)。

---

## @boteteam/a2ui-custom-kit — 自定义组件开发工具集

**为 A2UI 扩展自定义组件的开发框架与工具集。**

当协议消息中出现业务自定义的组件名时，需要把组件名映射到真正的实现。本包提供类型定义、API 描述、注册表构建、React/原生元素适配器等，减少与渲染层之间的胶水代码。

### 核心导出

| 导出名 | 说明 |
|---|---|
| `defineComponentApi` | 定义组件的 Props API schema |
| `defineRegistryEntry` | 构建单个组件的注册表条目 |
| `defineSimpleRegistryEntry` | 快速构建简单注册表条目 |
| `mergeRegistryEntries` | 合并多个注册表（本地 + 远程） |
| `createReactComponent` | 将 React 组件适配为 A2UI 自定义元素 |
| `createNativeElement` | 将原生 Web Component 适配为 A2UI 自定义元素 |
| `readComponentProps` / `dispatchA2UIAction` 等 | 元素运行时工具 |
| `subscribeV09ComponentUpdates` | 订阅 v0.9 协议组件属性更新 |

### 快速使用

```ts
import {
  defineComponentApi,
  createReactComponent,
  defineRegistryEntry,
  mergeRegistryEntries,
} from '@boteteam/a2ui-custom-kit';

// 1. 定义组件 API
const api = defineComponentApi({
  name: 'MyCard',
  props: { title: { type: 'string' } },
});

// 2. 用 React 组件实现
const element = createReactComponent(({ title }) => <div>{title}</div>);

// 3. 注册并合并
const registry = mergeRegistryEntries(
  defineRegistryEntry({ api, element }),
);

// 4. 传给 BaseRenderer
<BaseRenderer messages={messages} customComponents={registry} />
```

> 详细开发流程见 [`packages/a2ui-custom-kit/DEVELOPMENT_GUIDE.md`](./packages/a2ui-custom-kit/DEVELOPMENT_GUIDE.md)，远程 ESM 部署见 [`REMOTE_ESM_DEVELOPMENT.md`](./packages/a2ui-custom-kit/REMOTE_ESM_DEVELOPMENT.md)。

---

## 两包关系

```
消息 JSON
    │
    ▼
@boteteam/a2ui-render
    │  BaseRenderer 接收 customComponents
    ▼
@boteteam/a2ui-custom-kit
    │  defineRegistryEntry / createReactComponent
    ▼
 业务自定义组件实现
```

- **只渲染标准协议组件** → 只需安装 `@boteteam/a2ui-render`
- **需要自定义组件** → 同时安装两个包，用 `a2ui-custom-kit` 产出注册表，传给 `a2ui-render`
- **自定义组件打成远程 ESM** → 参考 `a2ui-custom-kit` 的远程开发文档

---

## 开发

```bash
# 安装依赖
yarn bs

# 同时监听两个包
yarn watch

# 构建所有包
yarn build

# 发布某个包（自动更新 version 和 gitHead）
yarn pub a2ui-render 0.1.1
yarn pub a2ui-custom-kit 0.1.1
```
