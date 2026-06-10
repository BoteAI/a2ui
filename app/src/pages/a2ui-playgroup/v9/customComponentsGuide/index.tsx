import React from 'react';
import { ArrowLeftOutlined, CodeOutlined, FolderOutlined } from '@ant-design/icons';
import { BaseRenderer, type A2UIMessage } from '@bote/a2ui-render';
import { navigateTo } from '../../shared/navigate';
import showcaseMessages from '../mock/showcase.json';
import { a2uiV9CustomComponents } from '../remoteRegistry';
import { V9_CUSTOM_COMPONENTS_GUIDE_PATH, V9_REMOTE_SHOWCASE_ID } from '../gallery';
import { CUSTOM_COMPONENTS_META, REGISTRY_SNIPPET } from './componentsMeta';
import styles from './index.less';

const PLAYGROUND_PATH = '/a2ui-playgroup/v9';

const CustomComponentsGuide: React.FC = () => {
  const goBack = () => {
    navigateTo(PLAYGROUND_PATH, { a2uiDemo: V9_REMOTE_SHOWCASE_ID });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={goBack}>
          <ArrowLeftOutlined /> 返回 Playground
        </button>
        <div className={styles.headerMain}>
          <h1 className={styles.title}>自定义组件开发指南</h1>
          <p className={styles.subtitle}>
            以下 4 个示例位于 <code>app/src/pages/a2ui-remote</code>，展示从 API 定义、元素实现到注册引用的完整链路。
          </p>
        </div>
      </header>

      <section className={styles.flowSection}>
        <h2 className={styles.sectionTitle}>开发流程</h2>
        <ol className={styles.flowList}>
          <li>
            <strong>定义 API</strong>
            — 在 <code>api.ts</code> 中用 <code>defineComponentApi</code> 声明组件名与 Zod schema
          </li>
          <li>
            <strong>实现 Element</strong>
            — 在 <code>element.ts(x)</code> 中用 kit 工厂函数注册 CustomElement
          </li>
          <li>
            <strong>导出注册</strong>
            — <code>defineRegistryEntry(Api, Element)</code> 合并进 Playground 或远程 bundle 的 registry
          </li>
          <li>
            <strong>协议引用</strong>
            — messages 里 <code>&quot;component&quot;: &quot;YourComponentName&quot;</code> 与 API 的 name 一致
          </li>
        </ol>
      </section>

      <section className={styles.componentsSection}>
        <h2 className={styles.sectionTitle}>四个示例组件</h2>
        <div className={styles.componentGrid}>
          {CUSTOM_COMPONENTS_META.map((item) => (
            <article key={item.name} className={styles.componentCard} id={item.name}>
              <div className={styles.componentCardHead}>
                <span className={styles.componentIndex}>{String(item.index).padStart(2, '0')}</span>
                <div>
                  <h3 className={styles.componentName}>{item.name}</h3>
                  <p className={styles.componentTitle}>{item.title}</p>
                </div>
                <span className={styles.kitBadge}>{item.kitApi}</span>
              </div>
              <p className={styles.componentSummary}>{item.summary}</p>
              <div className={styles.fileRow}>
                <FolderOutlined />
                <span>{item.apiFile}</span>
              </div>
              <div className={styles.fileRow}>
                <FolderOutlined />
                <span>{item.elementFile}</span>
              </div>
              <div className={styles.propsBlock}>
                <span className={styles.propsLabel}>Props</span>
                <ul>
                  {item.props.map((p) => (
                    <li key={p}><code>{p}</code></li>
                  ))}
                </ul>
              </div>
              <ol className={styles.stepList}>
                {item.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <pre className={styles.codeBlock}>
                <CodeOutlined className={styles.codeIcon} />
                {item.codeHint}
              </pre>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.registrySection}>
        <h2 className={styles.sectionTitle}>注册到 Playground</h2>
        <p className={styles.sectionDesc}>
          v9 Playground 在 <code>remoteRegistry.ts</code> 中合并四个 Demo 的 registry，传给
          <code> BaseRenderer</code> 的 <code>customComponents</code> 即可渲染。
        </p>
        <pre className={styles.codeBlock}>{REGISTRY_SNIPPET}</pre>
      </section>

      <footer className={styles.footer}>
        <button type="button" className={styles.primaryBtn} onClick={goBack}>
          在 Playground 中体验示例集
        </button>
        <span className={styles.footerHint}>指南页路径：{V9_CUSTOM_COMPONENTS_GUIDE_PATH}</span>
      </footer>
    </div>
  );
};

export default CustomComponentsGuide;
