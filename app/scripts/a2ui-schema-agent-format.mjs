/* eslint-disable no-restricted-syntax */
/**
 * 将 zod-to-json-schema 产物转为 Agent 友好的 A2UI catalog 片段：
 * - DynamicString 等用 $ref 指向 common_types.json，不再内联 anyOf
 * - 组件 schema 使用与 basic_catalog 一致的 allOf + component const 结构
 */

const REF_PREFIX = 'REF:';

/** 与官方 basic_catalog $defs/CatalogComponentCommon 一致 */
const CATALOG_COMPONENT_COMMON = {
  type: 'object',
  properties: {
    weight: {
      type: 'number',
      description:
        'The relative weight of this component within a Row or Column. This is similar to the CSS flex-grow property. Note: this may ONLY be set when the component is a direct descendant of a Row or Column.',
    },
  },
};

/**
 * @param {string | undefined} desc
 * @returns {{ ref: string, description: string } | null}
 */
function parseRefDescription(desc) {
  if (typeof desc !== 'string' || !desc.startsWith(REF_PREFIX)) {
    return null;
  }
  const pipe = desc.indexOf('|');
  if (pipe === -1) {
    return { ref: desc.slice(REF_PREFIX.length), description: '' };
  }
  return {
    ref: desc.slice(REF_PREFIX.length, pipe),
    description: desc.slice(pipe + 1),
  };
}

/**
 * @param {unknown} node
 * @returns {boolean}
 */
function isDynamicTypeNode(node) {
  if (!node || typeof node !== 'object') return false;
  const n = /** @type {Record<string, unknown>} */ (node);
  if (parseRefDescription(/** @type {string} */ (n.description))) return true;
  const union = n.anyOf ?? n.oneOf;
  if (!Array.isArray(union)) return false;
  return union.some(branch => {
    const b = /** @type {Record<string, unknown>} */ (branch);
    if (b.type === 'string' && !b.enum) return true;
    if (b.type === 'object' && b.properties?.path) return true;
    if (b.type === 'object' && b.properties?.call) return true;
    return Boolean(parseRefDescription(/** @type {string} */ (b.description)));
  });
}

/**
 * @param {unknown} node
 * @returns {unknown}
 */
function rewriteSchemaNode(node) {
  if (node == null || typeof node !== 'object') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(rewriteSchemaNode);
  }

  const obj = /** @type {Record<string, unknown>} */ ({ ...node });

  const refInfo = parseRefDescription(/** @type {string} */ (obj.description));
  if (refInfo && (obj.anyOf || obj.oneOf || obj.$ref)) {
    const out = { $ref: refInfo.ref };
    if (refInfo.description) {
      out.description = refInfo.description;
    }
    return out;
  }

  if (isDynamicTypeNode(obj) && (obj.anyOf || obj.oneOf)) {
    const dynRef = parseRefDescription(/** @type {string} */ (obj.description));
    if (dynRef) {
      const out = { $ref: dynRef.ref };
      if (dynRef.description) {
        out.description = dynRef.description;
      }
      return out;
    }
  }

  if (obj.properties && typeof obj.properties === 'object') {
    const props = /** @type {Record<string, unknown>} */ (obj.properties);
    const next = {};
    for (const [key, val] of Object.entries(props)) {
      next[key] = rewriteSchemaNode(val);
    }
    obj.properties = next;
  }

  if (obj.items) {
    obj.items = rewriteSchemaNode(obj.items);
  }

  for (const key of ['allOf', 'anyOf', 'oneOf']) {
    if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map(rewriteSchemaNode);
    }
  }

  return obj;
}

/**
 * @param {string} componentName
 * @param {Record<string, unknown>} flatSchema zod 生成的 props schema
 * @returns {Record<string, unknown>}
 */
export function toAgentCatalogComponent(componentName, flatSchema) {
  const propsSchema = rewriteSchemaNode({
    type: 'object',
    properties: flatSchema.properties ?? {},
    required: flatSchema.required,
    additionalProperties: true,
  });

  const inner = /** @type {Record<string, unknown>} */ (propsSchema);
  const properties = /** @type {Record<string, unknown>} */ (inner.properties ?? {});
  properties.component = { const: componentName };

  const required = new Set(
    Array.isArray(inner.required) ? /** @type {string[]} */ (inner.required) : [],
  );
  required.add('component');
  inner.required = [...required];

  return {
    type: 'object',
    allOf: [
      { $ref: 'common_types.json#/$defs/ComponentCommon' },
      { $ref: '#/$defs/CatalogComponentCommon' },
      inner,
    ],
  };
}

/**
 * @param {string} componentName
 * @param {Record<string, unknown>} flatSchema
 */
export function toAgentComponentSchemaFile(componentName, flatSchema) {
  const catalogComponent = toAgentCatalogComponent(componentName, flatSchema);
  return {
    title: componentName,
    description: `A2UI catalog component definition for ${componentName}.`,
    ...catalogComponent,
    $defs: {
      CatalogComponentCommon: CATALOG_COMPONENT_COMMON,
    },
  };
}
