import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    input: 'src',
    output: 'dist/esm',
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
