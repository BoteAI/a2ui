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
    ignores: [
      'src/stories/**/*',
      'src/**/*.stories.ts',
      'src/common/**/*',
    ],
  },
  // 外部构建（BUILD_EXTERNAL）时使用预编译 antd 别名
  ...(isExternal
    ? {
        alias: {
          antd: '@gzued/antd-compiled/compiled/antd',
          'antd/es': getAntdEsPath(),
          '@ant-design/icons': '@gzued/antd-compiled/compiled/@ant-design/icons',
          dayjs: '@gzued/antd-compiled/compiled/dayjs',
          classnames: '@gzued/antd-compiled/compiled/classnames',
        },
      }
    : {}),
  platform: 'browser',
});
