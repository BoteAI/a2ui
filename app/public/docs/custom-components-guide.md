# A2UI Custom Component Development Guide

本文以 **`app/src/pages/a2ui-remote`** 下的四个示例组件为准，说明从 API 定义、Element 实现、注册合并，到远程 ESM 打包与运行时加载的完整开发流程。完整 kit API 见 [@bote/a2ui-custom-kit API 参考](#bote-a2ui-custom-kit-api-参考)。

| 示例 | 组件名 | 演示能力 | kit API |
|------|--------|----------|---------|
| [DemoNativeElement](#1-demonativeelement原生-dom) | `DemoNativeElement` | 原生 DOM 渲染，无 React 运行时 | `createNativeElement` |
| [DemoReactComponent](#2-demoreactcomponentreact-桥接) | `DemoReactComponent` | JSX 写视图，对外仍是 CustomElement | `createReactComponent` |
| [DemoStyledPanel](#3-demostyledpanelshadow-内样式) | `DemoStyledPanel` | Less 编译 CSS 注入 ShadowRoot | `ensureComponentStyles` |
| [DemoActionDispatch](#4-demoactiondispatchaction-派发) | `DemoActionDispatch` | 协议声明 action vs 代码内派发 | `dispatchDeclaredAction` / `dispatchA2UIAction` |


## 目录约定

在 **`app/src/pages/a2ui-remote`** 下按组件名新建目录：

```
app/src/pages/a2ui-remote/YourComponent
  api.ts          # 协议 API（defineComponentApi）
  element.ts(x)   # 组件实现
  index.ts        # 导出 a2uiRemoteRegistry
  index.less      # 可选，Shadow 内样式
```

**禁止**与官方 basic catalog 组件同名（`Text`、`Button`、`Column` 等）。

### 复杂 UI 的推荐分层（antd、表单、级联等）

当组件逻辑较重时，将 **标准 React UI** 与 **A2UI 桥接** 拆开：

```
YourComponent/
  api.ts
  YourWidget.tsx      # 普通受控 React 组件（value / onChange）
  useYourBinding.ts   # path 读写、action 派发
  element.tsx         # 薄桥接：ensureComponentStyles + return <YourWidgetHost />
  index.ts
  index.less
```

要点：`createReactComponent` 的 render 回调 **不是 React 函数组件**，不能在回调里直接写 `useState` / `useEffect`；Hooks 应放在独立的 `XxxHost` 组件或 `useXxxBinding` 中。

---

## 四个示例组件详解

### 1. DemoNativeElement：原生 DOM

**适用**：轻量标签、徽章、简单展示，bundle 体积更小。

**api.ts**

```ts
import { z } from 'zod';
import { defineComponentApi, DynString } from '@bote/a2ui-custom-kit';

export const DemoNativeElementApi = defineComponentApi({
  name: 'DemoNativeElement',
  shape: {
    label: DynString,
    tone: z.enum(['default', 'success', 'warning']).optional(),
  },
});
```

**element.ts**

```ts
import { createNativeElement, readComponentProps, readStringProp } from '@bote/a2ui-custom-kit';

export const DemoNativeElementElement = createNativeElement('DemoNativeElementHost', {
  render(host) {
    const props = readComponentProps(host);
    const label = readStringProp(props, 'label', 'Native Tag');
    const tone = readStringProp(props, 'tone', 'default');

    host.replaceChildren();
    const tag = document.createElement('span');
    tag.textContent = label;
    // … 按 tone 设置样式
    host.appendChild(tag);
  },
});
```

**要点**

- `connectedCallback` 与 props 更新由 kit 自动订阅，无需手写。
- 用 `readComponentProps` / `readStringProp` 读取协议字段。

源码：`app/src/pages/a2ui-remote/DemoNativeElement/`

---

### 2. DemoReactComponent：React 桥接

**适用**：复杂 JSX 布局、复用现有 React 组件。

**api.ts**

```ts
export const DemoReactComponentApi = defineComponentApi({
  name: 'DemoReactComponent',
  shape: {
    title: DynString,
    subtitle: DynString.optional(),
    align: z.enum(['left', 'center']).optional(),
  },
});
```

**element.tsx**

```tsx
import { createReactComponent, ensureComponentStyles } from '@bote/a2ui-custom-kit';
import { DemoReactComponentApi } from './api';
import styles from './index.less';

export const DemoReactComponentElement = createReactComponent(
  DemoReactComponentApi,
  ({ props, host }) => {
    ensureComponentStyles(host, 'demo-react-component', styles);

    const title = String(props.title ?? 'React 组件');
    const subtitle = props.subtitle != null ? String(props.subtitle) : '';

    return (
      <div className="demo-react-component">
        <strong>{title}</strong>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    );
  },
);
```

**要点**

- 第一个参数传入 `ComponentApi`，props 按 schema 自动推断。
- kit 负责 React mount / unmount / props 同步。
- render 回调内 **不可直接使用 Hooks**；需要 Hooks 时拆成独立 Host 组件。

源码：`app/src/pages/a2ui-remote/DemoReactComponent/`

---

### 3. DemoStyledPanel：Shadow 内样式

**适用**：需要 Less / CSS 类名样式的组件。

A2UI 自定义组件运行在 **Shadow DOM** 内，页面全局 CSS 无法穿透。须用 `ensureComponentStyles(host, styleKey, css)` 将 Less 编译结果注入当前 ShadowRoot；`styleKey` 保证同一 Shadow 内只注入一次。

**element.ts**

```ts
import { createNativeElement, ensureComponentStyles, readComponentProps, readStringProp } from '@bote/a2ui-custom-kit';
import styles from './index.less';

export const DemoStyledPanelElement = createNativeElement('DemoStyledPanelHost', {
  render(host) {
    ensureComponentStyles(host, 'demo-styled-panel', styles);

    const props = readComponentProps(host);
    const title = readStringProp(props, 'title', 'Styled Panel');
    // … 使用 className，样式在 Shadow 内生效
  },
});
```

**index.less** 按 BEM 写法组织，构建时 Umi / esbuild-less-plugin 会编译为 CSS 字符串。

源码：`app/src/pages/a2ui-remote/DemoStyledPanel/`

---

### 4. DemoActionDispatch：Action 派发

**适用**：按钮点击、表单提交等需要回传业务层的交互。

两种派发方式：

| API | 动作来源 | 典型场景 |
|-----|----------|----------|
| `dispatchDeclaredAction(host)` | 协议 JSON 的 `props.action` | Agent 配置点击行为，与官方 Button 一致 |
| `dispatchA2UIAction(host, { name, context })` | 组件代码写死 | 固定业务逻辑、调试 |

**api.ts**

```ts
import { ActionSchema, defineComponentApi, DynString } from '@bote/a2ui-custom-kit';

export const DemoActionDispatchApi = defineComponentApi({
  name: 'DemoActionDispatch',
  shape: {
    label: DynString,
    action: ActionSchema.optional(),
  },
});
```

**element.tsx**

```tsx
<button
  type="button"
  disabled={!props.action}
  onClick={() => dispatchDeclaredAction(host)}
>
  协议 action
</button>

<button
  type="button"
  onClick={() =>
    dispatchA2UIAction(host, {
      name: 'demo_action_imperative',
      context: { source: 'DemoActionDispatch' },
    })
  }
>
  代码 action
</button>
```

**协议 JSON 示例**

```json
{
  "component": "DemoActionDispatch",
  "label": "左键走协议 action，右键走代码派发",
  "action": {
    "event": {
      "name": "demo_declared_action",
      "context": {
        "source": "showcase",
        "via": "dispatchDeclaredAction"
      }
    }
  }
}
```

也支持扁平写法：`{ "action": { "name": "...", "context": { ... } } }`。`context` 中的 `{ "path": "/xxx" }` 会在派发前自动解析。

**页面侧接收**

```tsx
<BaseRenderer
  onAction={({ name, context }) => {
    if (name === 'demo_declared_action') { /* … */ }
    if (name === 'demo_action_imperative') { /* … */ }
  }}
/>
```

> **注意**：`dispatchDeclaredAction` 只处理带 `event` 或扁平 `name` 的 action，不包含 `functionCall` 形态；若协议使用 `functionCall`，需在组件内自行读取 `props.action` 处理。

源码：`app/src/pages/a2ui-remote/DemoActionDispatch/`

---

## @bote/a2ui-custom-kit API 参考

所有 API 从主入口 `@bote/a2ui-custom-kit` 导出。远程 ESM 打包见文末 [子路径打包入口](#子路径打包入口)。

### API 总览

| API | 分类 | 说明 | 四个 Demo 是否用到 |
|-----|------|------|-------------------|
| `defineComponentApi` | Schema | 声明组件名与 Zod props schema，产出 `ComponentApi` | 全部 |
| `componentApiToJsonSchema2019` | Schema | 将 `ComponentApi` 转为 JSON Schema 2019-09，供 Agent catalog | 间接（经 `defineRegistryEntry`） |
| `DynString` | Schema | 动态字符串：字面量 / `{ path }` / functionCall，与官方 Catalog 一致 | DemoNativeElement、DemoReactComponent、DemoStyledPanel、DemoActionDispatch |
| `DynamicValueSchema` | Schema | 动态值：string / number / boolean / array / path / functionCall | 可选，复杂 props |
| `ActionSchema` | Schema | 官方 `Action` 类型：`event` 或 `functionCall` | DemoActionDispatch |
| `ComponentIdSchema` | Schema | 子组件 ID 字符串 | 容器类组件可选 |
| `ChildListSchema` | Schema | 静态子 ID 列表或模板 `{ componentId, path }` | 容器类组件可选 |
| `defineRegistryEntry` | 注册表 | `ComponentApi` + 元素构造器 → 带 schema 的注册项 | 全部 |
| `defineSimpleRegistryEntry` | 注册表 | 无 Zod schema 的简易注册 | — |
| `mergeRegistryEntries` | 注册表 | 合并多份注册表片段 | 全部 |
| `createNativeElement` | 工厂 | 原生 DOM 自定义元素，自动订阅 props 更新 | DemoNativeElement、DemoStyledPanel |
| `createReactComponent` | 工厂 | React 桥接自定义元素，自动 mount / 更新 | DemoReactComponent、DemoActionDispatch |
| `ensureComponentStyles` | 样式 | 向 ShadowRoot 注入 CSS（同 key 只注入一次） | DemoReactComponent、DemoStyledPanel、DemoActionDispatch |
| `readComponentProps` | 运行时 | 读取引擎归一化后的 `host.componentProps` | DemoNativeElement、DemoStyledPanel |
| `readStringProp` | 运行时 | 从 props 读字符串，带默认值 | DemoNativeElement、DemoStyledPanel |
| `readNumberProp` | 运行时 | 从 props 读数字，带默认值 | — |
| `readBoundPath` | 运行时 | 从 `{ path }` 绑定对象提取 JSON Pointer | 表单类组件 |
| `resolveBoundValue` | 运行时 | 解析 DynamicString / path，读 DataModel 当前值 | 表单类组件 |
| `writeBoundValue` | 运行时 | 写入 DataModel 指定 path | 表单类组件 |
| `dispatchDeclaredAction` | Action | 读取 `props.action` 并派发，与官方 Button 一致 | DemoActionDispatch |
| `dispatchA2UIAction` | Action | 代码内手写 action 名与 context | DemoActionDispatch |
| `subscribeV09ComponentUpdates` | 生命周期 | 订阅 v0.9 `componentModel.onUpdated` | 工厂内部使用，高级场景可手动调用 |
| `runAfterPropsReady` | 生命周期 | connected 时立即 + microtask 再执行一次 render | 工厂内部使用，高级原生组件可手动调用 |

### 类型一览

| 类型 | 说明 |
|------|------|
| `ComponentApi` | `{ name: string; schema: ZodObject }`，由 `defineComponentApi` 产出 |
| `A2UICustomElementHost` | 自定义元素实例：`componentProps`、`context`（dataContext / dispatchAction 等） |
| `A2UIV09ElementContext` | 引擎注入的 v0.9 上下文：`dataContext`、`componentModel`、`dispatchAction` |
| `A2UIDeclaredAction` | 协议 action 结构：`event.name` 或扁平 `name` + `context` |
| `A2UIActionDetail` | `dispatchA2UIAction` 入参：`{ name, context? }` |
| `A2UIActionPayload` | 页面 `onAction` 收到的扁平结构 |
| `A2UICustomElementDefinition` | 注册表单项：构造器，或 `{ elementCtor, tagName?, schema? }` |
| `A2UICustomComponentRegistry` | `Record<string, A2UICustomElementDefinition>`，传给 `BaseRenderer.customComponents` |
| `ReactA2UICustomRenderProps<A>` | `createReactComponent` 回调参数：`{ props, host }` |
| `NativeElementLifecycle` | `createNativeElement` 配置：`render`、可选 `onConnect` / `onDisconnect` |

---

### Schema 与 API 定义

| API | 签名 / 用法 | 说明 |
|-----|-------------|------|
| **`defineComponentApi`** | `defineComponentApi({ name, shape }) → ComponentApi` | `name` 与协议 `"component"` 一致；`shape` 为 Zod 字段对象，内置 `.strict()` |
| **`componentApiToJsonSchema2019`** | `componentApiToJsonSchema2019(api) → Record<string, unknown>` | 单独导出 JSON Schema；`defineRegistryEntry` 已自动调用 |
| **`DynString`** | Zod schema，等价于 `DynamicStringSchema` | Agent 可绑 path 的字符串字段，协议写 `{ "path": "/foo" }` 或字面量 |
| **`DynamicValueSchema`** | Zod schema | 任意动态值：字面量、path、functionCall；用于非字符串 props |
| **`ActionSchema`** | Zod schema | 点击/提交等行为声明；配合 `dispatchDeclaredAction` 使用 |
| **`ComponentIdSchema`** | Zod schema | 单个子组件 ID |
| **`ChildListSchema`** | Zod schema | 静态 `string[]` 或动态列表模板 `{ componentId, path }` |

**示例**

```ts
import { z } from 'zod';
import {
  defineComponentApi,
  DynString,
  DynamicValueSchema,
  ActionSchema,
  ChildListSchema,
} from '@bote/a2ui-custom-kit';

export const YourComponentApi = defineComponentApi({
  name: 'YourComponent',
  shape: {
    title: DynString,
    count: DynamicValueSchema.optional(),
    action: ActionSchema.optional(),
    children: ChildListSchema.optional(),
    tone: z.enum(['a', 'b']).optional(),
  },
});
```

**规则**

1. 需要 DataModel 绑定的字段用 **`DynString`** 或 **`DynamicValueSchema`**，协议 JSON 写 `{ "path": "/xxx" }`。
2. 需要 Agent 配置点击行为时，增加 **`action: ActionSchema.optional()`**，交互处调用 **`dispatchDeclaredAction(host)`**。
3. `name` 与消息里 `"component": "YourComponent"` **完全一致**。
4. 注册时 `defineRegistryEntry` 会自动附带 JSON Schema，供 Agent catalog 使用。

参考：[A2UI Custom Catalog](https://a2ui-composer.ag-ui.com/custom-catalog/catalog-components)

---

### 注册表构建

| API | 签名 | 返回值 | 说明 |
|-----|------|--------|------|
| **`defineRegistryEntry`** | `(api, elementCtor, options?) → Record<string, A2UICustomElementDefinition>` | 单组件注册片段，key 为 `api.name` | 自动附带 JSON Schema；`options.tagName` 可覆盖自定义标签名 |
| **`defineSimpleRegistryEntry`** | `(name, elementCtor, options?) → Record<...>` | 单组件注册片段 | 无 Zod 时快速注册；可手动传 `options.schema` |
| **`mergeRegistryEntries`** | `(...entries) → A2UICustomComponentRegistry` | 合并后的完整注册表 | 本地多组件、本地 + 远程合并均用此函数 |

```ts
import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';

export const a2uiRemoteRegistry = mergeRegistryEntries(
  defineRegistryEntry(YourComponentApi, YourComponentElement),
  defineRegistryEntry(AnotherApi, AnotherElement),
);
```

---

### 元素工厂

| API | 签名 | 说明 |
|-----|------|------|
| **`createNativeElement`** | `(displayName, { render, onConnect?, onDisconnect? }) → CustomElementConstructor` | 原生 DOM 实现；自动 `runAfterPropsReady` + `subscribeV09ComponentUpdates` |
| **`createReactComponent`** | `(api, ({ props, host }) => JSX) → CustomElementConstructor` | React 桥接；**render 回调不是 React 组件，不可直接写 Hooks** |

**`createNativeElement` 生命周期**

| 回调 | 时机 |
|------|------|
| `onConnect(host)` | `connectedCallback`，可选 |
| `render(host)` | 首次连接 + 每次 props 更新 |
| `onDisconnect(host)` | `disconnectedCallback`，可选 |

**`createReactComponent` 回调参数 `ReactA2UICustomRenderProps`**

| 字段 | 类型 | 说明 |
|------|------|------|
| `props` | `z.infer<api.schema>` | 引擎归一化后的组件 props |
| `host` | `A2UICustomElementHost` | 自定义元素实例，用于样式注入、action、数据绑定 |

复杂 UI 需 Hooks 时：拆独立 `XxxHost` 函数组件，在 render 回调里 `return <XxxHost host={host} apiProps={props} />`。

---

### 运行时 — Props 读取

在 `createNativeElement` 的 `render(host)` 或 `createReactComponent` 回调中使用。

| API | 签名 | 说明 |
|-----|------|------|
| **`readComponentProps`** | `(host) → Record<string, unknown>` | 读取 `host.componentProps`，无则 `{}` |
| **`readStringProp`** | `(props, key, fallback?) → string` | 读字符串 prop，`null/undefined` 时返回 `fallback`（默认 `''`） |
| **`readNumberProp`** | `(props, key, fallback?) → number` | 读数字 prop，非法时返回 `fallback`（默认 `0`） |

```ts
const props = readComponentProps(host);
const label = readStringProp(props, 'label', 'Default');
const size = readNumberProp(props, 'size', 12);
```

---

### 运行时 — 数据绑定

表单、级联等需读写 Surface **DataModel** 时使用。`api.ts` 中对应字段须为 **`DynString`** / **`DynamicValueSchema`**，协议写 `{ "path": "/xxx" }`。

| API | 签名 | 说明 |
|-----|------|------|
| **`readBoundPath`** | `(raw) → string \| undefined` | 从绑定描述提取 path；无 path 返回 `undefined` |
| **`resolveBoundValue`** | `(host, raw) → string` | 经 `dataContext.resolveDynamicValue` 解析当前值；失败返回 `''` |
| **`writeBoundValue`** | `(host, raw, value) → void` | 写入 `dataContext.set(path, value)`；无 path 时静默跳过 |

| 场景 | 推荐 API |
|------|----------|
| 读取 Agent 绑定的 path 当前值 | `resolveBoundValue(host, apiProps.field)` |
| 用户输入写回模型 | `writeBoundValue(host, apiProps.field, nextValue)` |
| 仅解析 path 字符串 | `readBoundPath(apiProps.field)` |

```ts
writeBoundValue(host, apiProps.province, '11');
writeBoundValue(host, apiProps.city, '');
```

---

### 运行时 — Action 派发

| API | 签名 | 说明 |
|-----|------|------|
| **`dispatchDeclaredAction`** | `(host) → void` | 读取 `props.action`，解析 context 中的 path，走 `context.dispatchAction` 或回退 `a2uiaction`；无 action 时静默返回 |
| **`dispatchA2UIAction`** | `(host, { name, context? }) → void` | 派发 `a2uiaction` 自定义事件，由 `BaseRenderer` 转给页面 `onAction` |

| 场景 | 推荐 API |
|------|----------|
| 动作由 Agent 在协议 JSON 配置 | `api` 声明 `ActionSchema` + `dispatchDeclaredAction(host)` |
| 动作名固定或 context 依赖运行时 UI 状态 | `dispatchA2UIAction(host, { name, context })` |
| 改模型并通知业务 | `writeBoundValue` + 上述二者之一 |

> **`dispatchDeclaredAction` 不处理 `functionCall` 形态**；若协议使用 `functionCall`，需自行读取 `props.action` 并处理。

---

### 运行时 — 样式与生命周期

| API | 签名 | 说明 |
|-----|------|------|
| **`ensureComponentStyles`** | `(host, styleKey, css) → void` | 向 ShadowRoot（或 host）注入 `<style>`；相同 `styleKey` 在同一 Shadow 内只注入一次 |
| **`subscribeV09ComponentUpdates`** | `(host, onUpdate) → unsubscribe` | 手动订阅 props 更新；`createNativeElement` / `createReactComponent` 已内置 |
| **`runAfterPropsReady`** | `(run) → void` | 立即执行 + `queueMicrotask` 再执行；等待引擎写入 `componentProps` |

```ts
import styles from './index.less';

ensureComponentStyles(host, 'my-component', styles);
```

Less / CSS Modules 构建产物为 CSS 字符串，作为第三个参数传入。

---

### 子路径打包入口

远程 ESM 打包时按组件技术栈选择入口，避免把 React 打进纯原生 bundle。

| 入口 | 包含 | 不含 | 适用 |
|------|------|------|------|
| `@bote/a2ui-custom-kit` | 全部 API | — | 业务应用内开发 |
| `@bote/a2ui-custom-kit/remote-runtime` | 原生工厂、runtime、registry、schema | `createReactComponent`、React | 纯原生远程 `.mjs` |
| `@bote/a2ui-custom-kit/react-runtime` | 上述 + `createReactComponent` | — | React 桥接远程 `.mjs` |

esbuild 配置中通过 alias 指向对应子路径（见 `app/scripts/a2ui-resolve-kit.mjs`）。

---

## 导出与注册

每个组件目录的 **index.ts** 导出一个注册表片段：

```ts
import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import { DemoNativeElementApi } from './api';
import { DemoNativeElementElement } from './element';

export const a2uiRemoteRegistry = mergeRegistryEntries(
  defineRegistryEntry(DemoNativeElementApi, DemoNativeElementElement),
);
```

### 本地注册合并

多个组件注册表可合并后传给 `BaseRenderer`：

```ts
import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import { DemoNativeElementApi } from './DemoNativeElement/api';
import { DemoNativeElementElement } from './DemoNativeElement/element';
// … 其余组件

export const customComponents = mergeRegistryEntries(
  defineRegistryEntry(DemoNativeElementApi, DemoNativeElementElement),
  defineRegistryEntry(DemoReactComponentApi, DemoReactComponentElement),
  defineRegistryEntry(DemoStyledPanelApi, DemoStyledPanelElement),
  defineRegistryEntry(DemoActionDispatchApi, DemoActionDispatchElement),
);
```

```tsx
<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  customComponents={customComponents}
  onAction={handleAction}
/>
```

---

## 数据绑定（进阶）

表单类组件除 action 外，常需把用户输入写回 Surface **DataModel**。

| API | 作用 |
|-----|------|
| `resolveBoundValue(host, raw)` | 从 `{ path }` 或已归一化值读取当前模型 |
| `writeBoundValue(host, raw, value)` | 写入 DataModel，联动同 path 的其他组件 |

```ts
// api.ts 中 province 用 DynString
writeBoundValue(host, apiProps.province, '11');
```

协议片段：

```json
{
  "component": "YourFormField",
  "province": { "path": "/region/province" }
}
```

典型组合：表单 `onChange` 里 **同时** `writeBoundValue` + `dispatchA2UIAction` 通知业务层。

---

## 编译为远程 ESM

### 配置

`app/a2ui-esm.config.mjs` — 一组件一目录、一 bundle，产出 `public/{name}.mjs`：

```js
export default {
  outdir: 'public',
  minify: true,
  sourcemap: true,
  schema: {
    outdir: 'public/schemas',
    registry: 'scripts/a2ui-schema-registry.ts',
  },
  entries: [
    {
      name: 'DemoNativeElement',
      input: 'src/pages/a2ui-remote/DemoNativeElement/index.ts',
    },
    {
      name: 'DemoReactComponent',
      input: 'src/pages/a2ui-remote/DemoReactComponent/index.ts',
    },
    {
      name: 'DemoStyledPanel',
      input: 'src/pages/a2ui-remote/DemoStyledPanel/index.ts',
    },
    {
      name: 'DemoActionDispatch',
      input: 'src/pages/a2ui-remote/DemoActionDispatch/index.ts',
    },
  ],
};
```

新增组件时同步更新：

1. `a2ui-esm.config.mjs` 的 `entries`
2. `app/scripts/a2ui-schema-registry.ts` 的 `schemaRegistry`

### 执行命令

```bash
cd app

# 打包远程 .mjs（同时生成 JSON Schema）
yarn build:a2ui

# 仅生成 Schema
yarn generate:a2ui-schema
```

成功后：

- `app/public/DemoNativeElement.mjs` 等 — 可部署到 CDN
- `app/public/schemas/DemoNativeElement.schema.json` 等 — 供 Agent catalog 引用

---

## 运行时加载与渲染

### 方式一：传 URL（推荐）

`@bote/a2ui-render` 的 **`remoteComponentUrls`** 会在内部自动加载远程 `.mjs` 并与 **`customComponents`** 合并，**无需**手动 `await`，也**不必**安装 `@bote/a2ui-custom-kit`：

```tsx
import { BaseRenderer } from '@bote/a2ui-render';

<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  remoteComponentUrls={[
    'https://cdn.example.com/DemoNativeElement.mjs',
    'https://cdn.example.com/DemoActionDispatch.mjs',
  ]}
  customComponents={localRegistry}
  onAction={handleAction}
/>
```

### 方式二：手动加载（高级）

需要在渲染前自行控制加载时机时，使用 **`@bote/a2ui-render`** 导出的 loader（类型同样从该包导入）：

**单个远程地址**

```ts
import { loadRemoteA2UICustomRegistry, type A2UICustomComponentRegistry } from '@bote/a2ui-render';

const remotePart = await loadRemoteA2UICustomRegistry(
  'https://cdn.example.com/DemoNativeElement.mjs',
);

const customComponents: A2UICustomComponentRegistry = { ...localRegistry, ...remotePart };
```

**多个远程地址**

```ts
import { loadRemoteA2UICustomRegistries, type A2UICustomComponentRegistry } from '@bote/a2ui-render';

const remotePart = await loadRemoteA2UICustomRegistries([
  'https://cdn.example.com/DemoNativeElement.mjs',
  'https://cdn.example.com/DemoActionDispatch.mjs',
]);

const customComponents: A2UICustomComponentRegistry = { ...localRegistry, ...remotePart };
```

**渲染**

```tsx
<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  customComponents={customComponents}
  onAction={handleAction}
/>
```

在 `useEffect`、路由 loader 等可 `await` 的地方先加载远程注册表，再传入 `BaseRenderer`。

若远程包导出名不是默认的 `a2uiRemoteRegistry`，加载时可传 `{ exportName: '你的导出名' }`。

### 使用 antd 的远程组件

A2UI 在嵌套 ShadowRoot 中渲染，全局 `antd.css` 不会自动穿透。开启渲染器开关：

```tsx
<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  customComponents={customComponents}
  injectAntdStylesInShadow
  onAction={handleAction}
/>
```

远程组件 **无需** 在 bundle 里 `import 'antd/dist/antd.min.css'`。使用 `Select` 等弹出层时，建议 `ConfigProvider` + `getPopupContainer` 指向 Shadow 内节点。

---

## 快速对照

| 需求 | 做法 | 主要 API |
|------|------|----------|
| 声明组件 props | `api.ts` + Zod | `defineComponentApi`、`DynString`、`ActionSchema` |
| 轻量展示、无 React | 原生 DOM | `createNativeElement`、`readComponentProps` |
| JSX 复杂 UI | React 桥接 | `createReactComponent`、`ensureComponentStyles` |
| Shadow 内样式 | Less 注入 | `ensureComponentStyles` |
| Agent 配置点击 | 协议 action | `ActionSchema` + `dispatchDeclaredAction` |
| 代码写死 action | 手写派发 | `dispatchA2UIAction` |
| 读 DataModel | path 绑定 | `resolveBoundValue`、`readBoundPath` |
| 写 DataModel | 表单 onChange | `writeBoundValue` |
| 合并注册表 | 多组件 / 本地+远程 | `defineRegistryEntry`、`mergeRegistryEntries` |
| 导出 Agent Schema | catalog | `componentApiToJsonSchema2019` |
| 容器动态子列表 | 复杂 props | `ChildListSchema`、`ComponentIdSchema` |
| 纯原生远程包 | esbuild | `@bote/a2ui-custom-kit/remote-runtime` |
| React 远程包 | esbuild | `@bote/a2ui-custom-kit/react-runtime` |
| 独立部署 | CDN 加载 | `yarn build:a2ui` → `loadRemoteA2UICustomRegistry` |

---

## 相关文档

- 根目录 [README.zh-CN.md](../../../README.zh-CN.md) — 项目概览与包说明
- [`packages/a2ui-custom-kit/README.md`](../../../packages/a2ui-custom-kit/README.md) — kit API 入口
- [`packages/a2ui-render/README.md`](../../../packages/a2ui-render/README.md) — 渲染器用法
