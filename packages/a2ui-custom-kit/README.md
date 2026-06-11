# @boteai/a2ui-custom-kit

**仓库**：[github.com/BoteAI/a2ui](https://github.com/BoteAI/a2ui)

## 这个包是做什么的

**A2UI 自定义组件的开发工具集** — 帮你定义 props schema、实现 Web Component、构建注册表并打包为远程 ESM。

| 职责 | 包 |
|------|-----|
| **渲染**协议界面、加载远程 URL | `@boteai/a2ui-render`（单独安装即可） |
| **开发**自定义组件、产出注册表 / `.mjs` | `@boteai/a2ui-custom-kit`（可选） |

渲染侧已内置 `remoteComponentUrls` 与 `loadRemoteA2UICustomRegistry`，**业务页面只渲染、不开发自定义组件时，不必安装本包**。

---

## 与 @boteai/a2ui-render 的关系

```
开发阶段                          运行阶段
────────                          ────────
@boteai/a2ui-custom-kit             @boteai/a2ui-render
  defineComponentApi                BaseRenderer
  createNativeElement /             ├─ customComponents（本地注册表）
  createReactComponent              └─ remoteComponentUrls（CDN .mjs）
  defineRegistryEntry
  mergeRegistryEntries
        │
        └─ esbuild → public/*.mjs ──► remoteComponentUrls
```

- 本包**不依赖** `@boteai/a2ui-render`，可仅在组件工程 / monorepo 的 `a2ui-remote` 目录中使用。
- **`A2UICustomComponentRegistry` 等类型**在本包与 `@boteai/a2ui-render` 中各自定义并对齐，**无需** `@boteai/types`。
- 类型从对应包 import 即可：`import type { A2UICustomComponentRegistry } from '@boteai/a2ui-custom-kit'` 或 `'@boteai/a2ui-render'`。

---

## 什么时候需要安装

| 场景 | 需要本包？ |
|------|-----------|
| 只渲染标准 A2UI + 远程 URL | 否，仅 `@boteai/a2ui-render` |
| 在应用内写本地自定义组件 | 是 |
| 打包独立 `.mjs` 供 CDN 部署 | 是 |
| 合并多份本地注册表 | 是（`mergeRegistryEntries`） |

---

## 快速开始

```bash
yarn add @boteai/a2ui-custom-kit @boteai/a2ui-render
```

典型流程：

1. **`api.ts`** — `defineComponentApi` 声明组件名与 Zod schema  
2. **`element.ts(x)`** — `createNativeElement` 或 `createReactComponent` 实现  
3. **`index.ts`** — `defineRegistryEntry` + `mergeRegistryEntries` 导出注册表  
4. 传给 **`BaseRenderer`** 的 `customComponents`，或 `yarn build:a2ui` 产出 `.mjs` 后配置 `remoteComponentUrls`

```ts
import {
  defineComponentApi,
  defineRegistryEntry,
  mergeRegistryEntries,
  createReactComponent,
  DynString,
} from '@boteai/a2ui-custom-kit';

// … api + element 实现

export const a2uiRemoteRegistry = mergeRegistryEntries(
  defineRegistryEntry(YourApi, YourElement),
);
```

```tsx
import { BaseRenderer } from '@boteai/a2ui-render';
import { a2uiRemoteRegistry } from './your-remote-registry';

<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  customComponents={a2uiRemoteRegistry}
  onAction={handleAction}
/>
```

或部署 `.mjs` 后仅传 URL（无需在本业务包引用 kit）：

```tsx
<BaseRenderer
  remoteComponentUrls={['https://cdn.example.com/YourComponent.mjs']}
  /* … */
/>
```

---

## 主要导出

| 分类 | API |
|------|-----|
| Schema | `defineComponentApi`、`DynString`、`ActionSchema`、`DynamicValueSchema`、`componentApiToJsonSchema2019` |
| 注册表 | `defineRegistryEntry`、`defineSimpleRegistryEntry`、`mergeRegistryEntries` |
| 工厂 | `createNativeElement`、`createReactComponent` |
| 运行时 | `readComponentProps`、`writeBoundValue`、`dispatchDeclaredAction`、`dispatchA2UIAction`、`ensureComponentStyles` 等 |
| 类型 | `A2UICustomComponentRegistry`、`A2UICustomElementHost`、`ComponentApi` 等 |

远程 ESM 打包子路径：

| 入口 | 说明 |
|------|------|
| `@boteai/a2ui-custom-kit/remote-runtime` | 纯原生组件 bundle，不含 React |
| `@boteai/a2ui-custom-kit/react-runtime` | 含 `createReactComponent` |

`templates/` 目录提供可拷贝的组件模板。

---

## 文档

- **完整开发指南与 API 参考**：[`app/public/docs/custom-components-guide.md`](../../app/public/docs/custom-components-guide.md)
- **渲染器用法**：[`packages/a2ui-render/README.md`](../a2ui-render/README.md)
