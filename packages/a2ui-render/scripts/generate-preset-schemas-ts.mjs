/**
 * 读取 src/presetComp/schemas/*.schema.json，生成 presetSchemas.generated.ts
 */
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const schemasDir = path.join(root, 'src/presetComp/schemas');
const manifestPath = path.join(root, 'src/presetComp/manifest.ts');
const outPath = path.join(root, 'src/presetComp/presetSchemas.generated.ts');

function parsePresetNames(source) {
  const match = source.match(/export const PRESET_COMPONENTS = \[([\s\S]*?)\] as const/);
  if (!match) {
    throw new Error('[generate-preset-schemas-ts] 无法解析 PRESET_COMPONENTS');
  }
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

if (!fs.existsSync(schemasDir)) {
  console.error(`[generate-preset-schemas-ts] 目录不存在: ${schemasDir}，请先运行 generate-a2ui-schemas`);
  process.exit(1);
}

const names = parsePresetNames(fs.readFileSync(manifestPath, 'utf8'));
const entries = [];

for (const name of names) {
  const schemaFile = path.join(schemasDir, `${name}.schema.json`);
  if (!fs.existsSync(schemaFile)) {
    console.error(`[generate-preset-schemas-ts] 缺少 schema: ${path.relative(root, schemaFile)}`);
    process.exit(1);
  }
  const json = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
  entries.push(`  ${JSON.stringify(name)}: ${JSON.stringify(json, null, 2).replace(/\n/g, '\n  ')},`);
}

const content = `/* eslint-disable */
/**
 * 本文件由 scripts/generate-preset-schemas-ts.mjs 自动生成，请勿手改。
 * 源: src/presetComp/schemas/*.schema.json
 */
export const a2uiPresetComponentSchemas: Record<string, unknown> = {
${entries.join('\n')}
};
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log(`[generate-preset-schemas-ts] ${path.relative(root, outPath)} (${names.length} schemas)`);
