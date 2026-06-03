import { A2uiSurface, basicCatalog } from '@a2ui/lit/v0_9';
import { Catalog, MessageProcessor } from '@a2ui/web_core/v0_9';
import { z } from 'zod';
import { renderMarkdown } from '@a2ui/markdown-it';

// basicCatalog 侧链只注册各原子组件，不会加载 surface 模块；此处引用 A2uiSurface 以触发 customElements.define('a2ui-surface', …)
if (typeof A2uiSurface !== 'function') {
  throw new Error('[a2ui-render] @a2ui/lit v0.9 未正确导出 A2uiSurface，无法注册 a2ui-surface');
}

/**
 * v0.9 Text tagName 为 a2ui-basic-text：内部用 consume 取 markdownRenderer，仅靠 Surface 侧 ContextProvider
 * 在多层 shadow 或首次绘制时序下仍可能为 undefined，标题会显示 「# …」字面量。
 * 与 v0.8 litCompat08 patchThemeGuard 一致：在 connectedCallback、willUpdate、render 前注入 renderMarkdown。
 */
function patchV09BasicTextMarkdownRenderer() {
  if (typeof customElements === 'undefined') return;
  const Ctor = customElements.get('a2ui-basic-text');
  if (!Ctor || !Ctor.prototype || Ctor.prototype.__a2uiMarkdownDirectPatched) return;
  Object.defineProperty(Ctor.prototype, '__a2uiMarkdownDirectPatched', { value: true, enumerable: false });
  function ensureMarkdownRenderer(host) {
    if (host && !host.markdownRenderer && typeof renderMarkdown === 'function') {
      host.markdownRenderer = renderMarkdown;
    }
  }
  ['connectedCallback', 'willUpdate', 'render'].forEach((methodName) => {
    const original = Ctor.prototype[methodName];
    if (typeof original !== 'function') return;
    Ctor.prototype[methodName] = function a2uiBasicTextMarkdownGuard(...args) {
      ensureMarkdownRenderer(this);
      return original.apply(this, args);
    };
  });
}

patchV09BasicTextMarkdownRenderer();

/** 与 basicCatalog.id 一致，保证 createSurface.catalogId 仍指向官方 basic_catalog URL */
const v09PendingCustomApis = [];

/** Playground 等环境使用的简写；空值视为选用当前合并后的 basic 目录 */
const V09_BASIC_CATALOG_ID_ALIASES = new Set(['standard', 'default', 'basic']);

/**
 * @param {unknown} raw
 * @returns {string}
 */
function resolveV09CatalogId(raw) {
  if (raw == null) return basicCatalog.id;
  const s = String(raw).trim();
  if (s === '') return basicCatalog.id;
  if (V09_BASIC_CATALOG_ID_ALIASES.has(s.toLowerCase())) return basicCatalog.id;
  return s;
}

/**
 * 仅改写 createSurface.catalogId，其余字段原样保留
 * @param {Record<string, unknown>} msg
 */
function withNormalizedV09CreateSurfaceCatalogId(msg) {
  if (!msg.createSurface || typeof msg.createSurface !== 'object') return msg;
  const cs = msg.createSurface;
  const resolved = resolveV09CatalogId(cs.catalogId);
  if (resolved === cs.catalogId) return msg;
  return {
    ...msg,
    createSurface: {
      ...cs,
      catalogId: resolved,
    },
  };
}

function defaultTagNameForTypeName(typeName) {
  return `a2ui-${String(typeName).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`;
}

function catalogSchemaFromUser(schema) {
  if (schema && typeof schema.safeParse === 'function') {
    return schema;
  }
  return z.object({}).passthrough();
}

function buildV09MergedCatalog() {
  const baseComponents = Array.from(basicCatalog.components.values());
  return new Catalog(
    basicCatalog.id,
    [...baseComponents, ...v09PendingCustomApis],
    Array.from(basicCatalog.functions.values()),
    basicCatalog.themeSchema,
  );
}

export const componentRegistry = {
  clearPendingV09CustomApis() {
    v09PendingCustomApis.length = 0;
  },
  register(typeName, elementCtor, tagName, schema) {
    if (!typeName || typeof elementCtor !== 'function') return;
    const resolvedTag = tagName && String(tagName).trim()
      ? String(tagName).trim()
      : defaultTagNameForTypeName(typeName);
    const zodSchema = catalogSchemaFromUser(schema);
    v09PendingCustomApis.push({
      name: typeName,
      tagName: resolvedTag,
      schema: zodSchema,
    });
    if (typeof customElements !== 'undefined' && !customElements.get(resolvedTag)) {
      try {
        customElements.define(resolvedTag, elementCtor);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[a2ui-render] v0.9 customElements.define failed', resolvedTag, e);
      }
    }
  },
};

export function registerCustomComponents() {
  // 与 0.8 对称的兼容入口；v0.9 实际注册走 componentRegistry.register
}

function normalizeLegacyComponent(component) {
  if (!component || typeof component !== 'object') {
    return component;
  }
  if (typeof component.component === 'string') {
    return component;
  }
  if (!component.component || typeof component.component !== 'object') {
    return component;
  }
  const entries = Object.entries(component.component);
  if (entries.length === 0) {
    return component;
  }
  const [typeName, props] = entries[0];
  return {
    id: component.id,
    component: typeName,
    ...(props && typeof props === 'object' ? props : {}),
  };
}

function parseLegacyDataModelValue(item) {
  if (!item || typeof item !== 'object') {
    return undefined;
  }
  if ('valueString' in item) return item.valueString;
  if ('valueNumber' in item) return item.valueNumber;
  if ('valueBoolean' in item) return item.valueBoolean;
  if (Array.isArray(item.valueList)) {
    return item.valueList.map((child) => parseLegacyDataModelValue(child));
  }
  if (Array.isArray(item.valueMap)) {
    const out = {};
    item.valueMap.forEach((child) => {
      if (!child || typeof child !== 'object' || typeof child.key !== 'string') return;
      out[child.key] = parseLegacyDataModelValue(child);
    });
    return out;
  }
  return undefined;
}

function isV09NativeTransportEnvelope(msg) {
  if (!msg || typeof msg !== 'object') return false;
  const hasV09 = Boolean(
    msg.createSurface || msg.updateComponents || msg.updateDataModel || msg.deleteSurface,
  );
  const hasLegacy = Boolean(msg.beginRendering || msg.surfaceUpdate || msg.dataModelUpdate);
  return hasV09 && !hasLegacy;
}

function convertLegacyMessagesToV09(messages) {
  const out = [];
  messages.forEach((msg) => {
    if (!msg || typeof msg !== 'object') return;

    /** 原生 v0.9 传输：服务端可不传 version，此处补齐以通过 @a2ui/web_core MessageProcessor */
    if (isV09NativeTransportEnvelope(msg)) {
      const versioned = msg.version === 'v0.9' ? msg : { ...msg, version: 'v0.9' };
      out.push(withNormalizedV09CreateSurfaceCatalogId(versioned));
      return;
    }

    if (msg.beginRendering && msg.beginRendering.surfaceId) {
      out.push({
        version: 'v0.9',
        createSurface: {
          surfaceId: msg.beginRendering.surfaceId,
          catalogId: basicCatalog.id,
        },
      });
      return;
    }

    if (msg.surfaceUpdate && msg.surfaceUpdate.surfaceId) {
      out.push({
        version: 'v0.9',
        updateComponents: {
          surfaceId: msg.surfaceUpdate.surfaceId,
          components: Array.isArray(msg.surfaceUpdate.components)
            ? msg.surfaceUpdate.components.map((component) => normalizeLegacyComponent(component))
            : [],
        },
      });
      return;
    }

    if (msg.dataModelUpdate && msg.dataModelUpdate.surfaceId) {
      const { value: initialValue, contents } = msg.dataModelUpdate;
      let value = initialValue;
      if (value == null && Array.isArray(contents)) {
        value = {};
        contents.forEach((item) => {
          if (!item || typeof item !== 'object' || typeof item.key !== 'string') return;
          value[item.key] = parseLegacyDataModelValue(item);
        });
      }
      out.push({
        version: 'v0.9',
        updateDataModel: {
          surfaceId: msg.dataModelUpdate.surfaceId,
          path: msg.dataModelUpdate.path || '/',
          value: value ?? {},
        },
      });
      return;
    }

    if (msg.deleteSurface && msg.deleteSurface.surfaceId) {
      out.push({
        version: 'v0.9',
        deleteSurface: {
          surfaceId: msg.deleteSurface.surfaceId,
        },
      });
    }
  });
  return out;
}

class A2uiV09ProcessorAdapter {
  constructor() {
    this.processor = new MessageProcessor([buildV09MergedCatalog()]);
  }

  processMessages(messages) {
    let list = [];
    if (Array.isArray(messages)) {
      list = messages;
    } else if (messages && Array.isArray(messages.messages)) {
      list = messages.messages;
    }
    this.processor.processMessages(convertLegacyMessagesToV09(list));
  }

  getSurfaces() {
    return this.processor.model.surfacesMap;
  }

  clearSurfaces() {
    const deleteMessages = Array.from(this.processor.model.surfacesMap.keys()).map((surfaceId) => ({
      version: 'v0.9',
      deleteSurface: {
        surfaceId,
      },
    }));
    if (deleteMessages.length > 0) {
      this.processor.processMessages(deleteMessages);
    }
  }

  onAction(handler) {
    const sub = this.processor.model.onAction.subscribe((event) => handler(event));
    return () => sub.unsubscribe();
  }
}

export function createSignalA2uiMessageProcessor() {
  return new A2uiV09ProcessorAdapter();
}
