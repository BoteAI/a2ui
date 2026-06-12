#!/usr/bin/env node

const {
  PUBLISH_ORDER,
  getGitHead,
  isValidVersion,
  preparePackage,
  restorePackage,
  buildPackages,
  publishPackage,
} = require('./publish-utils');

function printUsage() {
  console.error('Usage: yarn pub:all <version> [options]');
  console.error('');
  console.error('Examples:');
  console.error('  yarn pub:all 0.0.2');
  console.error('  yarn pub:all 0.1.0-beta.1 --tag beta');
  console.error('  yarn pub:all 0.0.2 --skip-build');
  console.error('  yarn pub:all 0.0.2 --dry-run');
  console.error('');
  console.error('Options:');
  console.error('  --skip-build   跳过构建，直接发布');
  console.error('  --dry-run      仅演练 npm publish，不实际上传');
  console.error('  --tag <name>   npm dist-tag，默认 latest');
  console.error('');
  console.error('发布顺序: a2ui-custom-kit → a2ui-render → a2ui-comp-preset');
}

function parseArgs(argv) {
  const positional = [];
  const options = {
    skipBuild: false,
    dryRun: false,
    tag: undefined,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--skip-build') {
      options.skipBuild = true;
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--tag') {
      options.tag = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg.startsWith('-')) {
      throw new Error(`未知参数: ${arg}`);
    }

    positional.push(arg);
  }

  return { positional, options };
}

function main() {
  let parsed;

  try {
    parsed = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`❌ ${error.message}`);
    printUsage();
    process.exit(1);
  }

  const { positional, options } = parsed;
  const version = positional[0];

  if (!version) {
    printUsage();
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

  const snapshots = {};
  const published = [];

  console.log(`\n🚀 一键发布 @boteai/* 包 @ ${version}`);
  console.log(`🔖 gitHead: ${gitHead}`);
  if (options.dryRun) {
    console.log('🧪 dry-run 模式，不会实际上传到 npm');
  }
  if (options.tag) {
    console.log(`🏷️  dist-tag: ${options.tag}`);
  }
  console.log('');

  try {
    if (!options.skipBuild) {
      buildPackages();
    }

    console.log('\n📝 更新 package.json 版本 ...\n');
    PUBLISH_ORDER.forEach((pkgDir) => {
      snapshots[pkgDir] = preparePackage(pkgDir, version, gitHead);
    });

    console.log('\n📤 开始发布 ...\n');
    PUBLISH_ORDER.forEach((pkgDir) => {
      const pkgJson = publishPackage(pkgDir, options);
      published.push(`${pkgJson.name}@${version}`);
      console.log(`\n✅ ${options.dryRun ? 'Dry-run OK' : 'Published'} ${pkgJson.name}@${version}\n`);
    });

    console.log('🎉 全部完成:');
    published.forEach((item) => console.log(`  - ${item}`));
    console.log('');

    if (options.dryRun) {
      console.log('↩️  dry-run 结束，已回滚 package.json 版本变更');
      Object.entries(snapshots).forEach(([pkgDir, snapshot]) => {
        restorePackage(pkgDir, snapshot);
      });
    }
  } catch (error) {
    console.error(`\n❌ 发布失败: ${error.message || error}`);
    console.error('↩️  正在回滚 package.json ...');

    Object.entries(snapshots).forEach(([pkgDir, snapshot]) => {
      restorePackage(pkgDir, snapshot);
    });

    process.exit(1);
  }
}

main();
