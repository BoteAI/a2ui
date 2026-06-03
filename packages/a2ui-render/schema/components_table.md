# A2UI 组件参数说明

本文档列出了 `surfaceUpdate` 下定义的所有组件及其参数说明。

## 1. Text（文本）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| text | object | 是 | 要显示的文本内容。可以是字面字符串（literalString）或数据模型中的值引用（path，例如 '/doc/title'）。支持简单的 Markdown 格式（不包含 HTML、图像或链接），但通常更倾向于使用专门的 UI 组件以获得更丰富和结构化的展示。 |
| usageHint | string | 否 | 基础文本样式的提示。可选值：`h1`（最大标题）、`h2`（第二大标题）、`h3`（第三大标题）、`h4`（第四大标题）、`h5`（第五大标题）、`caption`（用于标题的小文本）、`body`（标准正文文本）。 |

## 2. Image（图像）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| url | object | 是 | 要显示的图像的 URL。可以是字面字符串（literalString）或数据模型中的值引用（path，例如 '/thumbnail/url'）。 |
| fit | string | 否 | 指定图像如何调整大小以适应其容器。对应 CSS 的 'object-fit' 属性。可选值：`contain`、`cover`、`fill`、`none`、`scale-down`。 |
| usageHint | string | 否 | 图像大小和样式的提示。可选值：`icon`（小方形图标）、`avatar`（圆形头像图像）、`smallFeature`（小特征图像）、`mediumFeature`（中等特征图像）、`largeFeature`（大特征图像）、`header`（全宽、全出血的标题图像）。 |

## 3. Icon（图标）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | object | 是 | 要显示的图标名称。可以是字面字符串（literalString）或数据模型中的值引用（path，例如 '/form/submit'）。字面字符串支持以下枚举值：accountCircle、add、arrowBack、arrowForward、attachFile、calendarToday、call、camera、check、close、delete、download、edit、event、error、favorite、favoriteOff、folder、help、home、info、locationOn、lock、lockOpen、mail、menu、moreVert、moreHoriz、notificationsOff、notifications、payment、person、phone、photo、print、refresh、search、send、settings、share、shoppingCart、star、starHalf、starOff、upload、visibility、visibilityOff、warning。 |

## 4. Video（视频）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| url | object | 是 | 要显示的视频的 URL。可以是字面字符串（literalString）或数据模型中的值引用（path，例如 '/video/url'）。 |

## 5. AudioPlayer（音频播放器）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| url | object | 是 | 要播放的音频的 URL。可以是字面字符串（literalString）或数据模型中的值引用（path，例如 '/song/url'）。 |
| description | object | 否 | 音频的描述，如标题或摘要。可以是字面字符串（literalString）或数据模型中的值引用（path，例如 '/song/title'）。 |

## 6. Row（行布局）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| children | object | 是 | 定义子元素。使用 'explicitList' 表示固定的子元素集合（组件 ID 数组），或使用 'template' 从数据列表生成子元素。template 包含 componentId（用作模板的组件 ID）和 dataBinding（数据模型中组件映射的路径）。 |
| distribution | string | 否 | 定义子元素沿主轴（水平方向）的排列方式。对应 CSS 的 'justify-content' 属性。可选值：`center`、`end`、`spaceAround`、`spaceBetween`、`spaceEvenly`、`start`。 |
| alignment | string | 否 | 定义子元素沿交叉轴（垂直方向）的对齐方式。对应 CSS 的 'align-items' 属性。可选值：`start`、`center`、`end`、`stretch`。 |

## 7. Column（列布局）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| children | object | 是 | 定义子元素。使用 'explicitList' 表示固定的子元素集合（组件 ID 数组），或使用 'template' 从数据列表生成子元素。template 包含 componentId（用作模板的组件 ID）和 dataBinding（数据模型中组件映射的路径）。 |
| distribution | string | 否 | 定义子元素沿主轴（垂直方向）的排列方式。对应 CSS 的 'justify-content' 属性。可选值：`start`、`center`、`end`、`spaceBetween`、`spaceAround`、`spaceEvenly`。 |
| alignment | string | 否 | 定义子元素沿交叉轴（水平方向）的对齐方式。对应 CSS 的 'align-items' 属性。可选值：`center`、`end`、`start`、`stretch`。 |

## 8. List（列表）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| children | object | 是 | 定义子元素。使用 'explicitList' 表示固定的子元素集合（组件 ID 数组），或使用 'template' 从数据列表生成子元素。template 包含 componentId（用作模板的组件 ID）和 dataBinding（数据模型中组件映射的路径）。 |
| direction | string | 否 | 列表项的布局方向。可选值：`vertical`（垂直）、`horizontal`（水平）。 |
| alignment | string | 否 | 定义子元素沿交叉轴的对齐方式。可选值：`start`、`center`、`end`、`stretch`。 |

## 9. Card（卡片）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| child | string | 是 | 要在卡片内渲染的组件的 ID。 |

## 10. Tabs（标签页）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| tabItems | array | 是 | 对象数组，每个对象定义一个标签页，包含 title（标签标题，可以是字面字符串或数据模型路径）和 child（子组件的 ID）。 |

## 11. Divider（分隔线）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| axis | string | 否 | 分隔线的方向。可选值：`horizontal`（水平）、`vertical`（垂直）。 |

## 12. Modal（模态框）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| entryPointChild | string | 是 | 打开模态框的组件 ID（例如，按钮）。当用户与此组件交互时会打开模态框。 |
| contentChild | string | 是 | 要在模态框内显示的组件的 ID。 |

## 13. Button（按钮）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| child | string | 是 | 要在按钮中显示的组件的 ID，通常是 Text 组件。 |
| primary | boolean | 否 | 指示此按钮是否应样式化为主要操作。 |
| action | object | 是 | 点击按钮时要分发的客户端操作。包含 name（操作名称）和可选的 context（上下文有效负载数组，每个元素包含 key 和 value，value 可以是字面值或数据模型路径）。 |

## 14. CheckBox（复选框）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| label | object | 是 | 要在复选框旁边显示的文本。可以是字面字符串（literalString）或数据模型中的值引用（path，例如 '/option/label'）。 |
| value | object | 是 | 复选框的当前状态（true 表示选中，false 表示未选中）。可以是字面布尔值（literalBoolean）或数据模型中的值引用（path，例如 '/filter/open'）。 |

## 15. TextField（文本输入框）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| label | object | 是 | 输入字段的文本标签。可以是字面字符串（literalString）或数据模型中的值引用（path，例如 '/user/name'）。 |
| text | object | 否 | 文本字段的值。可以是字面字符串（literalString）或数据模型中的值引用（path，例如 '/user/name'）。 |
| textFieldType | string | 否 | 要显示的输入字段类型。可选值：`date`（日期）、`longText`（长文本）、`number`（数字）、`shortText`（短文本）、`obscured`（隐藏文本，如密码）。 |
| validationRegexp | string | 否 | 用于输入客户端验证的正则表达式。 |

## 16. DateTimeInput（日期时间输入）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| value | object | 是 | 以 ISO 8601 格式选择的日期和/或时间值。可以是字面字符串（literalString）或数据模型中的值引用（path，例如 '/user/dob'）。 |
| enableDate | boolean | 否 | 如果为 true，允许用户选择日期。 |
| enableTime | boolean | 否 | 如果为 true，允许用户选择时间。 |

## 17. MultipleChoice（多选）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| selections | object | 是 | 组件的当前选定值。可以是字符串的字面数组（literalArray）或数据模型中的数组路径（path，例如 '/hotel/options'）。 |
| options | array | 是 | 用户可选择的可用选项数组。每个选项包含 label（显示的文本，可以是字面字符串或数据模型路径）和 value（选择时关联的值）。 |
| maxAllowedSelections | integer | 否 | 允许用户选择的最大选项数。 |

## 18. Slider（滑块）

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| value | object | 是 | 滑块的当前值。可以是字面数字（literalNumber）或数据模型中的值引用（path，例如 '/restaurant/cost'）。 |
| minValue | number | 否 | 滑块的最小值。 |
| maxValue | number | 否 | 滑块的最大值。 |

## 通用组件属性

除了上述组件特定属性外，所有组件都支持以下通用属性：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 组件的唯一标识符。 |
| weight | number | 否 | 组件在 Row 或 Column 中的相对权重。对应 CSS 的 'flex-grow' 属性。注意：只有当组件是 Row 或 Column 的直接子元素时才能设置此属性。 |

---

# dataModelUpdate 数据格式说明

`dataModelUpdate` 用于更新 UI 表面的数据模型。它允许你更新整个数据模型或数据模型中的特定路径。

## dataModelUpdate 顶层属性

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| surfaceId | string | 是 | 此数据模型更新所应用的 UI 表面的唯一标识符。 |
| path | string | 否 | 数据模型内位置的路径（例如，'/user/name'）。如果省略或设置为 '/'，将替换整个数据模型。 |
| contents | array | 是 | 数据条目数组。每个条目必须包含一个 'key' 和恰好一个对应的类型化 'value*' 属性。 |

## contents 数组中的数据条目

`contents` 数组中的每个条目都是一个对象，包含以下属性：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| key | string | 是 | 此数据条目的键。 |
| valueString | string | 否 | 字符串类型的值。每个条目必须提供恰好一个值类型属性（valueString、valueNumber、valueBoolean 或 valueMap 之一）。 |
| valueNumber | number | 否 | 数字类型的值。每个条目必须提供恰好一个值类型属性（valueString、valueNumber、valueBoolean 或 valueMap 之一）。 |
| valueBoolean | boolean | 否 | 布尔类型的值。每个条目必须提供恰好一个值类型属性（valueString、valueNumber、valueBoolean 或 valueMap 之一）。 |
| valueMap | array | 否 | 表示映射（对象）的邻接列表。每个条目必须提供恰好一个值类型属性（valueString、valueNumber、valueBoolean 或 valueMap 之一）。 |

## valueMap 结构

`valueMap` 用于表示嵌套的对象结构。它是一个数组，数组中的每个元素代表映射中的一个条目：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| key | string | 是 | 映射条目的键。 |
| valueString | string | 否 | 字符串类型的值。每个条目必须提供恰好一个值类型属性（valueString、valueNumber 或 valueBoolean 之一）。注意：valueMap 内部不支持嵌套的 valueMap。 |
| valueNumber | number | 否 | 数字类型的值。每个条目必须提供恰好一个值类型属性（valueString、valueNumber 或 valueBoolean 之一）。 |
| valueBoolean | boolean | 否 | 布尔类型的值。每个条目必须提供恰好一个值类型属性（valueString、valueNumber 或 valueBoolean 之一）。 |

## 使用示例

### 示例 1：更新简单值

```json
{
  "dataModelUpdate": {
    "surfaceId": "main",
    "path": "/user",
    "contents": [
      {
        "key": "name",
        "valueString": "张三"
      },
      {
        "key": "age",
        "valueNumber": 25
      },
      {
        "key": "isActive",
        "valueBoolean": true
      }
    ]
  }
}
```

### 示例 2：更新嵌套对象

```json
{
  "dataModelUpdate": {
    "surfaceId": "main",
    "path": "/user",
    "contents": [
      {
        "key": "profile",
        "valueMap": [
          {
            "key": "firstName",
            "valueString": "张"
          },
          {
            "key": "lastName",
            "valueString": "三"
          },
          {
            "key": "email",
            "valueString": "zhangsan@example.com"
          }
        ]
      }
    ]
  }
}
```

### 示例 3：替换整个数据模型

```json
{
  "dataModelUpdate": {
    "surfaceId": "main",
    "path": "/",
    "contents": [
      {
        "key": "title",
        "valueString": "欢迎页面"
      },
      {
        "key": "items",
        "valueMap": [
          {
            "key": "item1",
            "valueString": "第一项"
          },
          {
            "key": "item2",
            "valueString": "第二项"
          }
        ]
      }
    ]
  }
}
```

## 注意事项

1. **每个数据条目必须恰好有一个值类型属性**：每个 `contents` 数组中的条目必须提供且仅提供一个值类型属性（`valueString`、`valueNumber`、`valueBoolean` 或 `valueMap` 之一）。

2. **valueMap 的嵌套限制**：`valueMap` 内部的值条目只能使用 `valueString`、`valueNumber` 或 `valueBoolean`，不支持嵌套的 `valueMap`。

3. **path 的使用**：
   - 如果 `path` 省略或设置为 `'/'`，将替换整个数据模型
   - 如果 `path` 指定了特定路径（如 `'/user'`），则只更新该路径下的数据

4. **数据合并行为**：根据 `path` 的值，数据会被合并或替换。具体行为取决于实现。
