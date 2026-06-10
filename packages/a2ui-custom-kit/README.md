# @bote/a2ui-custom-kit

## 这个包是做什么的

**帮你在 A2UI 里扩展「自己的那一块界面」。**

**`@bote/a2ui-render`** 负责把协议消息画出来；当消息里出现**你们自定义的组件名**时，需要有人把这些名字**接到真正的实现**上。本包提供一套**更省事的做法**：约定组件有哪些属性、怎么注册进渲染器、用原生还是 React 来画等，减少和业务页面之间的重复胶水代码。

若组件要打成独立脚本、在别的站点或微前端里加载，再对照 **`REMOTE_ESM_DEVELOPMENT.md`** 即可。

**与 `@bote/a2ui-render` 的关系**：本包**不**声明对 `a2ui-render` 的依赖。**`A2UICustomComponentRegistry` 等类型**在 **`@bote/types`** 统一维护；本包从该处引用并再导出，便于只装 kit 时也能标注类型。业务页面若要渲染，再单独安装 **`@bote/a2ui-render`** 即可。

## 怎么用

1. 业务里同时依赖 **`@bote/a2ui-render`** 与本包。  
2. 按 **`DEVELOPMENT_GUIDE.md`** 里推荐的步骤：先写组件的 API 描述，再写实际界面，最后**合并成注册表**交给 **`BaseRenderer` 的 `customComponents`**。  
3. **`templates/`** 目录里有可直接拷贝改名的模板，适合从零起一个组件。

最小串联关系可以理解为：

- 本包：产出 **`customComponents`** 对象。  
- **`BaseRenderer`**：接收 **`messages` + `customComponents`**，在界面上画出来。

更细的步骤、字段约定和注意事项都在 **`DEVELOPMENT_GUIDE.md`**，本文不再展开。

---


