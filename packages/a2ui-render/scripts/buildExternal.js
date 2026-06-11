const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取当前 git commit hash
function getGitHead() {
  try {
    const result = execSync('git rev-parse HEAD', {
      stdio: 'pipe',
      encoding: 'utf8',
    });
    return result.toString().trim();
  } catch (error) {
    console.warn('⚠️  获取 Git HEAD 失败，将跳过 gitHead 更新:', error.message);
    return null;
  }
}

// 获取命令行参数
const args = process.argv.slice(2);
const version = args[0];

if (!version) {
  console.error('❌ 错误: 请提供版本号参数');
  console.log('使用方法: node buildExternal.js <version>');
  console.log('示例: node buildExternal.js 1.0.0');
  process.exit(1);
}

// 验证版本号格式
const versionRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
if (!versionRegex.test(version)) {
  console.error('❌ 错误: 版本号格式不正确');
  console.log('正确的版本号格式: x.y.z 或 x.y.z-prerelease');
  console.log('示例: 1.0.0, 1.0.0-alpha.1, 1.0.0-beta.2');
  process.exit(1);
}

const packageJsonPath = path.resolve(__dirname, '../package.json');
const botePackages = ['@boteai/icons', '@boteai/theme', '@boteai/types', '@boteai/utils'];

console.log('🚀 开始构建外部包...');
console.log(`📦 目标版本: ${version}`);

try {
  // 读取当前的 package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const oldVersion = packageJson.version;
  
  // 保存原始依赖版本
  const originalDeps = {};
  
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
    if (packageJson[depType]) {
      originalDeps[depType] = {};
      botePackages.forEach(pkg => {
        if (packageJson[depType][pkg]) {
          originalDeps[depType][pkg] = packageJson[depType][pkg];
        }
      });
    }
  });
  
  console.log(`📋 当前版本: ${oldVersion}`);
  console.log(`🔄 更新版本到: ${version}`);
  
  // 更新版本号
  packageJson.version = version;
  
  // 提取大版本号（去掉预发布标识）
  const majorVersion = version.split('-')[0];
  console.log(`🔧 大版本号: ${majorVersion}`);
  
  // 更新依赖包版本
  let updatedDeps = 0;
  
  // 更新 dependencies 中的版本
  if (packageJson.dependencies) {
    botePackages.forEach(pkg => {
      if (packageJson.dependencies[pkg]) {
        const oldDepVersion = packageJson.dependencies[pkg];
        packageJson.dependencies[pkg] = majorVersion;
        console.log(`📦 更新依赖 ${pkg}: ${oldDepVersion} → ${majorVersion}`);
        updatedDeps += 1;
      }
    });
  }
  
  // 更新 devDependencies 中的版本（如果有的话）
  if (packageJson.devDependencies) {
    botePackages.forEach(pkg => {
      if (packageJson.devDependencies[pkg]) {
        const oldDepVersion = packageJson.devDependencies[pkg];
        packageJson.devDependencies[pkg] = majorVersion;
        console.log(`📦 更新开发依赖 ${pkg}: ${oldDepVersion} → ${majorVersion}`);
        updatedDeps += 1;
      }
    });
  }
  
  // 更新 peerDependencies 中的版本（如果有的话）
  if (packageJson.peerDependencies) {
    botePackages.forEach(pkg => {
      if (packageJson.peerDependencies[pkg]) {
        const oldDepVersion = packageJson.peerDependencies[pkg];
        packageJson.peerDependencies[pkg] = majorVersion;
        console.log(`📦 更新对等依赖 ${pkg}: ${oldDepVersion} → ${majorVersion}`);
        updatedDeps += 1;
      }
    });
  }
  
  console.log(`✅ 共更新了 ${updatedDeps} 个依赖包版本`);
  
  // 更新 gitHead
  const gitHead = getGitHead();
  if (gitHead) {
    packageJson.gitHead = gitHead;
    console.log(`📝 更新 gitHead: ${gitHead}`);
  }
  
  // 写回 package.json
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
  console.log('✅ package.json 版本和依赖已更新');
  
  // 设置环境变量并执行构建
  console.log('🔧 设置 BUILD_EXTERNAL=true 环境变量');
  console.log('🏗️ 开始构建...');
  
  // 设置环境变量并执行构建命令
  const buildCommand = 'npm run build';
  const env = { ...process.env, BUILD_EXTERNAL: 'true' };
  
  execSync(buildCommand, {
    stdio: 'inherit',
    env,
    cwd: path.resolve(__dirname, '..'),
  });
  
  console.log('✅ 外部包构建完成!');
  console.log(`📦 版本 ${version} 已成功构建`);
} catch (error) {
  console.error('❌ 构建过程中发生错误:', error.message);
  
  // 如果构建失败，尝试恢复原始版本号和依赖
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const savedGitHead = packageJson.gitHead; // 保存当前的 gitHead
    packageJson.version = oldVersion;
    
    // 恢复原始依赖版本
    ['dependencies', 'devDependencies', 'peerDependencies'].forEach(depType => {
      if (originalDeps[depType] && packageJson[depType]) {
        Object.keys(originalDeps[depType]).forEach(pkg => {
          packageJson[depType][pkg] = originalDeps[depType][pkg];
        });
      }
    });
    
    // 保留 gitHead（如果存在）
    if (savedGitHead) {
      packageJson.gitHead = savedGitHead;
    }
    
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
    console.log('🔄 已恢复原始版本号和依赖');
  } catch (restoreError) {
    console.error('❌ 无法恢复原始版本号和依赖:', restoreError.message);
  }
  
  process.exit(1);
}
