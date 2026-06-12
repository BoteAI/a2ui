# @boteai/a2ui-render

**仓库**：[github.com/BoteAI/a2ui](https://github.com/BoteAI/a2ui)

## 这个包是做什么的

**把 A2UI 协议里的 messages JSON 渲染为可交互的 React 界面。**

Agent 或后端下发描述界面结构与数据绑定的消息数组，本包负责解析、绘制标准 A2UI 组件、主题样式与 `onAction` 回调。只需安装 **`@boteai/a2ui-render`**（及 React 17 peer）即可接入，**不依赖** `@boteai/a2ui-custom-kit` 或 `@boteai/types`。

自定义组件有两种接入方式：

| 方式 | 适用场景 |
|------|----------|
| **`remoteComponentUrls`** | 远程 `.mjs` 已部署到 CDN，传 URL 即可（推荐） |
| **`customComponents`** | 本地静态注册表，或在 `useEffect` 中手动合并远程加载结果 |

自定义组件的**开发**与 ESM 打包见 **`@boteai/a2ui-custom-kit`** 与仓库文档 [`app/public/docs/custom-components-guide.md`](../../app/public/docs/custom-components-guide.md)。

---

## 快速开始

```bash
yarn add @boteai/a2ui-render
```

```tsx
import { BaseRenderer, type A2UIMessage } from '@boteai/a2ui-render';

const messages: A2UIMessage[] = [/* 与 protocolVersion 一致的协议消息 */];

<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  themePreset="conversation"
  onAction={({ name, context }) => {
    /* 按钮、表单等交互 */
  }}
/>
```

---

## 核心 Props（BaseRenderer）

| Prop | 说明 |
|------|------|
| `messages` | A2UI 协议消息数组 |
| `protocolVersion` | `'0.8'` 或 `'0.9'` |
| `themePreset` | 内置主题：`default` / `conversation` / `cyber` / `platformInterconnect` / `deepBlueWisdom` |
| `onAction` | 用户交互回调 |
| `customComponents` | 本地自定义组件注册表，key 与协议 `"component"` 一致 |
| `remoteComponentUrls` | 远程 ESM `.mjs` URL 数组，**内部自动加载并与 `customComponents` 合并** |
| `injectAntdStylesInShadow` | 远程组件使用 antd 时建议开启 |

完整主题变量见同目录 **`styleVars.md`**。

---

## 远程自定义组件（传 URL）

**推荐**：直接把 CDN 上的 `.mjs` 地址传给 `remoteComponentUrls`，无需先 `await` 加载，也无需安装 `@boteai/a2ui-custom-kit`。

```tsx
import { BaseRenderer } from '@boteai/a2ui-render';

<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  remoteComponentUrls={[
    'https://cdn.example.com/DemoNativeElement.mjs',
    'https://cdn.example.com/DemoActionDispatch.mjs',
  ]}
  onAction={handleAction}
/>
```

可与本地注册表同时使用（远程项与 `customComponents` 合并，同名时以后者为准）：

```tsx
<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  customComponents={localRegistry}
  remoteComponentUrls={['https://cdn.example.com/DemoNativeElement.mjs']}
  onAction={handleAction}
/>
```

远程模块须为浏览器可 `import()` 的 **ESM**，并命名导出注册表，默认导出名 `a2uiRemoteRegistry`（也支持 `a2uiCustomRegistry`、`registry`）。

---

## 手动加载远程注册表（高级）

需要在渲染前自行控制加载时机时，使用本包导出的 loader（类型同样从本包导入）：

```ts
import {
  loadRemoteA2UICustomRegistry,
  loadRemoteA2UICustomRegistries,
  type A2UICustomComponentRegistry,
} from '@boteai/a2ui-render';

// 单个 URL
const remotePart = await loadRemoteA2UICustomRegistry(
  'https://cdn.example.com/DemoNativeElement.mjs',
);

// 多个 URL
const merged = await loadRemoteA2UICustomRegistries([
  'https://cdn.example.com/DemoNativeElement.mjs',
  'https://cdn.example.com/DemoActionDispatch.mjs',
]);

const customComponents: A2UICustomComponentRegistry = {
  ...localRegistry,
  ...remotePart,
};
```

```tsx
<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  customComponents={customComponents}
  onAction={handleAction}
/>
```

非默认导出名时：`loadRemoteA2UICustomRegistry(url, { exportName: 'yourExport' })`。

---

## 主要导出

| 导出 | 说明 |
|------|------|
| `BaseRenderer` | 核心渲染器 |
| `BoteRenderer` | 博特扩展渲染器 |
| `LitSurfaceHost` | 底层 Lit 宿主（高级） |
| `A2UI_THEME_PRESETS` / `A2UI_THEME_PRESET_NAMES` | 内置主题 |
| `loadRemoteA2UICustomRegistry` | 加载单个远程 `.mjs` |
| `loadRemoteA2UICustomRegistries` | 批量加载并合并 |
| `inferProtocolVersionFromMessages` | 自动推断 v0.8 / v0.9 |
| `useResponsive` / `isMobile` 等 | 响应式工具 |
| `A2UIMessage` / `A2UICustomComponentRegistry` 等 | 类型定义（本包自带，无需 `@boteai/types`） |
| `a2uiPresetComponentRegistry` | 内置 Preset 组件注册表，可直接传给 `BaseRenderer.customComponents` |
| `a2uiPresetComponentSchemas` | 内置 Preset 组件 JSON Schema（agent 格式），供配置器 / codegen 使用 |

### 内置 Preset 组件（直接 import）

```tsx
import {
  BaseRenderer,
  a2uiPresetComponentRegistry,
  a2uiPresetComponentSchemas,
} from '@boteai/a2ui-render';

<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  customComponents={a2uiPresetComponentRegistry}
  onAction={handleAction}
/>
```

Preset 源码维护在 monorepo 的 `app/src/pages/a2ui-presetComp/`。新增组件：在该目录按模板添加，并在 `manifest.ts` 登记后执行 `yarn build:presets`（或在仓库根目录 `yarn build`，会先构建 preset 再构建各包）。产物输出到本包 `dist/esm/presetComp/`。

Node 脚本（如配置器 codegen）仅需 schema 时，请使用子路径 `@boteai/a2ui-render/preset-schemas`，避免加载渲染器侧的样式资源。

仅需注册表、且需避免与页面代码打包后变量名冲突时，可使用 `@boteai/a2ui-render/preset-registry`。

---

## 使用 antd 的远程组件

A2UI 在嵌套 ShadowRoot 中渲染，全局 `antd.css` 不会自动穿透：

```tsx
<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  remoteComponentUrls={['https://cdn.example.com/YourComponent.mjs']}
  injectAntdStylesInShadow
  onAction={handleAction}
/>
```

远程 bundle **无需** 再 `import 'antd/dist/antd.min.css'`。`Select` 等弹出层建议 `ConfigProvider` + `getPopupContainer` 指向 Shadow 内节点。

---

## 相关文档

- **主题变量**：`styleVars.md`
- **自定义组件开发全流程**：[`app/public/docs/custom-components-guide.md`](../../app/public/docs/custom-components-guide.md)
- **本仓库 Playground**：`app/src/pages/a2ui-playgroup`
