#!/usr/bin/env node

const {
  getGitHead,
  isValidVersion,
  resolvePkgDir,
  listShortPackageNames,
  preparePackage,
  restorePackage,
  publishPackage,
  readPkgJson,
} = require('./publish-utils');

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
  listShortPackageNames().forEach((n) => console.error(`  - ${n}`));
  process.exit(1);
}

const pkgDir = resolvePkgDir(pkgName);
if (!pkgDir) {
  console.error(`❌ Unknown package: ${pkgName}`);
  console.error('Available:', listShortPackageNames().join(', '));
  process.exit(1);
}

if (!isValidVersion(version)) {
  console.error(`❌ Invalid version: ${version}`);
  process.exit(1);
}

let gitHead;
try {
  gitHead = getGitHead();
} catch (_) {
  console.error('❌ Failed to get git HEAD. Make sure you are in a git repository.');
  process.exit(1);
}

const { pkgJson } = readPkgJson(pkgDir);
console.log(`\n📦 ${pkgJson.name}: ${pkgJson.version} → ${version}`);
console.log(`🔖 gitHead: ${gitHead}\n`);

const snapshot = preparePackage(pkgDir, version, gitHead);

try {
  publishPackage(pkgDir);
  console.log(`\n✅ Published ${pkgJson.name}@${version} successfully!\n`);
} catch (_) {
  console.error(`\n❌ Failed to publish ${pkgJson.name}@${version}`);
  console.error('Reverting package.json ...');
  restorePackage(pkgDir, snapshot);
  process.exit(1);
}
