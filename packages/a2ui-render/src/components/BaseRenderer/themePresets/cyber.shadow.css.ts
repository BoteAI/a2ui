/**
 * 炫彩科技 — 对齐 beijing-travel-cyber.pen 设计稿。
 * 语义色见 A2UI_THEME_PRESET_DEFINITIONS.cyber.styleVars。
 */
export const CYBER_THEME_SHADOW_CSS = `
:host(a2ui-basic-text) h1 {
  font-size: var(--a2ui-font-size-2xl, 24px);
  font-weight: 700;
  line-height: 1.25;
  background: linear-gradient(
    90deg,
    var(--a2ui-color-primary, #00e5ff) 0%,
    #7c3aed 55%,
    #ec4899 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

:host(a2ui-basic-text) p {
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
}

:host(a2ui-basic-row) > a2ui-basic-text .a2ui-caption {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0, 229, 255, 0.45);
  background: rgba(0, 229, 255, 0.12);
  color: #00e5ff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

:host(a2ui-basic-column) > a2ui-basic-row:last-child > a2ui-basic-text .a2ui-caption {
  display: block;
  padding: 0;
  margin-top: 10px;
  border: none;
  background: transparent;
  color: rgba(148, 163, 184, 0.85);
  font-size: 11px;
  font-weight: 400;
  letter-spacing: normal;
  text-align: center;
}

:host(a2ui-basic-textfield) > label,
:host(a2ui-datetimeinput) > label,
:host(a2ui-choicepicker) > label {
  color: #94a3b8;
  font-size: var(--a2ui-label-font-size, 11px);
  font-weight: 600;
}

:host(a2ui-basic-textfield) .a2ui-textfield,
:host(a2ui-datetimeinput) input,
:host(a2ui-datetimeinput) select {
  width: 100%;
  box-sizing: border-box;
  border-color: rgba(0, 229, 255, 0.2);
  min-height: 44px;
  background-color: #0f172a;
  color: #f1f5f9;
}

:host(a2ui-basic-textfield) .a2ui-textfield:focus,
:host(a2ui-datetimeinput) input:focus,
:host(a2ui-datetimeinput) select:focus {
  outline: none;
  border-color: var(--a2ui-color-primary, #00e5ff);
  box-shadow: 0 0 0 2px rgba(0, 229, 255, 0.28);
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
  padding: var(--a2ui-choicepicker-chip-padding, 8px 14px);
  border-radius: var(--a2ui-choicepicker-chip-border-radius, 10px);
  border: 1px solid rgba(0, 229, 255, 0.2);
  background: #1a2236;
  color: #94a3b8;
  font-size: var(--a2ui-font-size-s, 12px);
  font-weight: 400;
}

:host(a2ui-choicepicker) .chip.selected {
  background: linear-gradient(
    135deg,
    rgba(0, 229, 255, 0.35) 0%,
    rgba(124, 58, 237, 0.45) 100%
  );
  border-color: var(--a2ui-color-primary, #00e5ff);
  color: #f1f5f9;
  font-weight: 600;
  box-shadow: 0 0 12px rgba(0, 229, 255, 0.15);
}

/* 旅行偏好：设计稿为胶囊 Chip */
:host(a2ui-basic-column) a2ui-basic-row:nth-last-child(2) a2ui-choicepicker .chip {
  border-radius: 999px;
}

:host(a2ui-choicepicker) .options label {
  color: #f1f5f9;
  font-size: 13px;
}

:host(a2ui-choicepicker) .options input[type='radio'],
:host(a2ui-choicepicker) .options input[type='checkbox'] {
  accent-color: var(--a2ui-color-primary, #00e5ff);
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
    135deg,
    var(--a2ui-color-primary, #00e5ff) 0%,
    #7c3aed 55%,
    #ec4899 100%
  );
  border: none;
  color: var(--a2ui-color-on-primary, #061018);
  font-weight: 700;
  min-height: 50px;
  box-shadow:
    0 4px 20px rgba(0, 229, 255, 0.45),
    0 0 24px rgba(124, 58, 237, 0.2);
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

:host(a2ui-basic-button) .a2ui-button.a2ui-button-primary:hover,
.a2ui-button.a2ui-button-primary:hover {
  background: linear-gradient(135deg, #22d3ee 0%, #8b5cf6 55%, #f472b6 100%);
  box-shadow:
    0 6px 28px rgba(0, 229, 255, 0.55),
    0 0 36px rgba(236, 72, 153, 0.25);
  transform: translateY(-1px);
}

:host(a2ui-card) {
  border: 1px solid rgba(0, 229, 255, 0.4);
  background: linear-gradient(
    155deg,
    rgba(15, 23, 42, 0.88) 0%,
    rgba(49, 46, 129, 0.75) 100%
  );
  backdrop-filter: blur(24px);
  margin: 0;
  max-width: 520px;
}

:host(a2ui-basic-column) {
  gap: var(--a2ui-row-gap, 16px);
}
`;
