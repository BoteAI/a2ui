import type { A2UIMessage } from '@boteai/a2ui-render';

export type CatalogCategoryId = 'layout' | 'content' | 'data' | 'interactive' | 'card';

export const CATALOG_CATEGORY_LABELS: Record<CatalogCategoryId, string> = {
  layout: 'Layout',
  content: 'Content',
  data: 'Data Display',
  interactive: 'Interactive',
  card: 'Card',
};

export type PresetCatalogItem = {
  name: string;
  displayName: string;
  category: CatalogCategoryId;
  description: string;
  usage: Record<string, unknown>;
  messages: A2UIMessage[];
};

const CATALOG_ID = 'https://a2ui.org/specification/v0_9/catalogs/basic/catalog.json';

function buildMessages(
  surfaceId: string,
  components: Record<string, unknown>[],
  dataModel: Record<string, unknown> = {},
): A2UIMessage[] {
  return [
    {
      version: 'v0.9',
      createSurface: {
        surfaceId,
        catalogId: CATALOG_ID,
        sendDataModel: true,
      },
    },
    {
      version: 'v0.9',
      updateComponents: {
        surfaceId,
        components,
      },
    },
    {
      version: 'v0.9',
      updateDataModel: {
        surfaceId,
        path: '/',
        value: dataModel,
      },
    },
  ] as A2UIMessage[];
}

export const PRESET_CATALOG_ITEMS: PresetCatalogItem[] = [
  {
    name: 'PresetRow',
    displayName: 'Row',
    category: 'layout',
    description:
      '水平 Flex 容器。支持静态子组件 ID 数组，或 v0.9 模板 `{ componentId, path }` 按数据模型数组逐项渲染子组件。',
    usage: {
      id: 'row-1',
      component: 'PresetRow',
      gap: 16,
      justify: 'spaceBetween',
      children: ['badge-1', 'badge-2', 'badge-3'],
    },
    messages: buildMessages('preset-row', [
      {
        id: 'root',
        component: 'PresetRow',
        gap: 16,
        justify: 'spaceBetween',
        children: ['badge-1', 'badge-2', 'badge-3'],
      },
      { id: 'badge-1', component: 'PresetBadge', text: 'On Time', variant: 'success' },
      { id: 'badge-2', component: 'PresetBadge', text: 'Delayed', variant: 'warning' },
      { id: 'badge-3', component: 'PresetBadge', text: 'Cancelled', variant: 'error' },
    ]),
  },
  {
    name: 'PresetColumn',
    displayName: 'Column',
    category: 'layout',
    description: '垂直 Flex 容器。用于堆叠子组件，可配置间距与交叉轴对齐方式。',
    usage: {
      id: 'col-1',
      component: 'PresetColumn',
      gap: 12,
      align: 'stretch',
      children: ['title-1', 'metric-1'],
    },
    messages: buildMessages('preset-column', [
      {
        id: 'root',
        component: 'PresetColumn',
        gap: 12,
        align: 'stretch',
        children: ['title-1', 'metric-1'],
      },
      { id: 'title-1', component: 'PresetTitle', text: '今日概览', level: 'h2' },
      {
        id: 'metric-1',
        component: 'PresetMetric',
        label: '活跃用户',
        value: '12,480',
        trend: 'up',
        trendValue: '+8.2%',
      },
    ]),
  },
  {
    name: 'PresetTitle',
    displayName: 'Title',
    category: 'content',
    description: '标题文本组件，支持 h1 / h2 / h3 级别，文本可使用字面量或 path 数据绑定。',
    usage: {
      id: 'title-1',
      component: 'PresetTitle',
      text: 'Dashboard Overview',
      level: 'h2',
    },
    messages: buildMessages('preset-title', [
      {
        id: 'root',
        component: 'PresetTitle',
        text: 'Dashboard Overview',
        level: 'h2',
      },
    ]),
  },
  {
    name: 'PresetMetric',
    displayName: 'Metric',
    category: 'content',
    description: '指标卡片：展示标签、主数值与趋势方向，适合 KPI 概览场景。',
    usage: {
      id: 'metric-1',
      component: 'PresetMetric',
      label: 'Revenue',
      value: '$128,400',
      trend: 'up',
      trendValue: '+12.4%',
    },
    messages: buildMessages('preset-metric', [
      {
        id: 'root',
        component: 'PresetMetric',
        label: 'Revenue',
        value: '$128,400',
        trend: 'up',
        trendValue: '+12.4%',
      },
    ]),
  },
  {
    name: 'PresetBadge',
    displayName: 'Badge',
    category: 'content',
    description: '状态标签，提供 success / warning / error / info / neutral 五种颜色变体。',
    usage: {
      id: 'badge-1',
      component: 'PresetBadge',
      text: 'On Time',
      variant: 'success',
    },
    messages: buildMessages('preset-badge', [
      {
        id: 'root',
        component: 'PresetBadge',
        text: 'On Time',
        variant: 'success',
      },
    ]),
  },
  {
    name: 'PresetPieChart',
    displayName: 'PieChart',
    category: 'data',
    description: '饼图 / 环形图，数据为 `{ label, value, color? }[]`，可配置内半径与图例。',
    usage: {
      id: 'pie-1',
      component: 'PresetPieChart',
      showLegend: true,
      data: [
        { label: 'Desktop', value: 45, color: '#417ffb' },
        { label: 'Mobile', value: 35, color: '#52c41a' },
        { label: 'Tablet', value: 20, color: '#faad14' },
      ],
    },
    messages: buildMessages('preset-pie', [
      {
        id: 'root',
        component: 'PresetPieChart',
        showLegend: true,
        innerRadius: 40,
        data: [
          { label: 'Desktop', value: 45, color: '#417ffb' },
          { label: 'Mobile', value: 35, color: '#52c41a' },
          { label: 'Tablet', value: 20, color: '#faad14' },
        ],
      },
    ]),
  },
  {
    name: 'PresetBarChart',
    displayName: 'BarChart',
    category: 'data',
    description: '柱状图，数据为 `{ label, value }[]`，支持柱体颜色与 Y 轴数值前后缀。',
    usage: {
      id: 'bar-1',
      component: 'PresetBarChart',
      color: '#417ffb',
      valuePrefix: '$',
      valueSuffix: 'K',
      data: [
        { label: 'Jan', value: 42 },
        { label: 'Feb', value: 58 },
        { label: 'Mar', value: 51 },
        { label: 'Apr', value: 67 },
      ],
    },
    messages: buildMessages('preset-bar', [
      {
        id: 'root',
        component: 'PresetBarChart',
        color: '#417ffb',
        valuePrefix: '$',
        valueSuffix: 'K',
        data: [
          { label: 'Jan', value: 42 },
          { label: 'Feb', value: 58 },
          { label: 'Mar', value: 51 },
          { label: 'Apr', value: 67 },
        ],
      },
    ]),
  },
  {
    name: 'PresetDataTable',
    displayName: 'DataTable',
    category: 'data',
    description: '数据表格，通过 columns 定义列，rows 支持字面量数组或 path 数据绑定。',
    usage: {
      id: 'table-1',
      component: 'PresetDataTable',
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'status', label: 'Status' },
      ],
      rows: [
        { name: 'Alice', role: 'Engineer', status: 'Active' },
        { name: 'Bob', role: 'Designer', status: 'Away' },
      ],
    },
    messages: buildMessages('preset-table', [
      {
        id: 'root',
        component: 'PresetDataTable',
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
        ],
        rows: [
          { name: 'Alice', role: 'Engineer', status: 'Active' },
          { name: 'Bob', role: 'Designer', status: 'Away' },
          { name: 'Carol', role: 'PM', status: 'Active' },
        ],
      },
    ]),
  },
  {
    name: 'PresetButton',
    displayName: 'Button',
    category: 'interactive',
    description: '交互按钮，通过 child 引用标签子组件，支持 primary / secondary / ghost 变体与 action 事件。',
    usage: {
      id: 'btn-1',
      component: 'PresetButton',
      variant: 'primary',
      child: 'btn-label',
      action: { name: 'submit', context: { formId: 'demo' } },
    },
    messages: buildMessages('preset-button', [
      {
        id: 'root',
        component: 'PresetButton',
        variant: 'primary',
        child: 'btn-label',
        action: { name: 'submit', context: { formId: 'demo' } },
      },
      { id: 'btn-label', component: 'PresetTitle', text: 'Submit Order', level: 'h3' },
    ]),
  },
  {
    name: 'PresetSelect',
    displayName: 'Select',
    category: 'interactive',
    description: '下拉选择器，支持单选 / 多选、搜索、清除与 path 数据绑定。',
    usage: {
      id: 'select-1',
      component: 'PresetSelect',
      placeholder: 'Select a city',
      value: 'sh',
      options:
        '[{"label":"Shanghai","value":"sh"},{"label":"Beijing","value":"bj"},{"label":"Shenzhen","value":"sz"}]',
      showSearch: true,
      allowClear: true,
    },
    messages: buildMessages('preset-select', [
      {
        id: 'root',
        component: 'PresetSelect',
        placeholder: 'Select a city',
        value: 'sh',
        options:
          '[{"label":"Shanghai","value":"sh"},{"label":"Beijing","value":"bj"},{"label":"Shenzhen","value":"sz"}]',
        showSearch: true,
        allowClear: true,
      },
    ]),
  },
  {
    name: 'PresetDashboardCard',
    displayName: 'DashboardCard',
    category: 'card',
    description: '仪表盘卡片容器，包含标题、副标题与可选内容子组件。',
    usage: {
      id: 'card-1',
      component: 'PresetDashboardCard',
      title: 'Sales Overview',
      subtitle: 'Last 30 days',
      child: 'card-metric',
    },
    messages: buildMessages('preset-dashboard-card', [
      {
        id: 'root',
        component: 'PresetDashboardCard',
        title: 'Sales Overview',
        subtitle: 'Last 30 days',
        child: 'card-metric',
      },
      {
        id: 'card-metric',
        component: 'PresetMetric',
        label: 'Total Sales',
        value: '$284,500',
        trend: 'up',
        trendValue: '+18.6%',
      },
    ]),
  },
  {
    name: 'PresetFlightCard',
    displayName: 'FlightCard',
    category: 'card',
    description: '航班信息卡片，展示航线、时间、状态与价格，支持预订 action。',
    usage: {
      id: 'flight-1',
      component: 'PresetFlightCard',
      airline: 'China Eastern',
      airlineLogo: 'https://picsum.photos/seed/airline/48/48',
      flightNumber: 'MU 5101',
      origin: 'SHA',
      destination: 'PEK',
      date: '2026-06-12',
      departureTime: '08:30',
      arrivalTime: '10:45',
      duration: '2h 15m',
      status: 'On Time',
      statusColor: '#52c41a',
      price: '¥1,280',
    },
    messages: buildMessages('preset-flight-card', [
      {
        id: 'root',
        component: 'PresetFlightCard',
        airline: 'China Eastern',
        airlineLogo: 'https://picsum.photos/seed/airline/48/48',
        flightNumber: 'MU 5101',
        origin: 'SHA',
        destination: 'PEK',
        date: '2026-06-12',
        departureTime: '08:30',
        arrivalTime: '10:45',
        duration: '2h 15m',
        status: 'On Time',
        statusColor: '#52c41a',
        price: '¥1,280',
      },
    ]),
  },
];

export const PRESET_CATALOG_BY_NAME = Object.fromEntries(
  PRESET_CATALOG_ITEMS.map((item) => [item.name, item]),
) as Record<string, PresetCatalogItem>;

export const PRESET_QUERY_KEY = 'component';
