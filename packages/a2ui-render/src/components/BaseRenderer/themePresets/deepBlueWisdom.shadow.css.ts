/**
 * 深蓝智慧 — 对齐 beijing-travel-deep-blue-wisdom.pen 与 theme_3 蓝紫渐变。
 * 语义色见 A2UI_THEME_PRESET_DEFINITIONS.deepBlueWisdom.styleVars。
 */
export const DEEP_BLUE_WISDOM_THEME_SHADOW_CSS = `
:host(a2ui-basic-text) h1 {
  font-size: var(--a2ui-font-size-2xl, 24px);
  font-weight: 700;
  line-height: 1.25;
  background: linear-gradient(
    120deg,
    var(--a2ui-color-primary, #32acff) 0%,
    #457aff 47%,
    #ac8cff 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

:host(a2ui-basic-text) p {
  color: #9092a3;
  font-size: 13px;
  line-height: 1.5;
}

:host(a2ui-basic-row) > a2ui-basic-text .a2ui-caption {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(50, 172, 255, 0.45);
  background: rgba(50, 172, 255, 0.1);
  color: #32acff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

:host(a2ui-basic-column) > a2ui-basic-row:last-child > a2ui-basic-text .a2ui-caption {
  display: block;
  padding: 0;
  margin-top: 10px;
  border: none;
  background: transparent;
  color: rgba(144, 146, 163, 0.9);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: normal;
  text-align: center;
}

:host(a2ui-basic-textfield) > label,
:host(a2ui-datetimeinput) > label,
:host(a2ui-choicepicker) > label {
  color: #9092a3;
  font-size: var(--a2ui-label-font-size, 11px);
  font-weight: 600;
}

:host(a2ui-basic-textfield) .a2ui-textfield,
:host(a2ui-datetimeinput) input,
:host(a2ui-datetimeinput) select {
  width: 100%;
  box-sizing: border-box;
  border-color: rgba(50, 172, 255, 0.22);
  min-height: 44px;
  background-color: #ffffff;
  color: #414352;
}

:host(a2ui-basic-textfield) .a2ui-textfield:focus,
:host(a2ui-datetimeinput) input:focus,
:host(a2ui-datetimeinput) select:focus {
  outline: none;
  border-color: var(--a2ui-color-primary, #32acff);
  box-shadow: 0 0 0 2px rgba(50, 172, 255, 0.22);
}

:host(a2ui-basic-row) > a2ui-basic-textfield,
:host(a2ui-basic-row) > a2ui-datetimeinput,
:host(a2ui-basic-row) > a2ui-choicepicker {
  flex: 1 1 0;
  min-width: 0;
  width: 100%;
  align-self: stretch;
}

:host(a2ui-basic-column) > a2ui-choicepicker,
:host(a2ui-basic-column) > a2ui-basic-row {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

:host(a2ui-choicepicker) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  align-self: stretch;
}

:host(a2ui-choicepicker) .options {
  width: 100%;
  box-sizing: border-box;
}

:host(a2ui-choicepicker) .options.chips,
:host(a2ui-choicepicker) .chips {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  flex-direction: unset !important;
  gap: var(--a2ui-choicepicker-gap, 8px);
}

:host(a2ui-choicepicker) .chip {
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  padding: var(--a2ui-choicepicker-chip-padding, 10px 12px);
  border-radius: var(--a2ui-choicepicker-chip-border-radius, 12px);
  border: 1px solid rgba(144, 146, 163, 0.25);
  background: #eef4fc;
  color: #9092a3;
  font-size: var(--a2ui-font-size-s, 12px);
  font-weight: 400;
}

:host(a2ui-choicepicker) .chip.selected {
  background: linear-gradient(
    120deg,
    rgba(50, 172, 255, 0.18) 0%,
    rgba(172, 140, 255, 0.22) 100%
  );
  border-color: var(--a2ui-color-primary, #32acff);
  color: #2a2b33;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(50, 172, 255, 0.12);
}

:host(a2ui-basic-column) a2ui-basic-row:nth-last-child(2) a2ui-choicepicker .chip {
  border-radius: 999px;
  background: #ffffff;
  border-color: rgba(50, 172, 255, 0.2);
}

:host(a2ui-basic-column) a2ui-basic-row:nth-last-child(2) a2ui-choicepicker .chip.selected {
  background: rgba(50, 172, 255, 0.12);
  border-color: var(--a2ui-color-primary, #32acff);
}

/* displayStyle=checkbox：选项在深蓝底上须用浅色字，避免与 #0a1628 背景对比不足 */
:host(a2ui-choicepicker) .options:not(.chips) label {
  display: flex;
  align-items: center;
  gap: var(--a2ui-checkbox-gap, 10px);
  color: var(--a2ui-color-on-background, #e8eef7);
  font-size: 13px;
  line-height: 1.4;
}

/* 白卡片内 checkbox/radio 选项恢复深色字 */
:host(a2ui-card) a2ui-choicepicker .options:not(.chips) label {
  color: var(--a2ui-color-on-input, #414352);
}

:host(a2ui-choicepicker) .options input[type='radio'],
:host(a2ui-choicepicker) .options input[type='checkbox'] {
  flex-shrink: 0;
  accent-color: var(--a2ui-color-primary, #32acff);
}

:host(a2ui-basic-button) {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 0;
  box-sizing: border-box;
}

:host(a2ui-basic-column) > a2ui-basic-button {
  display: block;
  width: 100%;
  align-self: stretch;
}

:host(a2ui-basic-button) .a2ui-button {
  display: flex;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

:host(a2ui-basic-button) .a2ui-button.a2ui-button-primary,
.a2ui-button.a2ui-button-primary {
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(
    120deg,
    #32acff 0%,
    rgba(69, 122, 255, 0.8) 47%,
    #d98eff 100%
  );
  border: none;
  color: var(--a2ui-color-on-primary, #ffffff);
  font-weight: 700;
  min-height: 50px;
  box-shadow: 0 4px 20px rgba(50, 172, 255, 0.35);
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

:host(a2ui-basic-button) .a2ui-button.a2ui-button-primary:hover,
.a2ui-button.a2ui-button-primary:hover {
  background: linear-gradient(120deg, #5bbcff 0%, rgba(96, 140, 255, 0.9) 47%, #e5a8ff 100%);
  box-shadow: 0 6px 28px rgba(172, 140, 255, 0.35);
  transform: translateY(-1px);
}

:host(a2ui-card) {
  border: 2px solid rgba(50, 172, 255, 0.28);
  background: #ffffff;
  margin: 0;
  max-width: 520px;
}

:host(a2ui-basic-column) {
  gap: var(--a2ui-row-gap, 16px);
}
`;
