import React, { useCallback, useRef } from 'react';
import { ConfigProvider, Select } from 'antd';
import type { SelectProps } from 'antd';

export const SELECT_PREFIX = 'preset-select';

export type SelectWidgetMode = 'single' | 'multiple';

export type SelectWidgetProps = {
  /** 单选时为 string | undefined；多选时为 string[] */
  value?: string | string[];
  /** 单选时回调 string | undefined；多选时回调 string[] */
  onChange?: (value: string | string[] | undefined) => void;
  /** 下拉选项 */
  options?: SelectProps['options'];
  /** 选择模式 */
  mode?: SelectWidgetMode;
  /** 占位文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否可搜索 */
  showSearch?: boolean;
  /** 是否可清除 */
  allowClear?: boolean;
  /** 额外 class */
  className?: string;
};

export function SelectWidget({
  value,
  onChange,
  options,
  mode = 'single',
  placeholder,
  disabled,
  showSearch,
  allowClear,
  className,
}: SelectWidgetProps) {
  const popupMountRef = useRef<HTMLDivElement>(null);

  const getPopupContainer = useCallback(() => {
    if (popupMountRef.current) {
      return popupMountRef.current;
    }
    return document.body;
  }, []);

  const isMultiple = mode === 'multiple';

  const handleChange: SelectProps['onChange'] = nextValue => {
    onChange?.(nextValue as string | string[] | undefined);
  };

  const rootClass = [SELECT_PREFIX, className].filter(Boolean).join(' ');

  return (
    <ConfigProvider getPopupContainer={getPopupContainer}>
      <div className={rootClass}>
        <Select
          className={`${SELECT_PREFIX}__select`}
          value={value as string | string[] | undefined}
          onChange={handleChange}
          options={options}
          mode={isMultiple ? 'multiple' : undefined}
          placeholder={placeholder ?? (isMultiple ? '请选择' : '请选择')}
          disabled={disabled}
          showSearch={showSearch}
          allowClear={allowClear}
          style={{ width: '100%' }}
        />
        <div ref={popupMountRef} className={`${SELECT_PREFIX}__popup-mount`} />
      </div>
    </ConfigProvider>
  );
}
