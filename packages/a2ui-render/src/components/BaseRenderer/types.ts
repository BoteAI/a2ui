import React from 'react';

// A2UI组件类型
export interface A2UIComponent {
  id: string;
  component: Record<string, any>;
  weight?: number;
}

/** 与后端 SSE 等对齐的 A2UI 消息片段类型 */
export interface A2UIMessage {
  surfaceUpdate?: {
    surfaceId: string
    components: A2UIComponent[]
  }
  dataModelUpdate?: {
    surfaceId: string
    path: string
    contents: A2UIDataModelEntry[]
  }
  beginRendering?: {
    surfaceId: string
    root: string
    styles?: Record<string, unknown>
  }
  deleteSurface?: {
    surfaceId: string
  }
  textMessage?: {
    content: string
  }
}

export interface A2UIDataModelEntry {
  key: string
  valueString?: string
  valueNumber?: number
  valueBoolean?: boolean
  valueMap?: A2UIDataModelEntry[]
  valueList?: Omit<A2UIDataModelEntry, 'key'>[]
}

// 渲染上下文：包含渲染所需的所有信息（onDataModelChange 为内部使用，非对外 prop）
export interface RenderContext {
  dataModel: Record<string, any>;
  onAction?: (action: { name: string; context: any }) => void;
  onDataModelChange?: (path: string, value: any) => void;
  componentMap: Map<string, A2UIComponent>;
  renderComponent: (componentId: string) => React.ReactNode;
}

// 组件渲染器函数类型
export type ComponentRenderer = (
  props: any,
  context: RenderContext,
  style?: React.CSSProperties
) => React.ReactNode;

// 组件渲染器注册表类型
export type ComponentRendererRegistry = Map<string, ComponentRenderer>;


export type { A2UICustomElementDefinition, A2UICustomComponentRegistry } from '../../types';
