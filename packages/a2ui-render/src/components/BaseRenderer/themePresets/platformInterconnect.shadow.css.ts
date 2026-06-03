/**
 * 平台互联 — 对齐 beijing-travel-platform-interconnect.pen 与 theme_2 智慧互联。
 * 语义色见 A2UI_THEME_PRESET_DEFINITIONS.platformInterconnect.styleVars。
 */
export const PLATFORM_INTERCONNECT_THEME_SHADOW_CSS = `
:host(a2ui-basic-text) h1 {
  font-size: var(--a2ui-font-size-2xl, 24px);
  font-weight: 700;
  line-height: 1.25;
  background: linear-gradient(
    180deg,
    var(--a2ui-color-primary, #0f89fc) 0%,
    #00bbff 50%,
    #00ddaa 100%
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
  border: 1px solid rgba(15, 137, 252, 0.35);
  background: rgba(15, 137, 252, 0.08);
  color: #0f89fc;
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
  border-color: rgba(15, 137, 252, 0.2);
  min-height: 44px;
  background-color: #ffffff;
  color: #414352;
}

:host(a2ui-basic-textfield) .a2ui-textfield:focus,
:host(a2ui-datetimeinput) input:focus,
:host(a2ui-datetimeinput) select:focus {
  outline: none;
  border-color: var(--a2ui-color-primary, #0f89fc);
  box-shadow: 0 0 0 2px rgba(15, 137, 252, 0.2);
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
  background: #ebefff;
  color: #9092a3;
  font-size: var(--a2ui-font-size-s, 12px);
  font-weight: 400;
}

:host(a2ui-choicepicker) .chip.selected {
  background: linear-gradient(
    180deg,
    rgba(204, 237, 255, 1) 0%,
    rgba(235, 239, 255, 1) 100%
  );
  border-color: var(--a2ui-color-primary, #0f89fc);
  color: #2a2b33;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(100, 103, 122, 0.08);
}

:host(a2ui-basic-column) a2ui-basic-row:nth-last-child(2) a2ui-choicepicker .chip {
  border-radius: 999px;
  background: #ffffff;
  border-color: rgba(15, 137, 252, 0.2);
}

:host(a2ui-basic-column) a2ui-basic-row:nth-last-child(2) a2ui-choicepicker .chip.selected {
  background: rgba(15, 137, 252, 0.1);
  border-color: var(--a2ui-color-primary, #0f89fc);
}

:host(a2ui-choicepicker) .options label {
  color: #2a2b33;
  font-size: 13px;
}

:host(a2ui-choicepicker) .options input[type='radio'],
:host(a2ui-choicepicker) .options input[type='checkbox'] {
  accent-color: var(--a2ui-color-primary, #0f89fc);
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
  background: linear-gradient(180deg, #00bbff 0%, #00ddaa 100%);
  border: none;
  color: var(--a2ui-color-on-primary, #ffffff);
  font-weight: 700;
  min-height: 50px;
  box-shadow: 0 4px 16px rgba(15, 137, 252, 0.25);
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

:host(a2ui-basic-button) .a2ui-button.a2ui-button-primary:hover,
.a2ui-button.a2ui-button-primary:hover {
  background: linear-gradient(180deg, #33c9ff 0%, #33e6bb 100%);
  box-shadow: 0 6px 20px rgba(15, 137, 252, 0.32);
  transform: translateY(-1px);
}

:host(a2ui-card) {
  border: 2px solid rgba(15, 137, 252, 0.22);
  background: #ffffff;
  margin: 0;
  max-width: 520px;
}

:host(a2ui-basic-column) {
  gap: var(--a2ui-row-gap, 16px);
}
`;
