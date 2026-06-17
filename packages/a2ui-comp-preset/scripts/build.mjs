/**
 * @boteai/a2ui-comp-preset 唯一构建脚本
 *
 * 流程：manifest → 样式嵌入 → registry → schema → esbuild ESM + tsc 类型
 * 用法：node scripts/build.mjs [--watch]
 */
/* eslint-disable no-console, no-restricted-syntax */
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import less from 'less';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');
const distDir = path.join(root, 'dist/esm');
const schemasDir = path.join(srcDir, 'schemas');
const themeDir = path.join(srcDir, 'theme/less');
const cacheDir = path.join(root, 'node_modules/.cache/a2ui-preset-build');
const watch = process.argv.includes('--watch');

// ─── manifest ───────────────────────────────────────────────────────────────

function parsePresetNames() {
  const manifestPath = path.join(srcDir, 'manifest.ts');
  const source = fs.readFileSync(manifestPath, 'utf8');
  const match = source.match(/export const PRESET_COMPONENTS = \[([\s\S]*?)\] as const/);
  if (!match) throw new Error('[build] 无法解析 src/manifest.ts 中的 PRESET_COMPONENTS');
  const names = [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  if (names.length === 0) throw new Error('[build] PRESET_COMPONENTS 为空');
  return names;
}

// ─── 1. Less → styles.generated.ts ─────────────────────────────────────────

async function embedStyles(names) {
  let count = 0;
  for (const name of names) {
    const lessPath = path.join(srcDir, name, 'index.less');
    if (!fs.existsSync(lessPath)) continue;

    const outPath = path.join(srcDir, name, 'styles.generated.ts');
    try {
      const source = fs.readFileSync(lessPath, 'utf8');
      const { css } = await less.render(source, {
        filename: lessPath,
        paths: [path.dirname(lessPath), themeDir, srcDir],
      });
      fs.writeFileSync(
        outPath,
        [
          '/* eslint-disable max-len */',
          `/** 由 scripts/build.mjs 从 ${name}/index.less 生成，请勿手改 */`,
          `export default ${JSON.stringify(css)};`,
          '',
        ].join('\n'),
        'utf8',
      );
      console.log(`  ${name}/styles.generated.ts  ${(css.length / 1024).toFixed(1)} KB`);
      count += 1;
    } catch (err) {
      console.error(`[build] Less 编译失败 ${lessPath}:`, err.message);
      fs.writeFileSync(outPath, "export default '';", 'utf8');
    }
  }
  console.log(`[build] 样式嵌入完成（${count} 个组件）`);
}

// ─── 2. registry.ts ──────────────────────────────────────────────────────────

function writeRegistry(names) {
  const imports = names.map((n) => `import { a2uiRemoteRegistry as ${n} } from './${n}/index';`).join('\n');
  const content = `/**
 * 本文件由 scripts/build.mjs 自动生成，请勿手改。
 * 源: src/manifest.ts
 */
import { mergeRegistryEntries } from '@boteai/a2ui-custom-kit';
${imports}

export const a2uiPresetComponentRegistry = mergeRegistryEntries(
  ${names.join(',\n  ')},
);
`;
  fs.writeFileSync(path.join(srcDir, 'registry.ts'), content, 'utf8');
  console.log('[build] src/registry.ts');
}

// ─── 3. JSON Schema + presetSchemas.generated.ts ─────────────────────────────

const REF_PREFIX = 'REF:';
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

function parseRefDescription(desc) {
  if (typeof desc !== 'string' || !desc.startsWith(REF_PREFIX)) return null;
  const pipe = desc.indexOf('|');
  if (pipe === -1) return { ref: desc.slice(REF_PREFIX.length), description: '' };
  return { ref: desc.slice(REF_PREFIX.length), description: desc.slice(pipe + 1) };
}

function isDynamicTypeNode(node) {
  if (!node || typeof node !== 'object') return false;
  if (parseRefDescription(node.description)) return true;
  const union = node.anyOf ?? node.oneOf;
  if (!Array.isArray(union)) return false;
  return union.some((branch) => {
    if (branch.type === 'string' && !branch.enum) return true;
    if (branch.type === 'object' && branch.properties?.path) return true;
    if (branch.type === 'object' && branch.properties?.call) return true;
    return Boolean(parseRefDescription(branch.description));
  });
}

function rewriteSchemaNode(node) {
  if (node == null || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map(rewriteSchemaNode);

  const obj = { ...node };
  const refInfo = parseRefDescription(obj.description);
  if (refInfo && (obj.anyOf || obj.oneOf || obj.$ref)) {
    const out = { $ref: refInfo.ref };
    if (refInfo.description) out.description = refInfo.description;
    return out;
  }
  if (isDynamicTypeNode(obj) && (obj.anyOf || obj.oneOf)) {
    const dynRef = parseRefDescription(obj.description);
    if (dynRef) {
      const out = { $ref: dynRef.ref };
      if (dynRef.description) out.description = dynRef.description;
      return out;
    }
  }
  if (obj.properties && typeof obj.properties === 'object') {
    const next = {};
    for (const [key, val] of Object.entries(obj.properties)) {
      next[key] = rewriteSchemaNode(val);
    }
    obj.properties = next;
  }
  if (obj.items) obj.items = rewriteSchemaNode(obj.items);
  for (const key of ['allOf', 'anyOf', 'oneOf']) {
    if (Array.isArray(obj[key])) obj[key] = obj[key].map(rewriteSchemaNode);
  }
  return obj;
}

function toAgentComponentSchemaFile(componentName, flatSchema) {
  const propsSchema = rewriteSchemaNode({
    type: 'object',
    properties: flatSchema.properties ?? {},
    required: flatSchema.required,
    additionalProperties: true,
  });
  const inner = propsSchema;
  const properties = inner.properties ?? {};
  properties.component = { const: componentName };
  const required = new Set(Array.isArray(inner.required) ? inner.required : []);
  required.add('component');
  inner.required = [...required];

  return {
    title: componentName,
    description: `A2UI catalog component definition for ${componentName}.`,
    type: 'object',
    allOf: [
      { $ref: 'common_types.json#/$defs/ComponentCommon' },
      { $ref: '#/$defs/CatalogComponentCommon' },
      inner,
    ],
    $defs: { CatalogComponentCommon: CATALOG_COMPONENT_COMMON },
  };
}

function resolveKitRemoteRuntimeEntry() {
  const entryRel = 'dist/esm/remote-runtime/index.js';
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const fileSpec = pkg.dependencies?.['@boteai/a2ui-custom-kit'];
  const candidates = [
    typeof fileSpec === 'string' && fileSpec.startsWith('file:')
      ? path.join(root, fileSpec.slice('file:'.length), entryRel)
      : null,
    path.join(root, 'node_modules/@boteai/a2ui-custom-kit', entryRel),
    path.resolve(root, '../a2ui-custom-kit', entryRel),
  ].filter(Boolean);

  const hit = candidates.find((p) => fs.existsSync(p));
  if (!hit) {
    throw new Error('[build] 未找到 @boteai/a2ui-custom-kit/remote-runtime，请先构建 a2ui-custom-kit');
  }
  return hit;
}

function buildSchemaRegistrySource(names) {
  const imports = names.map((n) => `import { ${n}Api } from '../../../src/${n}/api';`).join('\n');
  const entries = names.map((n) => `  { name: '${n}', api: ${n}Api },`).join('\n');
  return `import { componentApiToJsonSchema2019 } from '@boteai/a2ui-custom-kit';

${imports}

export const schemaRegistry = [
${entries}
] as const;

export function buildSchemaDocuments() {
  return schemaRegistry.map(({ name, api }) => ({
    name,
    json: componentApiToJsonSchema2019(api),
  }));
}
`;
}

async function generateSchemas(names) {
  fs.mkdirSync(schemasDir, { recursive: true });
  fs.mkdirSync(cacheDir, { recursive: true });

  const registrySrc = path.join(cacheDir, 'schema-registry.ts');
  const bundleOut = path.join(cacheDir, 'schema-gen.mjs');
  fs.writeFileSync(registrySrc, buildSchemaRegistrySource(names), 'utf8');

  await esbuild.build({
    entryPoints: [registrySrc],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: bundleOut,
    alias: { '@boteai/a2ui-custom-kit/remote-runtime': resolveKitRemoteRuntimeEntry() },
    logLevel: 'silent',
  });

  const mod = await import(pathToFileURL(bundleOut).href);
  const docs = mod.buildSchemaDocuments();
  if (!Array.isArray(docs) || docs.length === 0) {
    throw new Error('[build] schemaRegistry 为空');
  }

  const schemaEntries = [];
  for (const { name, json } of docs) {
    const agentJson = toAgentComponentSchemaFile(name, json);
    const file = path.join(schemasDir, `${name}.schema.json`);
    fs.writeFileSync(file, `${JSON.stringify(agentJson, null, 2)}\n`, 'utf8');
    console.log(`  ${path.relative(root, file)}  ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
    schemaEntries.push(`  ${JSON.stringify(name)}: ${JSON.stringify(agentJson, null, 2).replace(/\n/g, '\n  ')},`);
  }

  const schemasTs = `/* eslint-disable */
/**
 * 本文件由 scripts/build.mjs 自动生成，请勿手改。
 * 源: src/schemas/*.schema.json
 */
export const a2uiPresetComponentSchemas: Record<string, unknown> = {
${schemaEntries.join('\n')}
};
`;
  fs.writeFileSync(path.join(srcDir, 'presetSchemas.generated.ts'), schemasTs, 'utf8');
  console.log(`[build] schema 完成（${docs.length} 个）→ src/schemas/ + presetSchemas.generated.ts`);
}

// ─── 4. 仅打包根入口所需产物 ────────────────────────────────────────────────

const BUNDLE_EXTERNALS = [
  'react',
  'react-dom',
  '@boteai/a2ui-custom-kit',
  'antd',
  'recharts',
  'zod',
];

/** 与 package.json exports 一致，dist/esm 只保留根入口所需产物 */
function writeExportArtifacts() {
  fs.writeFileSync(
    path.join(distDir, 'index.js'),
    [
      "export { a2uiPresetComponentRegistry } from './registry.js';",
      "export { a2uiPresetComponentSchemas } from './presetSchemas.js';",
      "export { PRESET_COMPONENTS as A2UI_PRESET_COMPONENT_TYPES } from './manifest.js';",
      '',
    ].join('\n'),
  );
  fs.writeFileSync(
    path.join(distDir, 'index.d.ts'),
    [
      "export { a2uiPresetComponentRegistry } from './registry';",
      "export { a2uiPresetComponentSchemas } from './presetSchemas';",
      "export { PRESET_COMPONENTS as A2UI_PRESET_COMPONENT_TYPES } from './manifest';",
      '',
    ].join('\n'),
  );
  fs.writeFileSync(
    path.join(distDir, 'registry.d.ts'),
    [
      "import type { A2UICustomElementDefinition } from '@boteai/a2ui-custom-kit';",
      'export declare const a2uiPresetComponentRegistry: Record<string, A2UICustomElementDefinition>;',
      '',
    ].join('\n'),
  );
  fs.writeFileSync(
    path.join(distDir, 'presetSchemas.d.ts'),
    'export declare const a2uiPresetComponentSchemas: Record<string, unknown>;\n',
  );
  fs.writeFileSync(
    path.join(distDir, 'manifest.d.ts'),
    'export declare const PRESET_COMPONENTS: readonly string[];\n',
  );
}

async function compileEsm() {
  if (!watch) fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  const esbuildOptions = {
    entryPoints: {
      registry: path.join(srcDir, 'registry.ts'),
      presetSchemas: path.join(srcDir, 'presetSchemas.ts'),
      manifest: path.join(srcDir, 'manifest.ts'),
    },
    outdir: distDir,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2018',
    jsx: 'automatic',
    external: BUNDLE_EXTERNALS,
    sourcemap: false,
    logLevel: 'info',
  };

  const indexPlugin = {
    name: 'export-artifacts',
    setup(build) {
      build.onEnd((result) => {
        if (result.errors.length === 0) writeExportArtifacts();
      });
    },
  };

  if (watch) {
    const ctx = await esbuild.context({ ...esbuildOptions, plugins: [indexPlugin] });
    await ctx.watch();
    console.log('[build] esbuild 监听中 → dist/esm/{index,registry,presetSchemas}.*');
  } else {
    await esbuild.build(esbuildOptions);
    writeExportArtifacts();
    console.log('[build] 打包完成 → dist/esm/');
  }
}

// ─── main ────────────────────────────────────────────────────────────────────

const names = parsePresetNames();
console.log(`[build] ${names.length} 个预设组件${watch ? '（watch）' : ''}`);

await embedStyles(names);
writeRegistry(names);
await generateSchemas(names);
await compileEsm();

if (watch) {
  console.log('[build] 开发模式已启动，按 Ctrl+C 退出');
}
