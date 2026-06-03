import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  readComponentProps,
  readStringProp,
  resolveBoundValue,
  subscribeV09ComponentUpdates,
  writeBoundValue,
  type A2UICustomElementHost,
} from '@boteteam/a2ui-custom-kit';

type FieldViewProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
};

function YourFieldView({ label, value, onChange }: FieldViewProps) {
  const [draft, setDraft] = useState(value);
  const [inputId] = useState(
    () => `a2ui-your-form-field-${Math.random().toString(36).slice(2, 11)}`,
  );
  useEffect(() => {
    setDraft(value);
  }, [value]);

  return (
    <label
      htmlFor={inputId}
      style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
    >
      <span style={{ fontSize: 13 }}>{label}</span>
      <input
        id={inputId}
        value={draft}
        onChange={(e) => {
          const next = e.target.value;
          setDraft(next);
          onChange(next);
        }}
      />
    </label>
  );
}

export class YourFormFieldElement extends HTMLElement {
  componentProps?: Record<string, unknown>;

  context?: A2UICustomElementHost['context'];

  private mountEl: HTMLDivElement | null = null;

  private unsubscribe?: () => void;

  connectedCallback() {
    if (!this.mountEl) {
      this.mountEl = document.createElement('div');
      this.appendChild(this.mountEl);
    }
    this.unsubscribe = subscribeV09ComponentUpdates(this, () => this.paint());
    this.paint();
    queueMicrotask(() => this.paint());
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    if (this.mountEl) {
      ReactDOM.unmountComponentAtNode(this.mountEl);
      this.mountEl.remove();
    }
    this.mountEl = null;
  }

  private paint() {
    if (!this.mountEl) return;
    const props = readComponentProps(this);
    const label = readStringProp(props, 'label', '字段');
    const value = resolveBoundValue(this, props.value);
    const rawValue = props.value;

    ReactDOM.render(
      <YourFieldView
        label={label}
        value={value}
        onChange={(next) => writeBoundValue(this, rawValue, next)}
      />,
      this.mountEl,
    );
  }
}
