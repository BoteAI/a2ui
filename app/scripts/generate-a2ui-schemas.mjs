/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { toAgentComponentSchemaFile } from './a2ui-schema-agent-format.mjs';
import { resolveKitRemoteRuntimeEntry } from './a2ui-resolve-kit.mjs';

/**
 * 根据 a2ui-esm.config.mjs 的 schema 段写出 *.schema.json
 * @returns 生成的文件数量；schema.enabled === false 时返回 0
 */
export async function generateA2uiSchemas(root, userConfig) {
  const schemaConfig = userConfig?.schema ?? {};
  if (schemaConfig.enabled === false) {
    return 0;
  }

  const outdir = schemaConfig.outdir ?? 'public/schemas';
  const registryInput = schemaConfig.registry ?? 'scripts/a2ui-schema-registry.ts';

  const outAbs = path.join(root, outdir);
  const cacheDir = path.join(root, 'node_modules/.cache');
  fs.mkdirSync(outAbs, { recursive: true });
  fs.mkdirSync(cacheDir, { recursive: true });

  const kitRemoteRuntime = resolveKitRemoteRuntimeEntry(root);
  const bundleOut = path.join(cacheDir, 'a2ui-schema-gen.mjs');

  await esbuild.build({
    entryPoints: [path.join(root, registryInput)],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: bundleOut,
    alias: {
      '@boteai/a2ui-custom-kit/remote-runtime': kitRemoteRuntime,
    },
    logLevel: 'silent',
  });

  const mod = await import(pathToFileURL(bundleOut).href);
  const docs = mod.buildSchemaDocuments();

  if (!Array.isArray(docs) || docs.length === 0) {
    throw new Error('[generate-a2ui-schema] schemaRegistry 为空，请检查 scripts/a2ui-schema-registry.ts');
  }

  for (const { name, json } of docs) {
    const agentJson = toAgentComponentSchemaFile(name, json);
    const file = path.join(outAbs, `${name}.schema.json`);
    fs.writeFileSync(file, `${JSON.stringify(agentJson, null, 2)}\n`, 'utf-8');
    const kb = (fs.statSync(file).size / 1024).toFixed(1);
    console.log(`  ${path.relative(root, file)}  ${kb} KB`);
  }

  console.log(`[generate-a2ui-schema] 共 ${docs.length} 个 schema，目录 ${outdir}/`);
  return docs.length;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(path.join(__dirname, 'generate-a2ui-schemas.mjs'));

if (isDirectRun) {
  const root = path.resolve(__dirname, '..');
  const configPath = path.join(root, 'a2ui-esm.config.mjs');
  const userConfig = (await import(configPath)).default;
  await generateA2uiSchemas(root, userConfig);
}
