/* eslint-disable consistent-return */
import fs from 'fs';
import path from 'path';
import less from 'less';

/**
 * 将 .less 编译为 `export default "<css>"`，供 A2UI 远程 ESM 在 Shadow 内注入。
 */
export function esbuildLessPlugin(options = {}) {
  const { root } = options;

  return {
    name: 'a2ui-less',
    setup(build) {
      build.onResolve({ filter: /\.less$/ }, args => {
        if (args.namespace === 'a2ui-less') return;
        const resolved = path.isAbsolute(args.path)
          ? args.path
          : path.join(args.resolveDir, args.path);

        return {
          path: path.resolve(resolved),
          namespace: 'a2ui-less',
        };
      });

      build.onLoad({ filter: /.*/, namespace: 'a2ui-less' }, async args => {
        const source = await fs.promises.readFile(args.path, 'utf8');
        const result = await less.render(source, {
          filename: args.path,
          paths: [path.dirname(args.path), root].filter(Boolean),
        });
        return {
          contents: `export default ${JSON.stringify(result.css)};`,
          loader: 'js',
        };
      });
    },
  };
}
