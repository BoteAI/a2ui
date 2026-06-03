# remote-comp 脚手架内开发 A2UI 远程自定义组件

将本目录 **`index.example.tsx`** 复制到 **remote-comp** 工程的 `src/pages/` 下，例如 `src/pages/A2UIRemoteGlow/index.ts`，并在 **`.lingxirc.js`** 的 `remoteComponents.entry` 中加入目录名 **`A2UIRemoteGlow`**。

## 与原有远程 React 组件的差异

| 项 | 原 RemoteComp 远程页 | A2UI 远程注册表 |
|----|---------------------|----------------|
| 导出 | `export default` React 组件 | **命名导出** `export const a2uiRemoteRegistry = { ... }` |
| 消费方 | `useRemoteComponent(url)` + `<RemoteComp />` | `loadRemoteA2UICustomRegistry(url)` + `BaseRenderer customComponents` |

## 构建：不要用 `yarn build:remote` 给 `import()` 用

**`lingxi remote`** 产出 **commonjs**，且 **`@lingxiteam/cli`** 会强制把 **react、react-dom** 做成 **external**，文件里会有 **`require('react')`**。主应用 **`loadRemoteA2UICustomRegistry`** 使用浏览器 **`import(url)`**，会报 **`require is not defined`**。

请在 **remote-comp** 执行：

```bash
yarn build:a2ui-esm
```

- 多入口在 **`a2ui-esm.config.mjs`** 的 **`entries`** 配置。
- 业务代码请 **`import from '@boteteam/a2ui-custom-kit/remote-runtime'`**（勿用主入口，避免打进 React）。
- 得到 **`public/{name}.mjs`**，把 **mjs** 的完整 URL 填入主应用。

**Schema** 见 remote-comp 内 **`src/pages/A2UIRemoteGlow/SCHEMA.md`**。

**`yarn build:remote`** 仍给 **RemoteComp** 用，与 A2UI **`import()`** 链路分离。

**不要** 把 **`@boteteam/a2ui-render`** 打进远程包；Lit 与 **BaseRenderer** 只在主应用。

## 规范全文

见 monorepo **`packages/a2ui-custom-kit/REMOTE_ESM_DEVELOPMENT.md`**。
