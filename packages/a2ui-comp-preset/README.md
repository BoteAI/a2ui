# @boteai/a2ui-comp-preset

**仓库**：[github.com/BoteAI/a2ui](https://github.com/BoteAI/a2ui)

## 这个包是做什么的

**博特 A2UI 内置 Preset 组件集** — 开箱即用的布局、内容、数据展示、交互与卡片类组件，可直接传给 `@boteai/a2ui-render` 的 `BaseRenderer.customComponents`。

| 职责 | 包 |
|------|-----|
| **渲染** A2UI 协议界面 | `@boteai/a2ui-render` |
| **开发** 自定义远程组件 | `@boteai/a2ui-custom-kit` |
| **内置** 常用 Preset 组件 | `@boteai/a2ui-comp-preset`（本包） |

Preset 组件基于 `@boteai/a2ui-custom-kit` 实现（Zod schema + React Web Component），构建时自动生成注册表、JSON Schema 与内嵌 Less 样式。

---

## 与 @boteai/a2ui-render 的关系

```
Agent / 配置器
    │
    ├─ a2uiPresetComponentSchemas   ← 组件 props JSON Schema（提示词 / codegen）
    │
    └─ updateComponents 消息
            │
            ▼
@boteai/a2ui-render · BaseRenderer
    customComponents={a2uiPresetComponentRegistry}
            │
            ▼
    PresetRow / PresetMetric / PresetBarChart …
```

---

## 快速开始

```bash
yarn add @boteai/a2ui-comp-preset @boteai/a2ui-render
```

```tsx
import { BaseRenderer } from '@boteai/a2ui-render';
import { a2uiPresetComponentRegistry } from '@boteai/a2ui-comp-preset';

<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  customComponents={a2uiPresetComponentRegistry}
  onAction={handleAction}
/>
```

使用 antd 组件（如 `PresetSelect`）时，建议开启 `injectAntdStylesInShadow`，以便样式在 Shadow DOM 内生效。

---

## 子路径导出

| 导入路径 | 导出 | 适用场景 |
|----------|------|----------|
| `@boteai/a2ui-comp-preset` | 注册表 + Schema | 完整引入 |
| `@boteai/a2ui-comp-preset/registry` | `a2uiPresetComponentRegistry` | 仅运行时渲染 |
| `@boteai/a2ui-comp-preset/schemas` | `a2uiPresetComponentSchemas` | Agent 提示词、配置器、codegen |

---

## 组件一览

共 **12** 个 Preset 组件，清单以 `src/manifest.ts` 为唯一来源（SSOT）。

| 分类 | 组件 | 说明 |
|------|------|------|
| 布局 | [PresetRow](#presetrow) | 水平 Flex 容器 |
| 布局 | [PresetColumn](#presetcolumn) | 垂直 Flex 容器 |
| 内容 | [PresetTitle](#presettitle) | 标题文本 |
| 内容 | [PresetMetric](#presetmetric) | KPI 指标卡片 |
| 内容 | [PresetBadge](#presetbadge) | 状态标签 |
| 数据展示 | [PresetBarChart](#presetbarchart) | 柱状图 |
| 数据展示 | [PresetPieChart](#presetpiechart) | 饼图 / 环形图 |
| 数据展示 | [PresetDataTable](#presetdatatable) | 数据表格 |
| 交互 | [PresetButton](#presetbutton) | 操作按钮 |
| 交互 | [PresetSelect](#presetselect) | 下拉选择器 |
| 卡片 | [PresetDashboardCard](#presetdashboardcard) | 仪表盘卡片容器 |
| 卡片 | [PresetFlightCard](#presetflightcard) | 航班信息卡片（领域示例） |

各组件目录下的 `example.json` 提供最小协议片段，应用内 **Preset Catalog** 页面（`/a2ui-preset-catalog`）可在线预览与编辑。

---

## 组件说明

### 布局

#### PresetRow

水平 Flex 容器。支持静态子组件 ID 数组，或 v0.9 模板 `{ componentId, path }` 按数据模型数组逐项渲染子组件。

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `children` | `string[]` 或模板 | 是 | 子组件 ID 列表或数据驱动模板 |
| `gap` | `number` | 否 | 子元素间距（像素） |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'` | 否 | 交叉轴（垂直）对齐 |
| `justify` | `'start' \| 'center' \| 'end' \| 'spaceBetween' \| 'spaceAround' \| 'spaceEvenly' \| 'stretch'` | 否 | 主轴（水平）分布 |

```json
{
  "component": "PresetRow",
  "id": "row-1",
  "gap": 16,
  "justify": "spaceBetween",
  "children": ["badge-1", "badge-2", "badge-3"]
}
```

#### PresetColumn

垂直 Flex 容器。用于堆叠子组件，可配置间距与交叉轴对齐方式。

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `children` | `string[]` 或模板 | 是 | 子组件 ID 列表或数据驱动模板 |
| `gap` | `number` | 否 | 子元素间距（像素） |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch'` | 否 | 交叉轴（水平）对齐 |

```json
{
  "component": "PresetColumn",
  "id": "col-1",
  "gap": 12,
  "children": ["title-1", "metric-1"]
}
```

---

### 内容

#### PresetTitle

标题文本组件，支持 `h1` / `h2` / `h3` 级别。文本可使用字面量或 `{ "path": "/data/..." }` 数据绑定。

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `text` | `string` 或 path | 是 | 标题文本 |
| `level` | `'h1' \| 'h2' \| 'h3'` | 否 | 标题级别，默认 h2 |

```json
{
  "component": "PresetTitle",
  "id": "title-1",
  "text": { "path": "/data/title" },
  "level": "h1"
}
```

#### PresetMetric

指标卡片：展示标签、主数值与趋势方向，适合 KPI 概览场景。

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `label` | `string` 或 path | 是 | 上方小标签 |
| `value` | `string` 或 path | 否 | 主数值或文本 |
| `trend` | `'up' \| 'down' \| 'neutral'` | 否 | 趋势方向 |
| `trendValue` | `string` 或 path | 否 | 趋势幅度文本，如 `"+8.2%"` |

```json
{
  "component": "PresetMetric",
  "id": "metric-1",
  "label": { "path": "/data/metric/label" },
  "value": { "path": "/data/metric/value" },
  "trend": "up",
  "trendValue": "+8.2%"
}
```

#### PresetBadge

状态标签，提供五种颜色变体。

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `text` | `string` 或 path | 是 | 标签文本 |
| `variant` | `'success' \| 'warning' \| 'error' \| 'info' \| 'neutral'` | 否 | 颜色变体 |

```json
{
  "component": "PresetBadge",
  "id": "badge-1",
  "text": { "path": "/data/status" },
  "variant": "success"
}
```

---

### 数据展示

#### PresetBarChart

柱状图，基于 [recharts](https://recharts.org/)。数据为 `{ label, value }[]`，支持柱体颜色与 Y 轴数值前后缀。

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `data` | 数组或 path | 是 | `Array<{ label: string, value: number }>` |
| `color` | `string` | 否 | 柱体填充色 |
| `valuePrefix` | `string` | 否 | Y 轴数值前缀，如 `"$"` |
| `valueSuffix` | `string` | 否 | Y 轴数值后缀，如 `"K"` |

```json
{
  "component": "PresetBarChart",
  "id": "bar-1",
  "data": { "path": "/data/bar" },
  "color": "#3b82f6",
  "valuePrefix": "$",
  "valueSuffix": "k"
}
```

#### PresetPieChart

饼图或环形图。数据为 `{ label, value, color? }[]`，可通过 `innerRadius` 切换实心饼图与环形图。

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `data` | 数组或 path | 是 | `Array<{ label, value, color? }>` |
| `innerRadius` | `number` | 否 | 内半径（像素），`0` 为实心饼图 |
| `showLegend` | `boolean` | 否 | 是否显示图例 |

```json
{
  "component": "PresetPieChart",
  "id": "pie-1",
  "data": { "path": "/data/pie" },
  "innerRadius": 40,
  "showLegend": true
}
```

#### PresetDataTable

数据表格。通过 `columns` 定义列结构，`rows` 支持字面量数组或 path 数据绑定。

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `columns` | `{ key, label }[]` | 是 | 列定义 |
| `rows` | 对象数组或 path | 是 | `Array<Record<string, any>>` |

```json
{
  "component": "PresetDataTable",
  "id": "table-1",
  "columns": [
    { "key": "name", "label": "Name" },
    { "key": "role", "label": "Role" }
  ],
  "rows": { "path": "/data/table/rows" }
}
```

---

### 交互

#### PresetButton

交互按钮。通过 `child` 引用标签子组件（通常为 `PresetTitle`），支持多种视觉变体与 v0.9 `action` 事件。

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `child` | `string` | 是 | 按钮标签子组件 ID |
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | 否 | 视觉变体 |
| `action` | Action | 否 | 点击时触发的 v0.9 action |

```json
{
  "component": "PresetButton",
  "id": "btn-1",
  "variant": "primary",
  "child": "btn-label",
  "action": {
    "event": { "name": "on_confirm" }
  }
}
```

#### PresetSelect

下拉选择器，基于 antd `Select`。支持单选 / 多选、搜索、清除与 path 数据绑定。

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `value` | `string` 或 path | 否 | 选中值；多选时为逗号分隔字符串 |
| `options` | `string` 或 path | 否 | JSON 数组字符串，如 `'[{"label":"A","value":"a"}]'` |
| `mode` | `'single' \| 'multiple'` | 否 | 单选或多选 |
| `placeholder` | `string` 或 path | 否 | 占位文本 |
| `disabled` | `boolean` | 否 | 是否禁用 |
| `showSearch` | `boolean` | 否 | 是否可搜索 |
| `allowClear` | `boolean` | 否 | 是否可清除 |
| `action` | Action | 否 | 变更时触发的 action |

```json
{
  "component": "PresetSelect",
  "id": "status-select",
  "value": { "path": "/data/status" },
  "options": "[{\"label\":\"启用\",\"value\":\"active\"},{\"label\":\"禁用\",\"value\":\"inactive\"}]",
  "mode": "single",
  "placeholder": "请选择状态",
  "allowClear": true,
  "action": {
    "event": { "name": "on_status_change" }
  }
}
```

---

### 卡片

#### PresetDashboardCard

仪表盘卡片容器，包含标题、副标题与可选内容子组件。

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | `string` 或 path | 是 | 卡片标题 |
| `subtitle` | `string` 或 path | 否 | 卡片副标题 |
| `child` | `string` | 否 | 卡片内容子组件 ID |

```json
{
  "component": "PresetDashboardCard",
  "id": "card-1",
  "title": { "path": "/data/card/title" },
  "subtitle": "Q2 2026",
  "child": "metric-1"
}
```

#### PresetFlightCard

航班信息卡片（领域示例），展示航线、时间、状态与价格，支持预订 action。

| Prop | 类型 | 必填 | 说明 |
|------|------|------|------|
| `airline` | `string` 或 path | 是 | 航空公司名称 |
| `airlineLogo` | `string` 或 path | 是 | 航空公司 Logo URL |
| `flightNumber` | `string` 或 path | 是 | 航班号 |
| `origin` | `string` 或 path | 是 | 出发地 |
| `destination` | `string` 或 path | 是 | 目的地 |
| `date` | `string` 或 path | 是 | 日期 |
| `departureTime` | `string` 或 path | 是 | 出发时间 |
| `arrivalTime` | `string` 或 path | 是 | 到达时间 |
| `duration` | `string` 或 path | 是 | 飞行时长 |
| `status` | `string` 或 path | 是 | 状态文本 |
| `statusColor` | `string` 或 path | 否 | 状态颜色 |
| `price` | `string` 或 path | 是 | 价格 |
| `action` | Action | 否 | 预订 action |

```json
{
  "component": "PresetFlightCard",
  "id": "flight-1",
  "airline": "Delta Airlines",
  "flightNumber": "DL 2402",
  "origin": "SFO",
  "destination": "JFK",
  "date": "Mon, Jun 28",
  "departureTime": "8:30 AM",
  "arrivalTime": "2:45 PM",
  "duration": "6h 15m",
  "status": "On Time",
  "statusColor": "#059669",
  "price": "$384",
  "action": {
    "event": { "name": "on_book_flight" }
  }
}
```

---

## 新增 Preset 组件

1. 在 `src/` 下按现有组件目录结构新增（`api.ts`、`element.tsx`、`index.ts`、`index.less` 等，可参考 `@boteai/a2ui-custom-kit/templates`）。
2. 在 `src/manifest.ts` 的 `PRESET_COMPONENTS` 中登记组件名。
3. 执行 `yarn build`（或仓库根目录构建各包）。

构建脚本 `scripts/build.mjs` 会自动完成：

- Less → `styles.generated.ts` 样式嵌入
- 生成 `registry.ts` 合并注册表
- 生成 `presetSchemas.generated.ts` JSON Schema
- esbuild ESM 打包 + tsc 类型声明

---

## 相关文档

- **渲染器用法**：[`packages/a2ui-render/README.md`](../a2ui-render/README.md)
- **自定义组件开发**：[`packages/a2ui-custom-kit/README.md`](../a2ui-custom-kit/README.md)
- **在线组件目录**：应用内 `/a2ui-preset-catalog` 页面
