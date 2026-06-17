import { ExpressionParser } from './v09ExpressionParserLite';
import type { A2UIProtocolVersion } from '../compat/litRuntime';
import type { A2UIComponent, A2UIMessage } from '../components/BaseRenderer/types';
import { A2UI_PRESET_COMPONENT_TYPES } from '@boteai/a2ui-comp-preset';

/** 与官方 Playground 一致：裸字符串里的 `${...}` 需经 formatString 才参与数据绑定 */
const v09InterpolationParser = new ExpressionParser();

function stringContainsReactiveInterpolationSegments(s: string): boolean {
  if (!s || !s.includes('${')) return false;
  try {
    const parts = v09InterpolationParser.parse(s);
    return parts.some((p: unknown) => p != null && typeof p === 'object');
  } catch {
    return false;
  }
}

/**
 * 将含 `${path}` 等插值片段的字符串包装为 formatString 调用；已转义 `\\${` 的文案保持为普通字符串。
 * 不递归改写仅含 `path` 的数据绑定对象及已有 `call` 的函数调用。
 */
function wrapV09InterpolatedDynamicStringValues(value: unknown): unknown {
  if (typeof value === 'string') {
    return stringContainsReactiveInterpolationSegments(value)
      ? { call: 'formatString', args: { value } }
      : value;
  }
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.map((item) => wrapV09InterpolatedDynamicStringValues(item));
  }
  const o = value as Record<string, unknown>;
  if ('call' in o && typeof o.call === 'string') {
    if (o.call === 'formatString') {
      return value;
    }
    const { args } = o;
    if (args && typeof args === 'object' && !Array.isArray(args)) {
      return {
        ...o,
        args: Object.fromEntries(
          Object.entries(args as Record<string, unknown>).map(([k, v]) => [
            k,
            wrapV09InterpolatedDynamicStringValues(v),
          ]),
        ),
      };
    }
    return value;
  }
  if ('path' in o && typeof o.path === 'string' && !('call' in o) && Object.keys(o).length === 1) {
    return value;
  }
  return Object.fromEntries(
    Object.entries(o).map(([k, v]) => [k, wrapV09InterpolatedDynamicStringValues(v)]),
  );
}

function wrapV09UpdateComponentInterpolatedProps(component: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = { ...component };
  Object.keys(out).forEach((key) => {
    if (key === 'id' || key === 'component') return;
    out[key] = wrapV09InterpolatedDynamicStringValues(out[key]);
  });
  return out;
}

/** 与 @a2ui/web_core 默认 surface 对齐 */
export const DEFAULT_A2UI_SURFACE_ID = '@default';

/**
 * 将业务侧常用的 default 规范为官方默认 surfaceId
 */
export function normalizeSurfaceId(surfaceId: string | undefined): string {
  if (!surfaceId || surfaceId === 'default') {
    return DEFAULT_A2UI_SURFACE_ID;
  }
  return surfaceId;
}

/**
 * 将当前包解析出的 components + rootId 转为 @a2ui/web_core A2uiMessageProcessor 所需消息序列
 */
export function componentsToProtocolMessages(
  components: A2UIComponent[],
  rootId: string,
  surfaceId: string,
  dataModel?: Record<string, any>,
): unknown[] {
  const sid = normalizeSurfaceId(surfaceId);
  const messages: unknown[] = [
    {
      beginRendering: {
        surfaceId: sid,
        root: rootId,
      },
    },
    {
      surfaceUpdate: {
        surfaceId: sid,
        components,
      },
    },
  ];

  if (dataModel && typeof dataModel === 'object') {
    messages.push({
      dataModelUpdate: {
        surfaceId: sid,
        path: '/',
        contents: Object.entries(dataModel).map(([key, value]) => ({
          key,
          ...toValueContent(value),
        })),
      },
    });
  }

  return messages;
}

type LooseComponent = {
  id: string
  component: any
  weight?: number
  [key: string]: any
};

const COMPONENT_RESERVED_KEYS = new Set(['id', 'component', 'weight']);
const TEXT_USAGE_HINTS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'caption', 'body']);
const IMAGE_USAGE_HINTS = new Set(['icon', 'avatar', 'smallFeature', 'mediumFeature', 'largeFeature', 'header']);
const TEXT_FIELD_TYPES = new Set(['shortText', 'number', 'date', 'longText']);

/** v0.8 传输信封顶层键（数组元素为对象，且仅含其一类 action） */
const V08_TRANSPORT_KEYS = ['beginRendering', 'surfaceUpdate', 'dataModelUpdate'] as const;

/** v0.9 传输信封顶层键 */
const V09_TRANSPORT_KEYS = ['createSurface', 'updateComponents', 'updateDataModel', 'deleteSurface'] as const;

function hasTransportKey(msg: unknown, keys: readonly string[]): boolean {
  if (!msg || typeof msg !== 'object') return false;
  const m = msg as Record<string, unknown>;
  return keys.some((k) => m[k] != null);
}

function hasV08TransportMarkers(msg: unknown): boolean {
  return hasTransportKey(msg, V08_TRANSPORT_KEYS);
}

function hasV09TransportMarkers(msg: unknown): boolean {
  return hasTransportKey(msg, V09_TRANSPORT_KEYS);
}

/**
 * 单条消息是否为 v0.9 传输信封（不依赖服务端下发的 version 字段；与 BaseRenderer 的 protocolVersion 对齐使用）。
 */
function isSingleMessageV09Envelope(msg: unknown): boolean {
  return hasV09TransportMarkers(msg) && !hasV08TransportMarkers(msg);
}

/** 整条数组是否可视为 v0.9 原生批次（每条均为 v0.9 信封） */
function isFullV09EnvelopeBatch(messages: unknown[]): boolean {
  if (!Array.isArray(messages) || messages.length === 0) return false;
  return messages.every((msg) => isSingleMessageV09Envelope(msg));
}

function summarizeMessage(msg: unknown): string {
  if (msg == null) return String(msg);
  if (typeof msg !== 'object') return String(msg);
  const keys = Object.keys(msg as object);
  return keys.length ? keys.slice(0, 8).join(', ') : '{}';
}

function validateV09MessageBatch(messages: unknown[]): void {
  if (!Array.isArray(messages)) return;
  messages.forEach((msg, i) => {
    if (!isSingleMessageV09Envelope(msg)) {
      throw new Error(
        `[A2UI] protocolVersion 为 0.9 时，第 ${i + 1} 条消息不符合 v0.9 信封：须含 createSurface / updateComponents / updateDataModel / deleteSurface 之一，且不得含 beginRendering / surfaceUpdate / dataModelUpdate。当前片段键：${summarizeMessage(msg)}`,
      );
    }
  });
}

function assertNotV09BatchWhenProtocol08(messages: unknown[]): void {
  if (!Array.isArray(messages) || messages.length === 0) return;
  if (isFullV09EnvelopeBatch(messages)) {
    throw new Error(
      '[A2UI] 检测到 v0.9 形态的消息序列，但当前 protocolVersion 为 0.8。请将 BaseRenderer 的 protocolVersion 设为「0.9」，或在 normalizeToLitProtocolMessages 第二参数传入「0.9」。',
    );
  }
}

/**
 * 根据 a2uiEvents 推断协议版本：仅识别 v0.8（任一条含 beginRendering / surfaceUpdate / dataModelUpdate），其余一律按 v0.9 处理。
 */
export function inferProtocolVersionFromMessages(messages: unknown[]): A2UIProtocolVersion {
  if (!Array.isArray(messages) || messages.length === 0) return '0.9';
  return messages.some(hasV08TransportMarkers) ? '0.8' : '0.9';
}

/**
 * A2UI v0.9 basic catalog 官方组件类型名。
 * 与 chatManager PageConfigA2ui core props catalog basic_catalog.json 的 components 键一致。
 */
const BASIC_CATALOG_OFFICIAL_COMPONENT_TYPES = new Set([
  'Text',
  'Image',
  'Icon',
  'Video',
  'AudioPlayer',
  'Row',
  'Column',
  'List',
  'Card',
  'Tabs',
  'Modal',
  'Divider',
  'Button',
  'TextField',
  'CheckBox',
  'ChoicePicker',
  'Slider',
  'DateTimeInput',
]);
const PRESET_COMPONENT_TYPES = new Set(A2UI_PRESET_COMPONENT_TYPES);

function collectComponentTypeNamesFromItem(item: unknown, into: Set<string>): void {
  if (!item || typeof item !== 'object') return;
  const comp = (item as Record<string, unknown>).component;
  if (typeof comp === 'string') {
    const name = comp.trim();
    if (name) into.add(name);
    return;
  }
  if (comp && typeof comp === 'object' && !Array.isArray(comp)) {
    Object.keys(comp as Record<string, unknown>).forEach((typeName) => {
      const name = typeName.trim();
      if (name) into.add(name);
    });
  }
}

function collectComponentTypeNamesFromMessages(messages: unknown[], into: Set<string>): void {
  if (!Array.isArray(messages)) return;
  messages.forEach((msg) => {
    if (!msg || typeof msg !== 'object') return;
    const m = msg as Record<string, unknown>;
    const componentLists = [
      (m.surfaceUpdate as { components?: unknown[] } | undefined)?.components,
      (m.updateComponents as { components?: unknown[] } | undefined)?.components,
    ];
    componentLists.forEach((list) => {
      if (!Array.isArray(list)) return;
      list.forEach((item) => collectComponentTypeNamesFromItem(item, into));
    });
  });
}

/**
 * @param messages a2uiEvents 从 a2uiEvents 消息中找出不属于官方 basic catalog 的组件类型名
 * @returns 自定义组件类型名列表，如 ['RemoteGlowCapsule']
 */
export function pickCustomComponents(messages: unknown[], customComponentNames?: string[]): string[] {
  const found = new Set<string>();
  collectComponentTypeNamesFromMessages(messages, found);
  return Array.from(found)
    .filter((name) => !BASIC_CATALOG_OFFICIAL_COMPONENT_TYPES.has(name))
    .filter((name) => !PRESET_COMPONENT_TYPES.has(name))
    .filter((name) => !customComponentNames?.includes(name))
    .sort();
}

/**
 * v0.9 Lit 基础组件（如 Text TextField）直接把 props.text、props.label 拼进模板；
 * 若为 `{ literalString: "x" }` 会得到 String(object) → 「[object Object]」。
 * 将协议里的字面量壳展开；仅含 `path` 的数据绑定对象保持不动，交给运行时解析。
 */
function unwrapDynamicLiteralsForV09Lit(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.map(unwrapDynamicLiteralsForV09Lit);
  }
  const o = value as Record<string, unknown>;
  const keys = Object.keys(o);
  if (keys.length === 1) {
    const k = keys[0];
    if (k === 'literalString') return o.literalString;
    if (k === 'literalNumber') return o.literalNumber;
    if (k === 'literalBoolean') return o.literalBoolean;
    if (k === 'path') return value;
  }
  const out: Record<string, unknown> = {};
  keys.forEach((key) => {
    out[key] = unwrapDynamicLiteralsForV09Lit(o[key]);
  });
  return out;
}

/**
 * v0.9 Action 须为 `{ event: { name, context? } }` 或 `{ functionCall }`；扁平 `{ name, context }` 在 SurfaceModel.dispatchAction 中不会被识别。
 */
function normalizeV09ActionEnvelope(action: unknown): unknown {
  if (action == null || typeof action !== 'object' || Array.isArray(action)) {
    return action;
  }
  const a = action as Record<string, unknown>;
  if (a.event != null && typeof a.event === 'object' && !Array.isArray(a.event)) {
    return action;
  }
  if (a.functionCall != null && typeof a.functionCall === 'object' && !Array.isArray(a.functionCall)) {
    return action;
  }
  if (typeof a.name === 'string') {
    const { name } = a;
    const ctx =
      a.context != null && typeof a.context === 'object' && !Array.isArray(a.context)
        ? (a.context as Record<string, unknown>)
        : {};
    return { event: { name, context: ctx } };
  }
  return action;
}

/** Button 官方 schema 为 variant，无 primary 布尔；strict 下多余字段会导致整条 props 校验失败 */
function normalizeV09ButtonPrimaryToVariant(component: Record<string, any>): void {
  if (component.component !== 'Button') return;
  if (component.variant != null || !Object.prototype.hasOwnProperty.call(component, 'primary')) return;
  const p = component.primary;
  component.variant = p === true || p === 'true' ? 'primary' : 'default';
  delete component.primary;
}
function normalizeV09UpdateComponentShape(component: Record<string, any>): Record<string, any> {
  if (!component || typeof component !== 'object') return component;
  const next: Record<string, any> = { ...component };
  if (
    next.children
    && typeof next.children === 'object'
    && !Array.isArray(next.children)
    && Array.isArray(next.children.explicitList)
  ) {
    next.children = next.children.explicitList;
  }
  if (next.usageHint != null && next.variant == null) {
    next.variant = next.usageHint;
    delete next.usageHint;
  }
  const typeName = typeof next.component === 'string' ? next.component : '';
  if ((typeName === 'Row' || typeName === 'Column') && next.distribution != null && next.justify == null) {
    next.justify = next.distribution;
    delete next.distribution;
  }
  normalizeV09ButtonPrimaryToVariant(next);
  if (next.action !== undefined) {
    next.action = normalizeV09ActionEnvelope(next.action);
  }
  return unwrapDynamicLiteralsForV09Lit(next) as Record<string, any>;
}

function patchV09UpdateComponentsMessage(msg: Record<string, any>): Record<string, any> {
  const comps = msg?.updateComponents?.components;
  if (!Array.isArray(comps)) return msg;
  return {
    ...msg,
    updateComponents: {
      ...msg.updateComponents,
      components: comps.map((c: Record<string, any>) =>
        wrapV09UpdateComponentInterpolatedProps(normalizeV09UpdateComponentShape(c)),
      ),
    },
  };
}

/**
 * 将业务侧 messages 规范为 @a2ui/lit 可执行的标准协议格式。
 *
 * @param protocolVersion 与 BaseRenderer 一致；不传时按消息形态推断（全 v0.9 信封则按 0.9 处理，否则 0.8）。
 *        显式传入 0.8 且整批为 v0.9 信封时会抛错；显式 0.9 且任一条不符合 v0.9 信封时抛错。
 */
export function normalizeToLitProtocolMessages(
  messages: unknown[],
  protocolVersion?: A2UIProtocolVersion,
): A2UIMessage[] {
  if (!Array.isArray(messages)) {
    return [];
  }
  if (messages.length === 0) {
    return [];
  }

  const resolvedVersion: A2UIProtocolVersion =
    protocolVersion === '0.8' || protocolVersion === '0.9'
      ? protocolVersion
      : inferProtocolVersionFromMessages(messages);

  if (resolvedVersion === '0.9') {
    validateV09MessageBatch(messages);
    const patched = (messages as Record<string, any>[]).map((msg) => patchV09UpdateComponentsMessage(msg));
    return sortMessagesForLitProcessor(patched as A2UIMessage[]);
  }

  assertNotV09BatchWhenProtocol08(messages);

  const dataModel = extractDataModelFromMessages(messages as Record<string, any>[]);
  const context: NormalizeContext = {
    dataModel,
    formatTemplateFieldMap: new Map(),
  };
  const normalized = messages.map((msg) => normalizeMessage(msg as Record<string, any>, context));
  const hasTemplateFields = context.formatTemplateFieldMap.size > 0;
  const finalDataModel = hasTemplateFields
    ? enrichDataModelWithFormatTemplates(context.dataModel, context.formatTemplateFieldMap)
    : context.dataModel;
  const expanded = normalized.map((msg) => expandMessageTemplates(msg, finalDataModel));
  const out = !hasTemplateFields
    ? expanded
    : expanded.map((msg) => rewriteRootDataModelUpdate(msg, finalDataModel));
  return sortMessagesForLitProcessor(out);
}

/** 与 A2uiMessageProcessor.processMessages 处理顺序一致，避免 beginRendering 过晚导致中间态树为空 */
const LIT_PROCESSOR_MESSAGE_KEYS = ['beginRendering', 'surfaceUpdate', 'dataModelUpdate', 'deleteSurface'] as const;

/** v0.9 服务端消息类型；须先于依赖 surface 的 update 消息处理 */
const LIT_PROCESSOR_V09_KEYS = ['createSurface', 'updateComponents', 'updateDataModel', 'deleteSurface'] as const;

function sortMessagesForLitProcessor(messages: A2UIMessage[]): A2UIMessage[] {
  function orderOf(msg: A2UIMessage): number {
    const m = msg as Record<string, unknown>;
    for (let i = 0; i < LIT_PROCESSOR_MESSAGE_KEYS.length; i += 1) {
      const k = LIT_PROCESSOR_MESSAGE_KEYS[i];
      if (m[k] != null) return i;
    }
    const base = LIT_PROCESSOR_MESSAGE_KEYS.length;
    for (let i = 0; i < LIT_PROCESSOR_V09_KEYS.length; i += 1) {
      const k = LIT_PROCESSOR_V09_KEYS[i];
      if (m[k] != null) return base + i;
    }
    return base + LIT_PROCESSOR_V09_KEYS.length;
  }
  return [...messages].sort((a, b) => orderOf(a) - orderOf(b));
}

function normalizeMessage(message: Record<string, any>, context: NormalizeContext): A2UIMessage {
  if (!message || typeof message !== 'object') {
    return {} as A2UIMessage;
  }

  const out: Record<string, any> = { ...message };

  if (out.dataModelUpdate && typeof out.dataModelUpdate === 'object') {
    const u = out.dataModelUpdate;
    out.dataModelUpdate = {
      ...u,
      path: u.path != null ? u.path : '/',
      contents: Array.isArray(u.contents)
        ? u.contents.map((item: Record<string, any>) => normalizeDataModelContentItem(item))
        : [],
    };
  }

  if (out.surfaceUpdate?.components && Array.isArray(out.surfaceUpdate.components)) {
    const normalizedComponents = out.surfaceUpdate.components.map((c: LooseComponent) => normalizeComponent(c, context));
    out.surfaceUpdate = {
      ...out.surfaceUpdate,
      components: normalizedComponents,
    };
  }

  if (out.updateComponents?.components && Array.isArray(out.updateComponents.components)) {
    out.updateComponents = {
      ...out.updateComponents,
      components: out.updateComponents.components.map((c: Record<string, any>) => normalizeV09UpdateComponentShape(c)),
    };
  }
  return out as A2UIMessage;
}

function normalizeDataModelContentItem(item: Record<string, any>): Record<string, any> {
  if (!item || typeof item !== 'object') {
    return item;
  }

  const next: Record<string, any> = { ...item };

  if (Array.isArray(next.valueList)) {
    next.valueList = next.valueList.map((child: Record<string, any>) => normalizeDataModelContentItem(child));
  }

  if (Array.isArray(next.valueMap)) {
    const normalizedChildren = next.valueMap
      .map((child: Record<string, any>) => normalizeDataModelContentItem(child))
      .filter((child: Record<string, any>) => child && typeof child === 'object');

    // 注意：@a2ui/web_core v0_8 data schema 不支持 valueList，仅支持 valueMap。
    // 因此这里保持协议结构不变，避免触发 ZodError。
    next.valueMap = normalizedChildren;
  }

  return next;
}

function normalizeComponent(component: LooseComponent, context: NormalizeContext): A2UIComponent {
  if (!component || typeof component !== 'object') {
    return { id: '', component: {} };
  }

  const { id = '', weight } = component;

  if (typeof component.component === 'string') {
    const typeName = component.component;
    const rawProps: Record<string, any> = {};
    Object.keys(component).forEach((key) => {
      if (!COMPONENT_RESERVED_KEYS.has(key)) {
        rawProps[key] = component[key];
      }
    });
    const normalizedProps = normalizeComponentProps(rawProps, context, typeName);
    return {
      id,
      weight,
      component: {
        [typeName]: normalizedProps,
      },
    };
  }

  if (component.component && typeof component.component === 'object') {
    const entries = Object.entries(component.component);
    if (entries.length > 0) {
      const [[typeName, props]] = entries;
      return {
        id,
        weight,
        component: {
          [typeName]: normalizeComponentProps(props, context, typeName),
        },
      };
    }
  }

  return {
    id,
    weight,
    component: component.component || {},
  };
}

function normalizeComponentProps(
  props: any,
  context: NormalizeContext,
  componentType?: string,
): Record<string, any> {
  const next = props && typeof props === 'object' ? { ...props } : {};

  // Icon：常见误用 icon，官方 @a2ui/web_core 校验要求 name + StringValue
  if (next.icon != null && next.name == null) {
    if (typeof next.icon === 'string') {
      next.name = { literalString: next.icon };
    } else if (typeof next.icon === 'object') {
      next.name = next.icon;
    }
    delete next.icon;
  }

  if (Array.isArray(next.children)) {
    next.children = { explicitList: next.children };
  }
  if (
    next.children
    && typeof next.children === 'object'
    && !Array.isArray(next.children)
    && next.children.path
    && next.children.componentId
    && !next.children.template
  ) {
    next.children = {
      template: {
        componentId: next.children.componentId,
        dataBinding: next.children.path,
      },
    };
  }

  if (typeof next.text === 'string') {
    next.text = { literalString: next.text };
  }
  if (next.text && typeof next.text === 'object' && 'call' in next.text) {
    next.text = normalizeCallText(next.text as Record<string, any>, context);
  }

  if (typeof next.name === 'string') {
    next.name = { literalString: next.name };
  }

  if (typeof next.url === 'string') {
    next.url = { literalString: next.url };
  }

  if (typeof next.label === 'string') {
    next.label = { literalString: next.label };
  }

  if (typeof next.description === 'string') {
    next.description = { literalString: next.description };
  }

  if (typeof next.value === 'string') {
    next.value = { literalString: next.value };
  }

  if (next.variant && !next.usageHint) {
    next.usageHint = next.variant;
    delete next.variant;
  }

  if (componentType === 'TextField' && typeof next.textFieldType === 'string') {
    // 历史协议里的 obscured 在 0.8 schema 中不存在，降级为 shortText 以通过校验
    const normalizedTextFieldType = next.textFieldType === 'obscured' ? 'shortText' : next.textFieldType;
    if (TEXT_FIELD_TYPES.has(normalizedTextFieldType)) {
      next.textFieldType = normalizedTextFieldType;
    } else {
      delete next.textFieldType;
    }
  }

  if (typeof next.usageHint === 'string') {
    if (componentType === 'Text') {
      // 历史数据里常用 h6，0.8 schema 不接受，降级到最接近的 h5
      const normalizedUsageHint = next.usageHint === 'h6' ? 'h5' : next.usageHint;
      if (TEXT_USAGE_HINTS.has(normalizedUsageHint)) {
        next.usageHint = normalizedUsageHint;
      } else {
        delete next.usageHint;
      }
    } else if (componentType === 'Image') {
      // 历史写法 thumbnail 在 0.8 schema 中不存在，映射到中等特征图
      const normalizedUsageHint = next.usageHint === 'thumbnail' ? 'mediumFeature' : next.usageHint;
      if (IMAGE_USAGE_HINTS.has(normalizedUsageHint)) {
        next.usageHint = normalizedUsageHint;
      } else {
        delete next.usageHint;
      }
    }
  }

  if (next.align && !next.alignment) {
    next.alignment = next.align;
    delete next.align;
  }

  if (next.justify && !next.distribution) {
    next.distribution = next.justify;
    delete next.justify;
  }

  if (next.action?.event && (!next.action.name || !('context' in next.action))) {
    next.action = next.action.event;
  }

  if (next.action && next.action.context && !Array.isArray(next.action.context) && typeof next.action.context === 'object') {
    next.action.context = Object.entries(next.action.context).map(([key, value]) => ({
      key,
      value: toLiteralValue(value),
    }));
  }

  return sanitizeForLit(next) as Record<string, any>;
}

function sanitizeForLit(value: any): any {
  if (value == null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeForLit(item))
      .filter((item) => item !== undefined);
  }
  if (typeof value === 'object') {
    const result: Record<string, any> = {};
    Object.entries(value).forEach(([key, val]) => {
      const sanitized = sanitizeForLit(val);
      if (sanitized !== undefined) {
        result[key] = sanitized;
      }
    });
    return result;
  }
  return value;
}

function normalizeCallText(callText: Record<string, any>, context: NormalizeContext): Record<string, any> {
  const callName = callText.call;
  const valueArg = callText.args?.value;
  const formatArg = callText.args?.format;

  if (callName === 'formatDate') {
    if (typeof valueArg?.path === 'string' && !valueArg.path.startsWith('/')) {
      // 模板局部上下文字段不在预处理阶段求值，交给运行时绑定
      return { path: `/${valueArg.path}` };
    }
    const raw = resolveArgValue(valueArg, context.dataModel);
    const format = typeof formatArg === 'string' ? formatArg : undefined;
    return { literalString: formatDateValue(raw, format) };
  }

  if (callName === 'formatString') {
    const raw = resolveArgValue(valueArg, context.dataModel);
    if (typeof raw === 'string') {
      const localRefs = collectLocalTemplateRefs(raw);
      if (localRefs.length > 0) {
        const fieldName = ensureFormatTemplateField(context, raw);
        return { path: `/${fieldName}` };
      }
      const rendered = raw.replace(/\$\{([^}]+)\}/g, (_, expr) => {
        const keyPath = String(expr).trim();
        if (keyPath.startsWith('/')) {
          const val = getValueByPath(context.dataModel, keyPath);
          return val == null ? '' : String(val);
        }
        return '';
      });
      return { literalString: rendered };
    }
    return { literalString: raw == null ? '' : String(raw) };
  }

  if (valueArg?.path) {
    return { path: valueArg.path };
  }
  if (typeof valueArg?.literalString === 'string') {
    return { literalString: valueArg.literalString };
  }
  return { literalString: '' };
}

type NormalizeContext = {
  dataModel: Record<string, any>
  formatTemplateFieldMap: Map<string, string>
};

function ensureFormatTemplateField(context: NormalizeContext, template: string): string {
  const existed = context.formatTemplateFieldMap.get(template);
  if (existed) return existed;
  const fieldName = `__fmt_${context.formatTemplateFieldMap.size}`;
  context.formatTemplateFieldMap.set(template, fieldName);
  return fieldName;
}

function collectLocalTemplateRefs(template: string): string[] {
  const refs: string[] = [];
  template.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    const keyPath = String(expr).trim();
    if (keyPath && !keyPath.startsWith('/')) {
      refs.push(keyPath);
    }
    return '';
  });
  return refs;
}

function enrichDataModelWithFormatTemplates(
  dataModel: Record<string, any>,
  templateFieldMap: Map<string, string>,
): Record<string, any> {
  const walk = (node: any): any => {
    if (Array.isArray(node)) {
      return node.map((item) => walk(item));
    }
    if (!node || typeof node !== 'object') {
      return node;
    }
    const next: Record<string, any> = {};
    Object.entries(node).forEach(([k, v]) => {
      next[k] = walk(v);
    });
    templateFieldMap.forEach((fieldName, template) => {
      const rendered = renderTemplateByLocalNode(template, next);
      if (rendered != null) {
        next[fieldName] = rendered;
      }
    });
    return next;
  };
  return walk(dataModel);
}

function renderTemplateByLocalNode(template: string, node: Record<string, any>): string | null {
  let missingLocal = false;
  const rendered = template.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    const keyPath = String(expr).trim();
    if (!keyPath) return '';
    if (keyPath.startsWith('/')) return `\${${keyPath}}`;
    const val = getValueByDotPath(node, keyPath);
    if (val == null) {
      missingLocal = true;
      return '';
    }
    return String(val);
  });
  return missingLocal ? null : rendered;
}

function getValueByDotPath(source: Record<string, any>, path: string): any {
  const keys = path.split('.').filter(Boolean);
  let current: any = source;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

function rewriteRootDataModelUpdate(message: A2UIMessage, model: Record<string, any>): A2UIMessage {
  if (!message.dataModelUpdate || (message.dataModelUpdate.path && message.dataModelUpdate.path !== '/')) {
    return message;
  }
  return {
    ...message,
    dataModelUpdate: {
      ...message.dataModelUpdate,
      contents: Object.entries(model).map(([key, value]) => ({
        key,
        ...toValueContent(value),
      })),
    },
  };
}

function expandMessageTemplates(message: A2UIMessage, dataModel: Record<string, any>): A2UIMessage {
  if (!message.surfaceUpdate?.components) return message;
  const expanded = expandTemplateComponents(message.surfaceUpdate.components, dataModel);
  return {
    ...message,
    surfaceUpdate: {
      ...message.surfaceUpdate,
      components: expanded,
    },
  };
}

function expandTemplateComponents(components: A2UIComponent[], dataModel: Record<string, any>): A2UIComponent[] {
  const byId = new Map<string, A2UIComponent>();
  components.forEach((c) => byId.set(c.id, c));
  const output: A2UIComponent[] = [];
  const generatedIds = new Set<string>();
  const clonedNodes: A2UIComponent[] = [];

  const cloneSubTree = (rootId: string, item: Record<string, any>, suffix: string): string => {
    const source = byId.get(rootId);
    if (!source) return rootId;
    const nextId = `${rootId}__${suffix}`;
    if (generatedIds.has(nextId)) return nextId;
    generatedIds.add(nextId);

    const rootEntry = Object.entries(source.component)[0] as [string, Record<string, any>] | undefined;
    if (!rootEntry) return rootId;
    const [typeName, rawProps] = rootEntry;
    const props = rawProps ? { ...rawProps } : {};

    if (props.text && typeof props.text === 'object') {
      if (typeof props.text.path === 'string' && props.text.path.startsWith('/')) {
        const localKey = props.text.path.slice(1);
        const localVal = getValueByDotPath(item, localKey);
        if (localVal != null) {
          props.text = { literalString: String(localVal) };
        }
      }
      if (typeof props.text.path === 'string' && !props.text.path.startsWith('/')) {
        const localVal = getValueByDotPath(item, props.text.path);
        props.text = { literalString: localVal == null ? '' : String(localVal) };
      }
      if (props.text.call === 'formatDate') {
        const path = props.text?.args?.value?.path;
        if (typeof path === 'string' && !path.startsWith('/')) {
          const localVal = getValueByDotPath(item, path);
          props.text = { literalString: formatDateValue(localVal, props.text?.args?.format) };
        }
      }
      if (props.text.call === 'formatString') {
        const tpl = props.text?.args?.value;
        if (typeof tpl === 'string') {
          const rendered = tpl.replace(/\$\{([^}]+)\}/g, (_, expr) => {
            const keyPath = String(expr).trim();
            if (!keyPath || keyPath.startsWith('/')) return '';
            const localVal = getValueByDotPath(item, keyPath);
            return localVal == null ? '' : String(localVal);
          });
          props.text = { literalString: rendered };
        }
      }
    }

    if (props.children?.explicitList && Array.isArray(props.children.explicitList)) {
      const nextChildren = props.children.explicitList.map((childId: string, childIdx: number) =>
        cloneSubTree(childId, item, `${suffix}_${childIdx}`));
      props.children = { explicitList: nextChildren };
    }

    const cloned: A2UIComponent = {
      ...source,
      id: nextId,
      component: {
        [typeName]: props,
      },
    };
    clonedNodes.push(cloned);
    return nextId;
  };

  components.forEach((comp) => {
    const entry = Object.entries(comp.component)[0] as [string, Record<string, any>] | undefined;
    if (!entry) {
      output.push(comp);
      return;
    }
    const [typeName, rawProps] = entry;
    const props = rawProps ? { ...rawProps } : {};
    const template = props.children?.template;
    if (!template || typeof template !== 'object') {
      output.push(comp);
      return;
    }
    const { dataBinding } = template;
    const { componentId } = template;
    if (typeof dataBinding !== 'string' || typeof componentId !== 'string') {
      output.push(comp);
      return;
    }
    const items = getValueByPath(dataModel, dataBinding);
    if (!Array.isArray(items)) {
      output.push(comp);
      return;
    }
    const explicitList = items.map((item, idx) =>
      cloneSubTree(componentId, item && typeof item === 'object' ? item : { value: item }, `t${idx}`));
    output.push({
      ...comp,
      component: {
        [typeName]: {
          ...props,
          children: { explicitList },
        },
      },
    });
  });

  return [...output, ...clonedNodes];
}

function resolveArgValue(valueArg: any, dataModel: Record<string, any>): any {
  if (!valueArg || typeof valueArg !== 'object') {
    return valueArg;
  }
  if (typeof valueArg.path === 'string') {
    return getValueByPath(dataModel, valueArg.path);
  }
  if ('literalString' in valueArg) return valueArg.literalString;
  if ('literalNumber' in valueArg) return valueArg.literalNumber;
  if ('literalBoolean' in valueArg) return valueArg.literalBoolean;
  return valueArg;
}

function getValueByPath(dataModel: Record<string, any>, path: string): any {
  if (!path || path === '/') return dataModel;
  const keys = path.split('/').filter(Boolean);
  let current: any = dataModel;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

function formatDateValue(value: any, format?: string): string {
  if (value == null || value === '') return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const fmt = (format || '').trim();
  if (!fmt) {
    return date.toISOString();
  }

  // Intl 风格
  if (fmt === 'E, MMM d') {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }
  if (fmt === 'h:mm a') {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    }).format(date);
  }
  if (fmt === 'MMM d, yyyy') {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }
  if (fmt === 'MMMM d, yyyy') {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }
  if (fmt === 'yyyy-MM-dd') {
    return `${getUTCYear(date)}-${pad2(getUTCMonth(date))}-${pad2(getUTCDayOfMonth(date))}`;
  }
  if (fmt === 'yyyy/MM/dd') {
    return `${getUTCYear(date)}/${pad2(getUTCMonth(date))}/${pad2(getUTCDayOfMonth(date))}`;
  }
  if (fmt === 'MM/dd/yyyy') {
    return `${pad2(getUTCMonth(date))}/${pad2(getUTCDayOfMonth(date))}/${getUTCYear(date)}`;
  }
  if (fmt === 'dd/MM/yyyy') {
    return `${pad2(getUTCDayOfMonth(date))}/${pad2(getUTCMonth(date))}/${getUTCYear(date)}`;
  }
  if (fmt === 'HH:mm') {
    return `${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}`;
  }
  if (fmt === 'HH:mm:ss') {
    return `${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}:${pad2(date.getUTCSeconds())}`;
  }
  if (fmt === 'yyyy-MM-dd HH:mm') {
    return `${getUTCYear(date)}-${pad2(getUTCMonth(date))}-${pad2(getUTCDayOfMonth(date))} ${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}`;
  }
  if (fmt === 'yyyy-MM-dd HH:mm:ss') {
    return `${getUTCYear(date)}-${pad2(getUTCMonth(date))}-${pad2(getUTCDayOfMonth(date))} ${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}:${pad2(date.getUTCSeconds())}`;
  }
  if (fmt === 'iso' || fmt === 'ISO') {
    return date.toISOString();
  }

  // 星期：Gallery 常用 E 表示星期简写；未实现时勿回退到 ISO 整串，否则界面会出现一长串日期字母
  if (fmt === 'E' || fmt === 'EEE') {
    return new Intl.DateTimeFormat('zh-CN', { weekday: 'short' }).format(date);
  }
  if (fmt === 'EEEE') {
    return new Intl.DateTimeFormat('zh-CN', { weekday: 'long' }).format(date);
  }

  return date.toISOString();
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function getUTCYear(date: Date): number {
  return date.getUTCFullYear();
}

function getUTCMonth(date: Date): number {
  return date.getUTCMonth() + 1;
}

function getUTCDayOfMonth(date: Date): number {
  return date.getUTCDate();
}

function extractDataModelFromMessages(messages: Record<string, any>[]): Record<string, any> {
  const model: Record<string, any> = {};
  messages.forEach((msg) => {
    const update = msg?.dataModelUpdate;
    if (!update || !Array.isArray(update.contents)) return;
    if (update.path && update.path !== '/') return;
    update.contents.forEach((item: Record<string, any>) => {
      if (!item || typeof item.key !== 'string') return;
      model[item.key] = parseContentValue(item);
    });
  });
  return model;
}

function parseContentValue(item: Record<string, any>): any {
  if ('valueString' in item) return item.valueString;
  if ('valueNumber' in item) return item.valueNumber;
  if ('valueBoolean' in item) return item.valueBoolean;
  if (Array.isArray(item.valueList)) {
    return item.valueList.map((child: Record<string, any>) => parseContentValue(child));
  }
  if (Array.isArray(item.valueMap)) {
    const obj: Record<string, any> = {};
    item.valueMap.forEach((child: Record<string, any>) => {
      if (typeof child?.key === 'string') {
        obj[child.key] = parseContentValue(child);
      }
    });
    const numericKeys = Object.keys(obj)
      .filter((k) => /^\d+$/.test(k))
      .map((k) => Number(k))
      .sort((a, b) => a - b);
    const isPureIndexMap = numericKeys.length > 0
      && numericKeys.length === Object.keys(obj).length
      && numericKeys.every((value, index) => value === index);
    if (isPureIndexMap) {
      return numericKeys.map((idx) => obj[String(idx)]);
    }
    return obj;
  }
  return '';
}

function toLiteralValue(value: any): Record<string, any> {
  if (typeof value === 'string') return { literalString: value };
  if (typeof value === 'number') return { literalNumber: value };
  if (typeof value === 'boolean') return { literalBoolean: value };
  if (value && typeof value === 'object' && ('path' in value || 'literalString' in value || 'literalNumber' in value || 'literalBoolean' in value)) {
    return value;
  }
  return { literalString: value == null ? '' : String(value) };
}

function toValueContent(value: any): Record<string, any> {
  if (typeof value === 'string') return { valueString: value };
  if (typeof value === 'number') return { valueNumber: value };
  if (typeof value === 'boolean') return { valueBoolean: value };
  if (value == null) return { valueString: '' };
  if (Array.isArray(value)) {
    return {
      valueList: value.map((item) => {
        const normalized = toValueContent(item);
        const { key, ...rest } = normalized;
        return key ? rest : normalized;
      }),
    };
  }
  if (typeof value === 'object') {
    return {
      valueMap: Object.entries(value).map(([k, v]) => ({
        key: k,
        ...toValueContent(v),
      })),
    };
  }
  return { valueString: String(value) };
}
