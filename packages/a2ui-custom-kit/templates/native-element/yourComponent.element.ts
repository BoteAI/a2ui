import {
  createNativeElement,
  dispatchA2UIAction,
  readComponentProps,
  readStringProp,
} from '@boteteam/a2ui-custom-kit';

export const YourComponentElement = createNativeElement('YourComponentElement', {
  render(host) {
    const props = readComponentProps(host);
    const title = readStringProp(props, 'title', '标题');
    const subtitle = readStringProp(props, 'subtitle', '');
    const actionName = readStringProp(props, 'actionName', 'your_component_click');

    host.style.display = 'block';
    host.replaceChildren();

    const root = document.createElement('div');
    root.style.cssText = 'padding:12px;border:1px solid var(--a2ui-color-primary,#1677ff);border-radius:8px;';

    const titleEl = document.createElement('strong');
    titleEl.textContent = title;
    titleEl.style.cursor = 'pointer';
    titleEl.onclick = () => {
      dispatchA2UIAction(host, {
        name: actionName,
        context: { source: 'YourComponent', title, subtitle },
      });
    };

    root.appendChild(titleEl);
    if (subtitle) {
      const subEl = document.createElement('div');
      subEl.textContent = subtitle;
      subEl.style.marginTop = '6px';
      subEl.style.fontSize = '13px';
      root.appendChild(subEl);
    }

    host.appendChild(root);
  },
});
