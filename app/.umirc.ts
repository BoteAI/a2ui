import path from 'path';
import { defineConfig } from 'umi';
import theme from '@boteteam/theme/bin/default/theme.json';
import routes from './src/config/routes';
import Config from 'webpack-chain';

export default defineConfig({
  umiInfo: false,
  define: {
    'process.env.REACT_APP_REQ_PREFIX': process.env.REACT_APP_REQ_PREFIX,
  },
  title: 'A2UI Playground',
  nodeModulesTransform: {
    type: 'none',
  },
  // zod 与 zod-to-json-schema 的 dist 含 `??`、`?.` 等语法，nodeModulesTransform 为 none 时需显式走 babel
  extraBabelIncludes: ['zod', 'zod-to-json-schema', '@a2ui/web_core'],
  history: {
    type: 'hash',
  },
  publicPath: './',
  fastRefresh: {},
  // 解决 SSE 请求阻塞
  devServer: {
    compress: false,
  },
  theme,
  routes,
  mock: {
    exclude: ['mock/**/_*.js', 'mock/_*/**/*.js', 'mock/**/*.json'],
  },
  lessLoader: {
    lessOptions: {
      javascriptEnabled: true,
    },
  },
  chainWebpack(config: Config) {
    // 供 `!!file-loader?...!antd/dist/antd.css` 内联导入解析到 Umi 自带的 file-loader
    config.resolveLoader.alias.set(
      'file-loader',
      require.resolve('@umijs/deps/compiled/file-loader')
    );

    // Webpack 4 不按 exports 解析子路径；直接指向主入口会命中 import attributes JSON，故用 scripts 下 shim
    config.resolve.alias.set(
      '@a2ui/web_core/v0_9',
      path.resolve(__dirname, '../scripts/a2ui-web-core-v09-webpack4-shim.js')
    );

    config.module
      .rule('lessMapCss')
      .test(/\.less$/)
      .exclude.add(/node_modules/)
      .end()
      .include.add(path.resolve(__dirname, 'src'))
      .end()
      .oneOf('normal')
      .use('less-loader')
      .loader('less-loader')
      .options({
        lessOptions: {
          javascriptEnabled: true,
        },
      })
      .end()
      .use('sass-resources-loader')
      .loader(require.resolve('sass-resources-loader'))
      .options({
        resources: [path.resolve(__dirname, 'src/assets/theme/themeMap.less')],
      })
      .end();

    config
      .plugin('antd-dayjs-webpack-plugin')
      .use(require.resolve('antd-dayjs-webpack-plugin'))
      .end();
  },
});
