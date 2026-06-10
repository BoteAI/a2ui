/**
 * A2UI 远程 ESM 多入口配置（供 scripts/build-a2ui-esm.mjs 读取）
 *
 * 一组件一目录、一 bundle：name 对应 public/{name}.mjs
 *
 * 示例组件说明：
 * - DemoNativeElement    createNativeElement
 * - DemoReactComponent   createReactComponent
 * - DemoStyledPanel      ensureComponentStyles
 * - DemoActionDispatch   dispatchDeclaredAction vs dispatchA2UIAction
 */
export default {
  outdir: 'public',
  minify: true,
  sourcemap: true,

  /** 生成 JSON Schema：yarn generate:a2ui-schema */
  schema: {
    outdir: 'public/schemas',
    registry: 'scripts/a2ui-schema-registry.ts',
  },
  entries: [
    {
      name: 'DemoNativeElement',
      input: 'src/pages/a2ui-remote/DemoNativeElement/index.ts',
    },
    {
      name: 'DemoReactComponent',
      input: 'src/pages/a2ui-remote/DemoReactComponent/index.ts',
    },
    {
      name: 'DemoStyledPanel',
      input: 'src/pages/a2ui-remote/DemoStyledPanel/index.ts',
    },
    {
      name: 'DemoActionDispatch',
      input: 'src/pages/a2ui-remote/DemoActionDispatch/index.ts',
    },
  ],
};
