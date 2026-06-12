const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const PACKAGE_MAP = {
  'a2ui-render': 'packages/a2ui-render',
  'a2ui-custom-kit': 'packages/a2ui-custom-kit',
  'a2ui-comp-preset': 'packages/a2ui-comp-preset',
  '@boteai/a2ui-render': 'packages/a2ui-render',
  '@boteai/a2ui-custom-kit': 'packages/a2ui-custom-kit',
  '@boteai/a2ui-comp-preset': 'packages/a2ui-comp-preset',
};

/** 按 npm 依赖顺序发布 */
const PUBLISH_ORDER = [
  'packages/a2ui-custom-kit',
  'packages/a2ui-render',
  'packages/a2ui-comp-preset',
];

/** 发布目标 registry，避免 yarn 脚本注入 registry.yarnpkg.com */
const NPM_REGISTRY = 'https://registry.npmjs.org/';

function getPublishEnv() {
  const npmrcPath = path.join(rootDir, '.npmrc');
  if (!fs.existsSync(npmrcPath)) {
    throw new Error('未找到根目录 .npmrc，请配置 registry 与 _authToken');
  }

  return {
    ...process.env,
    npm_config_registry: NPM_REGISTRY,
    npm_config_userconfig: npmrcPath,
  };
}

function getGitHead() {
  return execSync('git rev-parse HEAD', { cwd: rootDir }).toString().trim();
}

function readPkgJson(pkgDir) {
  const pkgJsonPath = path.join(rootDir, pkgDir, 'package.json');
  return {
    pkgJsonPath,
    pkgJson: JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8')),
  };
}

function writePkgJson(pkgJsonPath, pkgJson) {
  fs.writeFileSync(pkgJsonPath, `${JSON.stringify(pkgJson, null, 2)}\n`);
}

function isValidVersion(version) {
  return /^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version);
}

function resolvePkgDir(name) {
  return PACKAGE_MAP[name];
}

function listShortPackageNames() {
  return Object.keys(PACKAGE_MAP).filter((n) => !n.startsWith('@'));
}

function syncInternalDependencies(pkgJson, version) {
  const deps = pkgJson.dependencies;
  if (!deps) return;

  if (deps['@boteai/a2ui-custom-kit']) {
    deps['@boteai/a2ui-custom-kit'] = `^${version}`;
  }
  if (deps['@boteai/a2ui-render']) {
    deps['@boteai/a2ui-render'] = `^${version}`;
  }
  if (deps['@boteai/a2ui-comp-preset']) {
    deps['@boteai/a2ui-comp-preset'] = `^${version}`;
  }
}

function preparePackage(pkgDir, version, gitHead) {
  const { pkgJsonPath, pkgJson } = readPkgJson(pkgDir);
  const snapshot = JSON.parse(JSON.stringify(pkgJson));

  console.log(`📦 ${pkgJson.name}: ${pkgJson.version} → ${version}`);

  pkgJson.version = version;
  pkgJson.gitHead = gitHead;
  syncInternalDependencies(pkgJson, version);
  writePkgJson(pkgJsonPath, pkgJson);

  return snapshot;
}

function restorePackage(pkgDir, snapshot) {
  const { pkgJsonPath } = readPkgJson(pkgDir);
  writePkgJson(pkgJsonPath, snapshot);
}

function buildPackages() {
  console.log('\n🔨 Building @boteai/* packages ...\n');
  execSync('yarn build:comp', { cwd: rootDir, stdio: 'inherit' });
}

function publishPackage(pkgDir, options = {}) {
  const { dryRun = false, tag } = options;
  const { pkgJson } = readPkgJson(pkgDir);
  const distDir = path.join(rootDir, pkgDir, 'dist');

  if (!fs.existsSync(distDir)) {
    throw new Error(`${pkgJson.name} 缺少 dist 目录，请先执行构建`);
  }

  const args = [
    'npm publish',
    '--access public',
    `--registry ${NPM_REGISTRY}`,
  ];

  if (tag) {
    args.push(`--tag ${tag}`);
  }
  if (dryRun) {
    args.push('--dry-run');
  }

  execSync(args.join(' '), {
    cwd: path.join(rootDir, pkgDir),
    stdio: 'inherit',
    env: getPublishEnv(),
  });

  return pkgJson;
}

module.exports = {
  rootDir,
  PACKAGE_MAP,
  PUBLISH_ORDER,
  getGitHead,
  readPkgJson,
  writePkgJson,
  isValidVersion,
  resolvePkgDir,
  listShortPackageNames,
  preparePackage,
  restorePackage,
  buildPackages,
  publishPackage,
};
