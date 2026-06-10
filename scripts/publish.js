#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 短名 / 全名 -> 包目录映射
const PACKAGE_MAP = {
  'a2ui-render': 'packages/a2ui-render',
  'a2ui-custom-kit': 'packages/a2ui-custom-kit',
  '@bote/a2ui-render': 'packages/a2ui-render',
  '@bote/a2ui-custom-kit': 'packages/a2ui-custom-kit',
};

// ─── 参数解析 ───
const args = process.argv.slice(2);
const pkgName = args[0];
const version = args[1];

if (!pkgName || !version) {
  console.error('Usage: yarn pub <package-name> <version>');
  console.error('');
  console.error('Examples:');
  console.error('  yarn pub a2ui-render 0.1.1');
  console.error('  yarn pub a2ui-custom-kit 0.2.0');
  console.error('');
  console.error('Available packages:');
  Object.keys(PACKAGE_MAP)
    .filter((n) => !n.startsWith('@'))
    .forEach((n) => console.error(`  - ${n}`));
  process.exit(1);
}

const pkgDir = PACKAGE_MAP[pkgName];
if (!pkgDir) {
  console.error(`❌ Unknown package: ${pkgName}`);
  console.error(
    'Available:',
    Object.keys(PACKAGE_MAP)
      .filter((n) => !n.startsWith('@'))
      .join(', '),
  );
  process.exit(1);
}

// 版本格式校验
if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
  console.error(`❌ Invalid version: ${version}`);
  process.exit(1);
}

// ─── 获取当前 git HEAD ───
let gitHead;
try {
  gitHead = execSync('git rev-parse HEAD', { cwd: rootDir }).toString().trim();
} catch (_) {
  console.error('❌ Failed to get git HEAD. Make sure you are in a git repository.');
  process.exit(1);
}

// ─── 读取 & 更新 package.json ───
const pkgJsonPath = path.join(rootDir, pkgDir, 'package.json');
const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
const oldVersion = pkgJson.version;

console.log(`\n📦 ${pkgJson.name}: ${oldVersion} → ${version}`);
console.log(`🔖 gitHead: ${gitHead}\n`);

pkgJson.version = version;
pkgJson.gitHead = gitHead;

fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');

// ─── 执行发布 ───
try {
  execSync('npm publish --access public --registry https://registry.npmjs.org/', {
    cwd: path.join(rootDir, pkgDir),
    stdio: 'inherit',
  });
  console.log(`\n✅ Published ${pkgJson.name}@${version} successfully!\n`);
} catch (_) {
  console.error(`\n❌ Failed to publish ${pkgJson.name}@${version}`);
  console.error('Reverting package.json ...');
  pkgJson.version = oldVersion;
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + '\n');
  process.exit(1);
}
