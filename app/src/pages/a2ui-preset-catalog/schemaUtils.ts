export type PropRow = {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue: string;
};

type JsonSchema = Record<string, unknown>;

function isRecord(value: unknown): value is JsonSchema {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function formatType(prop: JsonSchema): string {
  if (typeof prop.const === 'string') {
    return `"${prop.const}"`;
  }
  if (Array.isArray(prop.enum)) {
    return prop.enum.map((item) => `"${String(item)}"`).join(' | ');
  }
  if (prop.type === 'array' && isRecord(prop.items)) {
    return `Array<${formatType(prop.items)}>`;
  }
  if (prop.type === 'object') {
    return 'object';
  }
  if (typeof prop.$ref === 'string') {
    const ref = prop.$ref;
    if (ref.includes('DynamicString')) return 'string | { path }';
    if (ref.includes('DynamicValue')) return 'any | { path } | { call }';
    if (ref.includes('ComponentId')) return 'string';
    if (ref.includes('Action')) return 'Action';
    if (ref.includes('ChildList')) return 'string[] | { componentId, path }';
    const tail = ref.split('/').pop() ?? ref;
    return tail;
  }
  if (typeof prop.type === 'string') {
    return prop.type;
  }
  return '-';
}

function extractComponentSchema(schema: JsonSchema): JsonSchema | null {
  const allOf = schema.allOf;
  if (!Array.isArray(allOf)) return null;

  for (const entry of allOf) {
    if (!isRecord(entry)) continue;
    const properties = entry.properties;
    if (!isRecord(properties)) continue;
    const component = properties.component;
    if (isRecord(component) && typeof component.const === 'string') {
      return entry;
    }
  }
  return null;
}

export function extractPropsFromSchema(schema: JsonSchema): PropRow[] {
  const componentSchema = extractComponentSchema(schema);
  if (!componentSchema) return [];

  const properties = componentSchema.properties;
  if (!isRecord(properties)) return [];

  const required = Array.isArray(componentSchema.required)
    ? componentSchema.required.filter((item): item is string => typeof item === 'string')
    : [];

  return Object.entries(properties)
    .filter(([name]) => name !== 'component')
    .map(([name, rawProp]) => {
      const prop = isRecord(rawProp) ? rawProp : {};
      return {
        name,
        type: formatType(prop),
        description: typeof prop.description === 'string' ? prop.description : '-',
        required: required.includes(name),
        defaultValue: '-',
      };
    });
}
