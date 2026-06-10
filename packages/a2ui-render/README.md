# @bote/a2ui-render

## 这个包是做什么的

**把 A2UI 协议里的消息 JSON 画成页面上的界面。**

后端或 Agent 下发的是一段「描述界面该怎么长」的结构化数据，本包在 React 页面里负责**展示、主题样式、按钮回调**等。你不需要自己解析协议里的每一种消息类型，交给 **`BaseRenderer`** 即可。

若协议里用到了你们自己的组件名，需要另外准备「名字对应到具体组件」的注册表。本地写的组件通常配合 **`@bote/a2ui-custom-kit`** 产出注册表；**打成独立 `.mjs` 在运行时加载**时，也是同一套：**先得到一份注册表对象，再交给下面的 `BaseRenderer`**。

---

## 怎么用

1. 在业务项目里安装 **`@bote/a2ui-render`**。  
2. 准备好**当前页面约定版本**下的消息数组，以及协议版本 **`0.8`** 或 **`0.9`**。  
3. 在页面里渲染 **`BaseRenderer`**，传入消息、版本，需要时传入 **`onAction`** 和 **`customComponents`**。

```tsx
import { BaseRenderer, type A2UIMessage } from '@bote/a2ui-render';

const messages: A2UIMessage[] = [
  /* 与 protocolVersion 一致的消息 */
];

<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  onAction={({ name, context }) => {
    /* 按钮等交互在这里处理 */
  }}
/>
```

有自定义组件时，把注册表对象传给 **`customComponents`** 即可，**键名与消息 JSON 里的 `component` 字符串完全一致**。

---

## 远程自定义组件怎么接到渲染上

远程脚本由 **`@bote/a2ui-custom-kit`** 里的 **`loadRemoteA2UICustomRegistry`**（单个 `.mjs`）或 **`loadRemoteA2UICustomRegistries`**（多个 URL）加载，返回的也是**注册表片段**，类型与 **`BaseRenderer`** 的 **`customComponents`** 一致。业务里常见做法是：**和本地静态注册表合并，再一并传给 `BaseRenderer`**。

**单个远程地址**

```ts
import {
  loadRemoteA2UICustomRegistry,
  mergeRegistryEntries,
} from '@bote/a2ui-custom-kit';
import type { A2UICustomComponentRegistry } from '@bote/types';

const remotePart = await loadRemoteA2UICustomRegistry(
  'https://cdn.example.com/a2ui-remote/RemoteGlowCapsule.mjs',
);

const customComponents: A2UICustomComponentRegistry = mergeRegistryEntries(
  staticRegistry,
  remotePart,
);
```

**多个远程地址一次合并**

```ts
import {
  loadRemoteA2UICustomRegistries,
  mergeRegistryEntries,
} from '@bote/a2ui-custom-kit';
import type { A2UICustomComponentRegistry } from '@bote/types';

const remotePart = await loadRemoteA2UICustomRegistries([
  'https://cdn.example.com/a2ui-remote/RemoteGlowCapsule.mjs',
  'https://cdn.example.com/a2ui-remote/RemoteReactBadge.mjs',
]);

const customComponents: A2UICustomComponentRegistry = mergeRegistryEntries(
  staticRegistry,
  remotePart,
);
```

**渲染**：合并得到的 **`customComponents`** 直接交给 **`BaseRenderer`**（在 **`useEffect`**、路由 **`loader`** 等能 **`await`** 的地方先加载好，再放进 **`useState` 或 store** 即可）。

```tsx
<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  customComponents={customComponents}
  onAction={handleAction}
/>
```

若远程包导出的注册表名字不是默认的 **`a2uiRemoteRegistry`**，可在加载函数里传 **`{ exportName: '你的导出名' }`**。

**和气泡里 `RemoteComp` 的区别**：`RemoteComp` 走的是另一条构建与加载方式；**A2UI 远程块**请用 **`import()` 可用的 ESM `.mjs`**，并按上面方式合并进 **`BaseRenderer`**。远程包怎么打、CORS、鉴权、联调清单等见 **`@bote/a2ui-custom-kit` 的 `REMOTE_ESM_DEVELOPMENT.md`**。

---

## 还可以看哪里

- **主题变量列表**：同目录 **`styleVars.md`**。  
- **在线拼 JSON、对照官方行为**：[A2UI Playground](https://a2ui-sdk.js.org/playground/)。  
- **本仓库里的试玩页**：`chatBot` 里的 **`A2UITest`**（含远程 URL 合并进预览的示例）。  
- **自定义组件怎么写**：**`@bote/a2ui-custom-kit`** 的 README 与 **`DEVELOPMENT_GUIDE.md`**。  
- **远程 ESM 工程与联调细节**：**`@bote/a2ui-custom-kit`** 的 **`REMOTE_ESM_DEVELOPMENT.md`**。
