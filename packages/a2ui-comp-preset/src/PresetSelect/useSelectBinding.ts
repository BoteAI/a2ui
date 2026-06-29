import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  dispatchA2UIAction,
  dispatchDeclaredAction,
  resolveBoundValue,
  resolveBoundValueRaw,
  writeBoundValue,
  type A2UICustomElementHost,
} from '@boteai/a2ui-custom-kit';
import type { z } from 'zod';
import type { SelectProps } from 'antd';
import { PresetSelectApi } from './api';
import type { LabelLayout, SelectWidgetMode, SelectWidgetProps } from './SelectWidget';

type ApiProps = z.infer<typeof PresetSelectApi.schema>;

/** 解析 options 字段：尝试 JSON.parse，失败则返回空数组 */
function parseOptions(raw: unknown): SelectProps['options'] {
  if (Array.isArray(raw)) return raw as SelectProps['options'];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as SelectProps['options'];
    } catch {
      // 非法 JSON，忽略
    }
  }
  return [];
}

/** 读取协议中可绑定字段的字符串值 */
function readBoundString(host: A2UICustomElementHost, raw: unknown): string | undefined {
  if (typeof raw === 'string') return raw || undefined;
  const bound = resolveBoundValue(host, raw);
  return bound || undefined;
}

/** 读取字符串类型的字面值（不经过 DataModel 解析） */
function readLiteralString(raw: unknown, fallback: string): string {
  if (raw == null) return fallback;
  if (typeof raw === 'string' && raw.trim()) return raw;
  return fallback;
}

/** 将多选值从逗号分隔字符串拆成数组 */
function splitMultiValue(str: string | undefined): string[] {
  if (!str) return [];
  return str
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

/** 将多选数组拼成逗号分隔字符串 */
function joinMultiValue(arr: string[]): string {
  return arr.join(',');
}

/** 从引擎读取当前值 */
function readValueFromEngine(host: A2UICustomElementHost, apiProps: ApiProps, mode: SelectWidgetMode): string | string[] | undefined {
  const raw = readBoundString(host, apiProps.value);
  if (raw === undefined) return undefined;
  if (mode === 'multiple') return splitMultiValue(raw);
  return raw;
}

/** 将 A2UI host 与协议 props 转为 SelectWidget 受控组件 props */
export function useSelectBinding(host: A2UICustomElementHost, apiProps: ApiProps): SelectWidgetProps {
  const mode: SelectWidgetMode = apiProps.mode === 'multiple' ? 'multiple' : 'single';

  const fromEngine = useMemo(
    () => readValueFromEngine(host, apiProps, mode),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [host, apiProps.value, mode],
  );

  const options = useMemo(
    () => parseOptions(resolveBoundValueRaw(host, apiProps.options)),
    [host, apiProps.options],
  );

  const label = useMemo(() => {
    if (apiProps.label == null) return undefined;
    const resolved = resolveBoundValue(host, apiProps.label);
    return resolved || undefined;
  }, [host, apiProps.label]);

  const labelLayout: LabelLayout = apiProps.labelLayout === 'horizontal' ? 'horizontal' : 'vertical';

  const [value, setValue] = useState<string | string[] | undefined>(fromEngine);

  useEffect(() => {
    setValue(fromEngine);
  }, [fromEngine]);

  const onChange = useCallback(
    (nextValue: string | string[] | undefined) => {
      setValue(nextValue);

      // 写回 DataModel：多选拼逗号，单选直接写
      const serialized = Array.isArray(nextValue) ? joinMultiValue(nextValue) : nextValue ?? '';
      writeBoundValue(host, apiProps.value, serialized);

      // 派发声明式 action（协议里配置了 action 字段时生效）
      dispatchDeclaredAction(host);
    },
    [host, apiProps.value, mode],
  );

  return {
    value,
    onChange,
    options,
    mode,
    label,
    labelLayout,
    disabled: Boolean(apiProps.disabled),
    placeholder: readLiteralString(apiProps.placeholder, mode === 'multiple' ? '请选择' : '请选择'),
    showSearch: Boolean(apiProps.showSearch),
    allowClear: apiProps.allowClear !== false,
  };
}
