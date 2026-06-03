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
  };

  /** 与官方 Button 相同：由引擎解析 context 中的 path 后分发到 surface.onAction */
  dispatchAction?: (action: { event: { name: string; context?: Record<string, unknown> } }) => void;
};

export type A2UIActionDetail = {
  name: string;
  context?: Record<string, unknown>;
};

export type A2UIActionPayload = {
  name: string;
  context: Record<string, unknown>;
};
