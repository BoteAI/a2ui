const path = require('path');
const fs = require('fs');
const { build } = require('esbuild');

const root = path.resolve(__dirname, '..');
const entry08 = path.resolve(root, 'src/compat/litCompat08.entry.js');
const entry09 = path.resolve(root, 'src/compat/litCompat09.entry.js');
const outfile08 = path.resolve(root, 'src/compat/litCompat08.generated.js');
const outfile09 = path.resolve(root, 'src/compat/litCompat09.generated.js');

function applyMultipleChoicePatches(patched) {
  // Patch MC-1：重写 toggleSelection，按 maxAllowedSelections 正确处理单选与多选
  let nextPatched = patched.replace(
    `    toggleSelection(value) {
      const current = this.getCurrentSelections();
      if (current.includes(value)) {
        __privateMethod(this, __this_instances, setBoundValue_fn).call(this, current.filter((v3) => v3 !== value));
      } else {
        __privateMethod(this, __this_instances, setBoundValue_fn).call(this, [...current, value]);
      }
      this.requestUpdate();
    }`,
    `    toggleSelection(value) {
      const current = this.getCurrentSelections();
      const limit = Number(this.maxAllowedSelections);
      const hasLimit = Number.isFinite(limit) && limit > 0;
      const isSingleSelect = hasLimit && limit === 1;
      __a2uiDebugLog("toggleSelection before", {
        path: this.selections && this.selections.path,
        current,
        nextValue: value,
        maxAllowedSelections: this.maxAllowedSelections,
        isSingleSelect,
        hasLimit
      });
      if (current.includes(value)) {
        __privateMethod(this, __this_instances, setBoundValue_fn).call(this, current.filter((v3) => v3 !== value));
      } else if (isSingleSelect) {
        __privateMethod(this, __this_instances, setBoundValue_fn).call(this, [value]);
      } else if (hasLimit && current.length >= limit) {
        __privateMethod(this, __this_instances, setBoundValue_fn).call(this, [...current.slice(0, limit - 1), value]);
      } else {
        __privateMethod(this, __this_instances, setBoundValue_fn).call(this, [...current, value]);
      }
      __a2uiDebugLog("toggleSelection after", {
        path: this.selections && this.selections.path,
        currentAfter: this.getCurrentSelections()
      });
      this.requestUpdate();
    }`,
  );

  // Patch MC-2：为 getCurrentSelections 注入读取值日志，便于排查回显异常
  nextPatched = nextPatched.replace(
    'const selectionValue = this.processor.getData(this.component, this.selections.path, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);',
    'const selectionValue = this.processor.getData(this.component, this.selections.path, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID); __a2uiDebugLog("getCurrentSelections raw", { path: this.selections.path, selectionValue });',
  );

  // Patch MC-3：为 setData 注入写入值日志，便于排查交互状态同步
  nextPatched = nextPatched.replace(
    'this.processor.setData(this.component, this.selections.path, value, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);',
    '__a2uiDebugLog("setData", { path: this.selections.path, value }); this.processor.setData(this.component, this.selections.path, value, (_a7 = this.surfaceId) != null ? _a7 : A2uiMessageProcessor.DEFAULT_SURFACE_ID);',
  );

  return nextPatched;
}

/** v0.9：组件引用缺失或消息不完整时不抛错，跳过该节点渲染 */
function applyV09GracefulRenderPatches(patched) {
  let nextPatched = patched;

  // Patch GR-1：renderNode 捕获 ComponentContext 创建失败，返回 Lit nothing
  nextPatched = nextPatched.replace(
    `    renderNode(childRef, customPath) {
      if (!childRef)
        return A;
      let model = childRef;
      const { surface, path: parentPath } = this.context.dataContext;
      let path = customPath;
      if (typeof childRef === "object" && childRef !== null && childRef.id && !childRef.type) {
        model = childRef.id;
        path = path != null ? path : childRef.basePath;
      }
      path = path != null ? path : parentPath;
      return renderA2uiNode(new ComponentContext(surface, model, path), surface.catalog);
    }`,
    `    renderNode(childRef, customPath) {
      if (!childRef)
        return A;
      let model = childRef;
      const { surface, path: parentPath } = this.context.dataContext;
      let path = customPath;
      if (typeof childRef === "object" && childRef !== null && childRef.id && !childRef.type) {
        model = childRef.id;
        path = path != null ? path : childRef.basePath;
      }
      path = path != null ? path : parentPath;
      try {
        const ctx = new ComponentContext(surface, model, path);
        return renderA2uiNode(ctx, surface.catalog);
      } catch (err) {
        console.warn("[A2UI] Skip missing child component:", model, err);
        return A;
      }
    }`,
  );

  // Patch GR-2：surface 根节点缺失时静默跳过
  nextPatched = nextPatched.replace(
    `      } catch (e11) {
        console.error("Error creating root context:", e11);
        return b3\`<div>Error rendering surface</div>\`;
      }`,
    `      } catch (e11) {
        console.warn("[A2UI] Skip surface root render:", e11);
        return A;
      }`,
  );

  return nextPatched;
}

/* eslint-disable no-template-curly-in-string */
/** v0.9 等分支不再包含该锚点，需在 I18N-1 后做兜底 prepend，否则 ChoicePicker 等会引用未定义的 __a2uiI18nText */
const A2UI_I18N_HELPERS = `function __a2uiI18nText(key) {
  try {
    const fallbackMap = {
      "Please enter a value": "请输入内容",
      "No options found": "未找到可选项",
      "Select items": "请选择",
      "Filter options...": "筛选选项..."
    };
    const customMap = typeof window !== "undefined" && window.A2UI_I18N && typeof window.A2UI_I18N === "object"
      ? window.A2UI_I18N
      : null;
    if (customMap && typeof customMap[key] === "string" && customMap[key]) {
      return customMap[key];
    }
    return fallbackMap[key] || key;
  } catch (_e) {
    return key;
  }
}
function __a2uiI18nCountSelected(count) {
  return count > 0 ? \`已选择 \${count} 项\` : __a2uiI18nText("Select items");
}
`;

function applyI18nPatches(patched) {
  let nextPatched = patched;

  // Patch I18N-1：注入运行时文案函数，支持 window.A2UI_I18N 覆盖，默认中文
  nextPatched = nextPatched.replace(
    'var _A2uiMessageProcessor = class _A2uiMessageProcessor {',
    `${A2UI_I18N_HELPERS}var _A2uiMessageProcessor = class _A2uiMessageProcessor {`,
  );
  if (!nextPatched.includes('function __a2uiI18nText(key)')) {
    nextPatched = A2UI_I18N_HELPERS + nextPatched;
  }

  // Patch I18N-2：TextField 默认占位符国际化
  nextPatched = nextPatched.replace(
    '.placeholder=\${"Please enter a value"}',
    '.placeholder=\${__a2uiI18nText("Please enter a value")}',
  );

  // Patch I18N-3：MultipleChoice 空结果文案国际化（紧凑与列表两种视图）
  nextPatched = nextPatched.replace(
    '">No options found</div>` : A}',
    '">\${__a2uiI18nText("No options found")}</div>` : A}',
  );
  nextPatched = nextPatched.replace(
    '">No options found</div>` : A}',
    '">\${__a2uiI18nText("No options found")}</div>` : A}',
  );

  // Patch I18N-4：MultipleChoice 头部文案国际化（已选数量与默认标题）
  nextPatched = nextPatched.replace(
    'const headerText = count > 0 ? `\${count} Selected` : (_a7 = this.description) != null ? _a7 : "Select items";',
    'const headerText = count > 0 ? __a2uiI18nCountSelected(count) : (_a7 = this.description) != null ? _a7 : __a2uiI18nText("Select items");',
  );

  // Patch I18N-5：MultipleChoice 过滤输入框占位符国际化
  nextPatched = nextPatched.replace(
    'placeholder="Filter options..."',
    'placeholder=\${__a2uiI18nText("Filter options...")}',
  );

  return nextPatched;
}
/* eslint-enable no-template-curly-in-string */

async function run() {
  await build({
    entryPoints: [entry08],
    outfile: outfile08,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: ['es2018'],
    sourcemap: false,
    legalComments: 'none',
    minify: false,
  });

  // 修复上游样式工具在 clazz 为 null/undefined 时直接 Object.entries/Object.keys 导致的运行时异常
  let patched = fs.readFileSync(outfile08, 'utf8');
  patched = patched
    .replaceAll('Object.entries(clazz)', 'Object.entries(clazz || {})')
    .replaceAll('Object.keys(clazz)', 'Object.keys(clazz || {})')
    .replaceAll('Object.values(palettes)', 'Object.values(palettes || {})')
    .replaceAll('Object.entries(palette)', 'Object.entries(palette || {})')
    // dev/HMR 场景可能重复执行模块，避免 customElements.define 重复注册同名 tag 抛错
    .replaceAll('customElements.define(t7, e11);', 'customElements.get(t7) || customElements.define(t7, e11);')
    // 通用兜底：将 Object.entries/keys/values(plainIdentifier) 包成 identifier || {}
    // 只匹配简单变量名，避免影响复杂表达式语义
    .replace(/Object\.entries\(([A-Za-z_$][\w$]*)\)/g, 'Object.entries($1 || {})')
    .replace(/Object\.keys\(([A-Za-z_$][\w$]*)\)/g, 'Object.keys($1 || {})')
    .replace(/Object\.values\(([A-Za-z_$][\w$]*)\)/g, 'Object.values($1 || {})');

  // A2UI model-processor：嵌套对象里任意与组件 id 相同的字符串都会被当成子组件引用，导致 usageHint 与 Icon 的 icon 名等与 id 冲突。
  // 按属性名跳过「非子组件引用」字段（与官方语义一致：仅 child / explicitList 等才应是 id）。
  // Patch MP-1：在 A2uiMessageProcessor 前注入辅助函数
  // 包括子组件字符串解析白名单、数组样式 valueMap 归一化、调试日志开关
  patched = patched.replace(
    'var _A2uiMessageProcessor = class _A2uiMessageProcessor {',
    `function __a2uiShouldResolveChildString(propertyKey) {
  if (propertyKey === void 0 || propertyKey === null) return true;
  return propertyKey !== "usageHint" && propertyKey !== "icon";
}
function __a2uiNormalizeArrayLikeValue(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  if (value instanceof Map) {
    const keys = Array.from(value.keys()).map((k) => String(k));
    if (keys.length === 0 || !keys.every((k) => /^\\d+$/.test(k))) {
      return value;
    }
    const sorted = keys.map((k) => Number(k)).sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i += 1) {
      if (sorted[i] !== i) {
        return value;
      }
    }
    return sorted.map((idx) => value.get(String(idx)));
  }

  const keys = Object.keys(value);
  if (keys.length === 0 || !keys.every((k) => /^\\d+$/.test(k))) {
    return value;
  }
  const sorted = keys.map((k) => Number(k)).sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i += 1) {
    if (sorted[i] !== i) {
      return value;
    }
  }
  return sorted.map((idx) => value[String(idx)]);
}
function __a2uiDebugEnabled() {
  try {
    if (typeof window === "undefined") return false;
    const search = new URLSearchParams(window.location.search || "");
    const hashQuery = (window.location.hash || "").includes("?")
      ? new URLSearchParams((window.location.hash || "").split("?")[1] || "")
      : null;
    const queryDebug = search.get("a2uiDebug");
    const hashDebug = hashQuery && hashQuery.get("a2uiDebug");
    const storageDebug = window.localStorage
      ? window.localStorage.getItem("a2uiDebug")
      : null;
    return [queryDebug, hashDebug, storageDebug].some((v) => v === "1" || v === "true");
  } catch (_e) {
    return false;
  }
}
function __a2uiDebugLog(...args) {
  if (!__a2uiDebugEnabled()) return;
  try {
    console.log("[A2UI MC DEBUG]", ...args);
  } catch (_e) {
    // noop
  }
}
var _A2uiMessageProcessor = class _A2uiMessageProcessor {`,
  );
  // Patch MP-2：resolvePropertyValue 增加 propertyKey 参数，支持按字段名控制是否递归子组件
  patched = patched.replace(
    `  resolvePropertyValue(value, surface, visited, dataContextPath, idSuffix = "") {
    if (typeof value === "string" && surface.components.has(value)) {
      return this.buildNodeRecursive(value, surface, visited, dataContextPath, idSuffix);
    }`,
    `  resolvePropertyValue(value, surface, visited, dataContextPath, idSuffix = "", propertyKey) {
    if (typeof value === "string" && surface.components.has(value) && __a2uiShouldResolveChildString(propertyKey)) {
      return this.buildNodeRecursive(value, surface, visited, dataContextPath, idSuffix);
    }`,
  );
  // Patch MP-3：对象属性解析时传入 key，避免 usageHint 等字段误判为子组件引用
  patched = patched.replace(
    'resolvedProperties[key] = this.resolvePropertyValue(value, surface, visited, dataContextPath, idSuffix);',
    'resolvedProperties[key] = this.resolvePropertyValue(value, surface, visited, dataContextPath, idSuffix, key);',
  );
  // Patch MP-4：数组项解析时透传 propertyKey，保证深层结构行为一致
  patched = patched.replace(
    'return value.map((item) => this.resolvePropertyValue(item, surface, visited, dataContextPath, idSuffix));',
    'return value.map((item) => this.resolvePropertyValue(item, surface, visited, dataContextPath, idSuffix, propertyKey));',
  );
  // Patch MP-5：嵌套对象解析时透传 key，避免 icon 等字段误解析
  patched = patched.replace(
    'newObj[key] = this.resolvePropertyValue(propertyValue, surface, visited, dataContextPath, idSuffix);',
    'newObj[key] = this.resolvePropertyValue(propertyValue, surface, visited, dataContextPath, idSuffix, key);',
  );

  // MultipleChoice 等在 selections.path 缺失时仍会 getData(undefined)，resolvePath 对 undefined 调用 startsWith 导致渲染循环抛错
  // Patch MP-6：getData 增加 relativePath 空值保护，避免 resolvePath 对 undefined 调用 startsWith
  patched = patched.replace(
    `    if (!surface)
      return null;
    let finalPath;
    if (relativePath === "." || relativePath === "") {
      finalPath = (_a7 = node.dataContextPath) != null ? _a7 : "/";
    } else {
      finalPath = this.resolvePath(relativePath, node.dataContextPath);
    }
    return __a2uiNormalizeArrayLikeValue(this.getDataByPath(surface.dataModel, finalPath));
  }
  setData(node, relativePath, value, surfaceId = _A2uiMessageProcessor.DEFAULT_SURFACE_ID) {`,
    `    if (!surface)
      return null;
    if (relativePath == null) {
      return null;
    }
    let finalPath;
    if (relativePath === "." || relativePath === "") {
      finalPath = (_a7 = node.dataContextPath) != null ? _a7 : "/";
    } else {
      finalPath = this.resolvePath(relativePath, node.dataContextPath);
    }
    return this.getDataByPath(surface.dataModel, finalPath);
  }
  setData(node, relativePath, value, surfaceId = _A2uiMessageProcessor.DEFAULT_SURFACE_ID) {`,
  );
  // Patch MP-7：setData 增加 relativePath 空值保护，避免写入流程异常
  patched = patched.replace(
    `    if (!surface)
      return;
    let finalPath;
    if (relativePath === "." || relativePath === "") {
      finalPath = (_a7 = node.dataContextPath) != null ? _a7 : "/";
    } else {
      finalPath = this.resolvePath(relativePath, node.dataContextPath);
    }
    this.setDataByPath(surface.dataModel, finalPath, value);
  }
  resolvePath(path, dataContextPath) {`,
    `    if (!surface)
      return;
    if (relativePath == null) {
      return;
    }
    let finalPath;
    if (relativePath === "." || relativePath === "") {
      finalPath = (_a7 = node.dataContextPath) != null ? _a7 : "/";
    } else {
      finalPath = this.resolvePath(relativePath, node.dataContextPath);
    }
    this.setDataByPath(surface.dataModel, finalPath, value);
  }
  resolvePath(path, dataContextPath) {`,
  );
  // Patch MP-8：resolvePath 增加空值与类型兜底，避免渲染阶段抛错
  patched = patched.replace(
    `  resolvePath(path, dataContextPath) {
    if (path.startsWith("/")) {
      return path;
    }`,
    `  resolvePath(path, dataContextPath) {
    if (path == null || path === "" || typeof path !== "string") {
      return "/";
    }
    if (path.startsWith("/")) {
      return path;
    }`,
  );

  // 兼容历史 dataModel：valueMap 的数字键对象按数组读取，确保 MultipleChoice 可回显
  // Patch MP-9：getData 返回值增加数组样式 valueMap 归一化，确保 MultipleChoice 回显正常
  patched = patched.replace(
    'return this.getDataByPath(surface.dataModel, finalPath);',
    'return __a2uiNormalizeArrayLikeValue(this.getDataByPath(surface.dataModel, finalPath));',
  );

  patched = applyI18nPatches(patched);
  patched = applyMultipleChoicePatches(patched);

  fs.writeFileSync(outfile08, patched, 'utf8');

  await build({
    entryPoints: [entry09],
    outfile: outfile09,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: ['es2018'],
    sourcemap: false,
    legalComments: 'none',
    minify: false,
  });

  // 0.9 分支保留通用稳态补丁与国际化，不注入 0.8 历史语义 patch
  let patched09 = fs.readFileSync(outfile09, 'utf8');
  patched09 = patched09
    .replaceAll('Object.entries(clazz)', 'Object.entries(clazz || {})')
    .replaceAll('Object.keys(clazz)', 'Object.keys(clazz || {})')
    .replaceAll('Object.values(palettes)', 'Object.values(palettes || {})')
    .replaceAll('Object.entries(palette)', 'Object.entries(palette || {})')
    .replaceAll('customElements.define(t7, e11);', 'customElements.get(t7) || customElements.define(t7, e11);')
    .replace(/Object\.entries\(([A-Za-z_$][\w$]*)\)/g, 'Object.entries($1 || {})')
    .replace(/Object\.keys\(([A-Za-z_$][\w$]*)\)/g, 'Object.keys($1 || {})')
    .replace(/Object\.values\(([A-Za-z_$][\w$]*)\)/g, 'Object.values($1 || {})');
  patched09 = applyI18nPatches(patched09);
  patched09 = applyMultipleChoicePatches(patched09);
  patched09 = applyV09GracefulRenderPatches(patched09);
  fs.writeFileSync(outfile09, patched09, 'utf8');
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[build:lit-compat] failed', err);
  process.exit(1);
});
