/**
 * 构建前将 src/presetComp 下各组件的 index.less 编译为 CSS 字符串，
 * 生成同名目录的 styles.generated.ts（export default "CSS"），
 * 供 Father bundless 和 esbuild 正常处理，无需 Less 插件。
 *
 * 用法：node scripts/embedPresetStyles.js
 * 每次修改 .less 后需重新运行。
 */
const path = require('path');
const fs = require('fs');
const less = require('less');

const root = path.resolve(__dirname, '..');
const presetDir = path.resolve(root, 'src/presetComp');
const themeDir = path.resolve(root, 'src/assets/theme/less');

function findLessFiles() {
  const results = [];
  const dirs = fs.readdirSync(presetDir, { withFileTypes: true });
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const lessPath = path.join(presetDir, d.name, 'index.less');
    if (fs.existsSync(lessPath)) {
      results.push({ componentName: d.name, lessPath });
    }
  }
  return results;
}

async function compileLess(lessPath) {
  const source = fs.readFileSync(lessPath, 'utf8');
  const result = await less.render(source, {
    filename: lessPath,
    paths: [path.dirname(lessPath), themeDir, presetDir],
  });
  return result.css;
}

async function run() {
  const files = findLessFiles();
  if (files.length === 0) {
    console.warn('[embedPresetStyles] No index.less files found in src/presetComp/');
    return;
  }

  console.log(`[embedPresetStyles] Found ${files.length} .less files to compile`);

  for (const { componentName, lessPath } of files) {
    try {
      const css = await compileLess(lessPath);
      const generatedPath = path.join(presetDir, componentName, 'styles.generated.ts');
      const content = [
        '/* eslint-disable max-len */',
        `/** 由 scripts/embedPresetStyles.js 从 ${componentName}/index.less 生成，请勿手改 */`,
        `export default ${JSON.stringify(css)};`,
        '',
      ].join('\n');
      fs.writeFileSync(generatedPath, content, 'utf8');
      const kb = (css.length / 1024).toFixed(1);
      console.log(`  ${componentName}/styles.generated.ts  ${kb} KB`);
    } catch (err) {
      console.error(`[embedPresetStyles] Failed to compile ${lessPath}:`, err.message);
      // Generate a fallback empty export so the build doesn't break
      const generatedPath = path.join(presetDir, componentName, 'styles.generated.ts');
      fs.writeFileSync(generatedPath, `export default '';`, 'utf8');
    }
  }

  console.log('[embedPresetStyles] Done');
}

run().catch((err) => {
  console.error('[embedPresetStyles] Fatal error:', err);
  process.exit(1);
});