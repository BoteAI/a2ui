/**
 * 复制到 remote-comp：src/pages/A2UIRemoteGlow/index.tsx
 * lingxirc remoteComponents.entry 增加 'A2UIRemoteGlow'；给主应用 import 请用 yarn build:a2ui-esm 产出 .mjs，勿用 lingxi 的 build:remote .js
 *
 * 依赖：在 remote-comp 的 package.json 增加与主应用同版本的 @bote/a2ui-custom-kit
 */
import { z } from 'zod';
import {
  createNativeElement,
  defineComponentApi,
  defineRegistryEntry,
  dispatchA2UIAction,
  DynString,
  mergeRegistryEntries,
  readComponentProps,
  readStringProp,
} from '@bote/a2ui-custom-kit/remote-runtime';

const RemoteGlowCapsuleApi = defineComponentApi({
  name: 'RemoteGlowCapsule',
  shape: { label: DynString, tone: z.enum(['purple', 'blue']).optional() },
});

const RemoteGlowCapsuleElement = createNativeElement('RemoteGlowCapsuleElement', {
  render(host) {
    const props = readComponentProps(host);
    const label = readStringProp(props, 'label', 'Remote');
    host.replaceChildren();
    host.style.display = 'block';
    const wrap = document.createElement('button');
    wrap.type = 'button';
    wrap.textContent = label;
    wrap.style.cssText =
      'cursor:pointer;padding:10px 16px;border-radius:999px;border:none;background:linear-gradient(90deg,#722ed1,#1677ff);color:#fff;font-weight:600;';
    wrap.onclick = () => {
      dispatchA2UIAction(host, {
        name: 'remote_glow_click',
        context: { source: 'RemoteGlowCapsule', label },
      });
    };
    host.appendChild(wrap);
  },
});

/**
 * 主应用 loadRemoteA2UICustomRegistry 会读取此导出（默认名 a2uiRemoteRegistry）。
 */
export const a2uiRemoteRegistry = mergeRegistryEntries(
  defineRegistryEntry(RemoteGlowCapsuleApi, RemoteGlowCapsuleElement),
);
