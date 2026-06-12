/** v0.9 协议 action 声明（与 ActionSchema 一致，含 event 或扁平 name） */
export type A2UIDeclaredAction = {
  event?: {
    name: string;
    context?: Record<string, unknown>;
  };
  name?: string;
  context?: Record<string, unknown>;
};

/** v0.9 Lit 宿主注入到自定义元素上的上下文（只声明开发会用到的字段） */
export type A2UIV09ElementContext = {
  componentModel?: {
    id?: string;
    onUpdated?: { subscribe: (fn: () => void) => { unsubscribe: () => void } };
  };
  dataContext?: {
    path?: string;
    set: (path: string, value: unknown) => void;
    resolveDynamicValue: (value: unknown) => unknown;

    /** 运行时由 @a2ui/web_core DataContext 提供，可通过它获取 SurfaceModel */
    surface?: unknown;

    /** 创建子路径 DataContext，路径解析复用 DataContext.resolvePath 逻辑 */
    nested?: (relativePath: string) => unknown;
  };

  /** 与官方 Button 相同：由引擎解析 context 中的 path 后分发到 surface.onAction */
  dispatchAction?: (action: { event: { name: string; context?: Record<string, unknown> } }) => void;

  /** 运行时由 @a2ui/web_core ComponentContext 提供 */
  surface?: unknown;

  /** 运行时由 @a2ui/web_core ComponentContext 提供 */
  surfaceComponents?: unknown;

  /** 运行时由 @a2ui/web_core ComponentContext 提供 */
  theme?: unknown;
};

export type A2UIActionDetail = {
  name: string;
  context?: Record<string, unknown>;
};

export type A2UIActionPayload = {
  name: string;
  context: Record<string, unknown>;
};
