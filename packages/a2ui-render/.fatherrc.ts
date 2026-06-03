import { defineConfig } from 'father';
import path from 'path';

// 通过环境变量判断是否为外部构建
const isExternal = process.env.BUILD_EXTERNAL === 'true';

// 获取 @gzued/antd-compiled 的 antd/es 路径
const getAntdEsPath = () => {
  try {
    const antdCompiledPath = path.dirname(require.resolve('@gzued/antd-compiled/compiled/antd'));
    return path.join(antdCompiledPath, 'antd/es');
  } catch {
    return '@gzued/antd-compiled/compiled/antd/es';
  }
};

export default defineConfig({
  esm: {
    ignores: ['src/stories/**/*', 'src/**/*.stories.ts', 'src/common/**/*'],
  },
  // 动态添加 alias 配置
  ...(isExternal ? {
    alias: {
      antd: '@gzued/antd-compiled/compiled/antd',
      // 使用目录级别的别名，自动处理所有 antd/es/* 路径
      'antd/es': getAntdEsPath(),
      '@ant-design/icons': '@gzued/antd-compiled/compiled/@ant-design/icons',
      dayjs: '@gzued/antd-compiled/compiled/dayjs',
      classnames: '@gzued/antd-compiled/compiled/classnames',
    },
  } : {
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
  }),
  platform: 'browser',
});
