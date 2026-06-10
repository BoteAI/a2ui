/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveKitReactRuntimeEntry, resolveKitRemoteRuntimeEntry } from './a2ui-resolve-kit.mjs';
import { esbuildLessPlugin } from './esbuild-less-plugin.mjs';
import { generateA2uiSchemas } from './generate-a2ui-schemas.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'a2ui-esm.config.mjs');

const userConfig = (await import(configPath)).default;
const { entries, outdir = 'public', minify = true, sourcemap = true } = userConfig;

if (!Array.isArray(entries) || entries.length === 0) {
  console.error('[build-a2ui-esm] a2ui-esm.config.mjs 中 entries 为空');
  process.exit(1);
}

const outAbs = path.join(root, outdir);
fs.mkdirSync(outAbs, { recursive: true });

console.log('[build-a2ui-esm] 生成 JSON Schema…');
await generateA2uiSchemas(root, userConfig);

const kitRemoteRuntime = resolveKitRemoteRuntimeEntry(root);
const kitReactRuntime = resolveKitReactRuntimeEntry(root);
console.log(`[build-a2ui-esm] remote-runtime → ${kitRemoteRuntime}`);
console.log(`[build-a2ui-esm] react-runtime → ${kitReactRuntime}`);

/** 避免 node_modules 内 file: 拷贝过期，优先解析到 package.json file: 指向的 dist */
const kitSubpathPlugin = {
  name: 'a2ui-kit-subpath',
  setup(build) {
    build.onResolve({ filter: /^@bote\/a2ui-custom-kit\/remote-runtime$/ }, () => ({
      path: kitRemoteRuntime,
    }));
    build.onResolve({ filter: /^@bote\/a2ui-custom-kit\/react-runtime$/ }, () => ({
      path: kitReactRuntime,
    }));
  },
};

const entryPoints = {};
for (const item of entries) {
  if (!item?.name || !item?.input) {
    console.error('[build-a2ui-esm] 每项需包含 name 与 input', item);
    process.exit(1);
  }
  entryPoints[item.name] = path.join(root, item.input);
}

const result = await esbuild.build({
  entryPoints,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  outdir: outAbs,
  outExtension: { '.js': '.mjs' },
  minify,
  sourcemap,
  logLevel: 'info',
  plugins: [kitSubpathPlugin, esbuildLessPlugin({ root })],
  loader: { '.tsx': 'tsx' },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});

if (result.errors?.length) {
  console.error(result.errors);
  process.exit(1);
}

console.log('\n[build-a2ui-esm] 产物：');
for (const item of entries) {
  const file = path.join(outAbs, `${item.name}.mjs`);
  if (fs.existsSync(file)) {
    const kb = (fs.statSync(file).size / 1024).toFixed(1);
    console.log(`  ${outdir}/${item.name}.mjs  ${kb} KB`);
  }
}
