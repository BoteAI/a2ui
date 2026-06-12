import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    input: 'src/pages/a2ui-presetComp',
    output: '../packages/a2ui-render/dist/esm/presetComp',
    ignores: ['**/*.stories.ts', '**/debug.tsx'],
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
  platform: 'browser',
});
