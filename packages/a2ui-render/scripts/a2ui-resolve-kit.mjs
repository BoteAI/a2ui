/**
 * 解析 @bote/a2ui-custom-kit 的 subpath entry（remote-runtime / react-runtime）
 *
 * 适配 a2ui monorepo 结构，从 bote-remote-comp/scripts/a2ui-resolve-kit.mjs 复刻
 */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import path from 'path';

function readKitRootFromPackageJson(root) {
  const pkgPath = path.join(root, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const spec = pkg.dependencies?.['@bote/a2ui-custom-kit'];
  if (typeof spec === 'string' && spec.startsWith('file:')) {
    const kitRoot = path.resolve(root, spec.slice('file:'.length));
    if (fs.existsSync(kitRoot)) return kitRoot;
  }
  return null;
}

function resolveKitSubpathEntryImpl(root, subpath) {
  const entryRel = `dist/esm/${subpath}/index.js`;
  const candidates = [
    readKitRootFromPackageJson(root),
    path.join(root, 'node_modules/@bote/a2ui-custom-kit'),
    // a2ui monorepo 兜底：同级 packages/ 目录
    path.join(root, '../a2ui-custom-kit'),
  ]
    .filter(Boolean)
    .map(kitRoot => path.join(kitRoot, entryRel));

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  throw new Error(
    `未找到 @bote/a2ui-custom-kit/${subpath}。请先：cd a2ui/packages/a2ui-custom-kit && yarn build`,
  );
}

export function resolveKitRemoteRuntimeEntry(root) {
  return resolveKitSubpathEntryImpl(root, 'remote-runtime');
}

export function resolveKitReactRuntimeEntry(root) {
  return resolveKitSubpathEntryImpl(root, 'react-runtime');
}