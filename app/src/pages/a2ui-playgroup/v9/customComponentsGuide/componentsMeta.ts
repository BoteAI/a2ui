export type CustomComponentMeta = {
  index: number;
  name: string;
  title: string;
  summary: string;
  apiFile: string;
  elementFile: string;
  kitApi: string;
  props: string[];
  steps: string[];
  codeHint: string;
};

export const CUSTOM_COMPONENTS_META: CustomComponentMeta[] = [
  {
    index: 1,
    name: 'DemoNativeElement',
    title: '原生 DOM 组件',
    summary: '不依赖 React 运行时，在 render 回调里用 document.createElement 构建 UI，适合轻量标签、徽章等场景。',
    apiFile: 'app/src/pages/a2ui-remote/DemoNativeElement/api.ts',
    elementFile: 'app/src/pages/a2ui-remote/DemoNativeElement/element.ts',
    kitApi: 'createNativeElement',
    props: ['label: DynString', 'tone?: default | success | warning'],
    steps: [
      '用 defineComponentApi 声明组件名与 Zod schema',
      'createNativeElement 注册 CustomElement，在 render(host) 里读取 props 并构建 DOM',
      'readComponentProps / readStringProp 读取协议字段，connectedCallback 与 props 更新由 kit 自动处理',
    ],
    codeHint: `createNativeElement('DemoNativeElementHost', {
  render(host) {
    const props = readComponentProps(host);
    const label = readStringProp(props, 'label', 'Native Tag');
    // document.createElement …
  },
});`,
  },
  {
    index: 2,
    name: 'DemoReactComponent',
    title: 'React 桥接组件',
    summary: '用 JSX 编写视图，对外仍是 Web Component；kit 负责 mount、unmount 与 props 同步。',
    apiFile: 'app/src/pages/a2ui-remote/DemoReactComponent/api.ts',
    elementFile: 'app/src/pages/a2ui-remote/DemoReactComponent/element.tsx',
    kitApi: 'createReactComponent',
    props: ['title: DynString', 'subtitle?: DynString', 'align?: left | center'],
    steps: [
      'defineComponentApi 定义 props schema，需要 Agent 绑定的字段用 DynString',
      'createReactComponent(Api, ({ props, host }) => JSX) 注册组件',
      'render 回调不是 React 函数组件，回调内不可直接使用 Hooks',
    ],
    codeHint: `createReactComponent(DemoReactComponentApi, ({ props, host }) => (
  <div>
    <strong>{props.title}</strong>
  </div>
));`,
  },
  {
    index: 3,
    name: 'DemoStyledPanel',
    title: 'Shadow 内样式注入',
    summary: 'A2UI 组件运行在 Shadow DOM 内，普通全局 CSS 无法生效；需用 ensureComponentStyles 注入 Less 编译结果。',
    apiFile: 'app/src/pages/a2ui-remote/DemoStyledPanel/api.ts',
    elementFile: 'app/src/pages/a2ui-remote/DemoStyledPanel/element.ts',
    kitApi: 'ensureComponentStyles',
    props: ['title: DynString', 'description?: DynString', 'variant?: purple | blue'],
    steps: [
      '组件目录下编写 index.less，Umi 会在构建时编译为 CSS 字符串',
      '在 render 开头调用 ensureComponentStyles(host, styleKey, styles)',
      'styleKey 保证同一 ShadowRoot 内只注入一次，避免重复 style 标签',
    ],
    codeHint: `ensureComponentStyles(host, 'demo-styled-panel', styles);
// 之后使用 className 即可在 Shadow 内生效`,
  },
  {
    index: 4,
    name: 'DemoActionDispatch',
    title: 'Action 派发',
    summary: '演示协议声明 action 与代码内硬编码 action 两种交互方式，对应 Agent 驱动与固定业务逻辑两类场景。',
    apiFile: 'app/src/pages/a2ui-remote/DemoActionDispatch/api.ts',
    elementFile: 'app/src/pages/a2ui-remote/DemoActionDispatch/element.tsx',
    kitApi: 'dispatchDeclaredAction / dispatchA2UIAction',
    props: ['label: DynString', 'action?: ActionSchema'],
    steps: [
      '需要 Agent 配置点击行为时，在 api 中增加 action: ActionSchema.optional()',
      '按钮点击调用 dispatchDeclaredAction(host)，自动解析 props.action 与 context',
      '固定业务逻辑或调试场景用 dispatchA2UIAction(host, { name, context })',
    ],
    codeHint: `// Agent 声明的 action
dispatchDeclaredAction(host);

// 代码内写死的 action
dispatchA2UIAction(host, { name: 'demo_action', context: { … } });`,
  },
];

export const REGISTRY_SNIPPET = `import { defineRegistryEntry, mergeRegistryEntries } from '@bote/a2ui-custom-kit';
import { DemoNativeElementApi } from '../../a2ui-remote/DemoNativeElement/api';
import { DemoNativeElementElement } from '../../a2ui-remote/DemoNativeElement/element';
// … 其余三个组件

export const a2uiV9CustomComponents = mergeRegistryEntries(
  defineRegistryEntry(DemoNativeElementApi, DemoNativeElementElement),
  defineRegistryEntry(DemoReactComponentApi, DemoReactComponentElement),
  defineRegistryEntry(DemoStyledPanelApi, DemoStyledPanelElement),
  defineRegistryEntry(DemoActionDispatchApi, DemoActionDispatchElement),
);`;
