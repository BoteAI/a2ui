# 脚手架模板

从对应子目录复制文件到业务 `src/a2ui-custom/`，按注释替换 `YourComponent` 等占位符。

| 目录 | 模式 | 说明 |
|------|------|------|
| `api/` | 契约 | `defineComponentApi` + Zod |
| `native-element/` | 模式 A | `createNativeElement` |
| `react-bridge/` | 模式 B | `createReactComponent` |
| `react-form-field/` | 模式 C | DataModel 双向绑定 + React |
| `registry/` | 注册 | `mergeRegistryEntries` 示例 |
| `remote-comp-a2ui/` | 远程 ESM | 配合 `remote-comp` + `BaseRenderer`，见包内 **`REMOTE_ESM_DEVELOPMENT.md`** |

复制后务必：

1. 修改 `name` 与协议 JSON 中 `component` 一致；
2. 在页面 `customComponents` 合并注册；
3. 在 mock 的 `updateComponents` 增加节点做联调。
