/**
 * 构建前检查 app build:presets 是否已写入 dist/esm/presetComp。
 */
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const registryFile = path.resolve(root, 'dist/esm/presetComp/registry.js');

if (!fs.existsSync(registryFile)) {
  // eslint-disable-next-line no-console
  console.error(
    '[checkPresetArtifacts] 缺少预设组件产物:',
    path.relative(root, registryFile),
  );
  // eslint-disable-next-line no-console
  console.error(
    '[checkPresetArtifacts] 请先执行: yarn build:presets（a2ui 根目录）或 yarn --cwd app build:presets',
  );
  process.exit(1);
}
