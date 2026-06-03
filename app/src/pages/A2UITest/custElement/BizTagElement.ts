import {
  createNativeElement,
  dispatchDeclaredAction,
  readComponentProps,
  readStringProp,
  resolveBoundValue,
  defineComponentApi,
  DynString,
  ActionSchema,
} from '@boteteam/a2ui-custom-kit';

export const BizTagApi = defineComponentApi({
  name: 'BizTag',
  shape: {
    label: DynString,
    tone: DynString.optional(),
    action: ActionSchema.optional(),
  },
});

export const BizTagElement = createNativeElement('BizTagElement', {
  render(host) {
    const props = readComponentProps(host);
    const label = resolveBoundValue(host, props.label) || readStringProp(props, 'label', 'Tag');
    const tone = readStringProp(props, 'tone', 'default');

    host.style.display = 'block';
    host.style.margin = '8px 0';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.setAttribute('data-tone', tone);
    btn.style.cssText =
      'cursor:pointer;border:1px solid #91caff;border-radius:8px;padding:6px 12px;background:#f0f5ff;color:#0958d9;font-size:13px;';
    btn.onclick = () => {
      dispatchDeclaredAction(host);
    };

    host.replaceChildren(btn);
  },
});
