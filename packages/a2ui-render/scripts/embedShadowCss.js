/**
 * 构建时将 antd.min.css 内联为 TS 字符串，供 injectAntdStylesInShadow 注入 Shadow DOM。
 * 业务主题走 styleVars → a2ui-surface 宿主 CSS 变量。
 */
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const generatedDir = path.resolve(root, 'src/components/BaseRenderer/generated');
const outfile = path.resolve(generatedDir, 'antdShadowCss.generated.ts');

const ANT_STYLE_ID = 'A2UI_ANTD_SHADOW_CSS';

function resolveAntdMinCssPath() {
  const candidates = [
    path.join(root, 'node_modules/antd/dist/antd.min.css'),
    path.join(root, '../../node_modules/antd/dist/antd.min.css'),
    path.join(root, '../../../node_modules/antd/dist/antd.min.css'),
    path.join(root, '../../chatBot/node_modules/antd/dist/antd.min.css'),
  ];
  return candidates.find((fp) => fs.existsSync(fp));
}

function run() {
  fs.mkdirSync(generatedDir, { recursive: true });

  const lines = [
    '/* eslint-disable max-len */',
    '/** 由 scripts/embedShadowCss.js 生成，请勿手改 */',
    '',
  ];

  const antdCssPath = resolveAntdMinCssPath();
  if (antdCssPath) {
    const antdCss = fs.readFileSync(antdCssPath, 'utf8');
    lines.push(`export const ${ANT_STYLE_ID} = ${JSON.stringify(antdCss)};`);
    lines.push('');
    // eslint-disable-next-line no-console
    console.log('[embedShadowCss] inlined antd.min.css', `(${(antdCss.length / 1024).toFixed(1)} KB)`);
  } else {
    lines.push(`export const ${ANT_STYLE_ID} = '';`);
    lines.push('');
    // eslint-disable-next-line no-console
    console.warn('[embedShadowCss] antd.min.css not found; injectAntdStylesInShadow will be a no-op until antd is installed');
  }

  fs.writeFileSync(outfile, lines.join('\n'), 'utf8');
  // eslint-disable-next-line no-console
  console.log('[embedShadowCss] wrote', path.relative(root, outfile));
}

run();
