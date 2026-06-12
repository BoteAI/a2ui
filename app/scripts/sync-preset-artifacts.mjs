/**
 * 从 src/pages/a2ui-presetComp/manifest.ts 同步生成 registry 与 schema-registry 源码。
 */
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const presetRoot = path.join(root, 'src/pages/a2ui-presetComp');
const manifestPath = path.join(presetRoot, 'manifest.ts');

function parsePresetNames(source) {
  const match = source.match(/export const PRESET_COMPONENTS = \[([\s\S]*?)\] as const/);
  if (!match) {
    throw new Error('[sync-preset-artifacts] 无法解析 PRESET_COMPONENTS');
  }
  const names = [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  if (names.length === 0) {
    throw new Error('[sync-preset-artifacts] PRESET_COMPONENTS 为空');
  }
  return names;
}

function writeRegistry(names) {
  const imports = names
    .map((name) => `import { a2uiRemoteRegistry as ${name} } from './${name}/index';`)
    .join('\n');
  const args = names.join(',\n  ');
  const content = `/**
 * 本文件由 scripts/sync-preset-artifacts.mjs 自动生成，请勿手改。
 * 源: src/pages/a2ui-presetComp/manifest.ts
 */
import { mergeRegistryEntries } from '@boteai/a2ui-custom-kit';
${imports}

export const a2uiPresetComponentRegistry = mergeRegistryEntries(
  ${args},
);
`;
  const outPath = path.join(presetRoot, 'registry.ts');
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`[sync-preset-artifacts] ${path.relative(root, outPath)}`);
}

function writeSchemaRegistry(names) {
  const imports = names
    .map((name) => `import { ${name}Api } from '../src/pages/a2ui-presetComp/${name}/api';`)
    .join('\n');
  const entries = names.map((name) => `  { name: '${name}', api: ${name}Api },`).join('\n');
  const content = `/**
 * 本文件由 scripts/sync-preset-artifacts.mjs 自动生成，请勿手改。
 * 源: src/pages/a2ui-presetComp/manifest.ts
 */
import { componentApiToJsonSchema2019 } from '@boteai/a2ui-custom-kit';
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
  const outPath = path.join(root, 'scripts/a2ui-preset-schema-registry.ts');
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`[sync-preset-artifacts] ${path.relative(root, outPath)}`);
}

const manifestSource = fs.readFileSync(manifestPath, 'utf8');
const names = parsePresetNames(manifestSource);
writeRegistry(names);
writeSchemaRegistry(names);
console.log(`[sync-preset-artifacts] 共 ${names.length} 个预设组件`);
