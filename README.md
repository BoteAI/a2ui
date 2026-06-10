# Bote A2UI

**A React rendering SDK for the [A2UI](https://github.com/google/A2UI) protocol — turn LLM-generated UI messages into interactive web interfaces, with theming, custom components, and a live Playground.**

English | [中文](./README.zh-CN.md) · **Repository**: [github.com/BoteAI/a2ui](https://github.com/BoteAI/a2ui)

> This project is under active development. `@bote/a2ui-render` and `@bote/a2ui-custom-kit` are being prepared for open source. Feedback and contributions are welcome.

---

## Try the Playground

Browse 30+ component demos, switch themes, and edit JSON — no Agent setup required.

**Requirements**: Node.js 16+ and Yarn 1.x

```bash
git clone https://github.com/BoteAI/a2ui.git
cd a2ui

yarn bs          # install workspace dependencies
yarn build       # build packages (first run or after package changes)
yarn start       # start Playground dev server
```

Open in your browser:

| Page | URL |
|------|-----|
| **Playground v0.9** (default) | [http://localhost:8000/#/a2ui-playgroup/v9](http://localhost:8000/#/a2ui-playgroup/v9) |
| Playground v0.8 | [http://localhost:8000/#/a2ui-playgroup/v8](http://localhost:8000/#/a2ui-playgroup/v8) |
| Custom component guide | [http://localhost:8000/#/a2ui-playgroup/v9/custom-components-guide](http://localhost:8000/#/a2ui-playgroup/v9/custom-components-guide) |

Alternatively: `cd app && yarn dev` — same as `yarn start` from the repo root.

While developing packages, run `yarn watch` in another terminal to rebuild `@bote/a2ui-render` and `@bote/a2ui-custom-kit` on change.

---

## What Problem Does It Solve?

When an AI Agent or backend sends **A2UI protocol messages** (structured JSON describing UI layout, data bindings, and actions), you need a **client-side renderer** that can:

1. Parse streaming or batch protocol messages
2. Draw standard A2UI components (Text, Button, Card, List, …)
3. Apply consistent theming across surfaces
4. Wire user interactions back to your business layer via `onAction`
5. **Extend** the component catalog when the protocol references your own component names

**Bote A2UI** is a **Web / React** solution for that pipeline, focused on **browser-based Agent UI**, chat bubbles, admin consoles, and micro-frontends.

```
Agent / Backend
      │  A2UI messages JSON
      ▼
@bote/a2ui-render          ← protocol renderer (React + Lit surface)
      │  customComponents registry
      ▼
@bote/a2ui-custom-kit      ← define, register, bundle custom components
      │
      ▼
Your business UI (local bundle or remote .mjs)
```

---

## Packages

| Package | npm | Role |
|---------|-----|------|
| **a2ui-render** | `@bote/a2ui-render` | A2UI v0.8 / v0.9 protocol renderer |
| **a2ui-custom-kit** | `@bote/a2ui-custom-kit` | Custom component authoring toolkit |

This repo also ships a **Playground app** under `app/` for browsing demos, editing JSON, and validating custom components — not published to npm.

---

## Key Features

### 1. Protocol Rendering Engine

`BaseRenderer` accepts an array of A2UI messages and renders a fully interactive surface. Supports **protocol v0.8 and v0.9**, automatic version inference, responsive helpers, and declarative action callbacks.

```tsx
import { BaseRenderer, type A2UIMessage } from '@bote/a2ui-render';

<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  themePreset="deepBlueWisdom"
  onAction={({ name, context }) => {
    // handle button clicks, form submits, etc.
  }}
/>
```

### 2. Built-in Theme Presets — One-Prop Switching

Four curated visual themes ship out of the box (plus a default base), each implemented as CSS variable overrides and optional Shadow DOM stylesheets. Switch themes at runtime with a single `themePreset` prop — no rebuild required.

| Preset | Description |
|--------|-------------|
| `default` | A2UI Lit default tokens |
| `conversation` | Chat-friendly spacing and rounded controls |
| `cyber` | Vibrant tech / neon accent style |
| `platformInterconnect` | Enterprise platform interconnect look |
| `deepBlueWisdom` | Deep blue wisdom dashboard style |

See [`packages/a2ui-render/styleVars.md`](./packages/a2ui-render/styleVars.md) for the full token list.

### 3. Custom Components — Two Integration Paths

When protocol messages reference **your own component names**, register implementations via `@bote/a2ui-custom-kit`:

| Path | When to use | Output |
|------|-------------|--------|
| **Local registry** | Components live in the same app as the renderer | `customComponents` object passed to `BaseRenderer` |
| **Remote ESM bundle** | Independent teams, CDN delivery, micro-frontends | esbuild `.mjs` loaded via `loadRemoteA2UICustomRegistry` |

Both paths share the same registry shape — define API with Zod, implement as **native Web Component** or **React bridge**, merge entries, and hand off to the renderer.

![Custom component development and runtime rendering pipeline](./app/public/assets/custom-component-pipeline.png)

**Typical local flow**

```ts
import {
  defineComponentApi,
  createReactComponent,
  defineRegistryEntry,
  mergeRegistryEntries,
} from '@bote/a2ui-custom-kit';

const api = defineComponentApi({ name: 'MyCard', shape: { title: z.string() } });
const element = createReactComponent(({ title }) => <div>{title}</div>);
const registry = mergeRegistryEntries(defineRegistryEntry({ api, element }));
```

**Remote flow**

```ts
import { loadRemoteA2UICustomRegistry, mergeRegistryEntries } from '@bote/a2ui-render';

const remote = await loadRemoteA2UICustomRegistry(
  'https://cdn.example.com/custom-components.mjs',
);
const customComponents = mergeRegistryEntries(localRegistry, remote);
```

> Detailed guides: [`packages/a2ui-custom-kit/README.md`](./packages/a2ui-custom-kit/README.md) · [`app/public/docs/custom-components-guide.md`](./app/public/docs/custom-components-guide.md)

### 4. A2UI Playground

A built-in **Playground** lets you explore, preview, and iterate without wiring a full Agent first.

![A2UI Playground — component gallery with theme switching](./app/public/assets/playground.png)

| Capability | Details |
|------------|---------|
| **Component gallery** | 30+ v0.9 demos across cards, forms, data views, and special scenarios |
| **Protocol toggle** | Switch between A2UI v0.8 and v0.9 |
| **Live theme switch** | Preview all built-in presets side by side |
| **JSON editor** | Edit messages in place and see instant preview |
| **Custom component guide** | Open **Remote Showcase** in the gallery → **Development Guide**, or read [`app/public/docs/custom-components-guide.md`](./app/public/docs/custom-components-guide.md) |

See [Try the Playground](#try-the-playground) for how to start the app locally.

### 5. Roadmap — SDK Extension Components

The official A2UI catalog covers core layout and input primitives. We plan to ship **additional built-in components inside `@bote/a2ui-render`** — such as data tables, carousels, and rich text — to fill common product gaps without requiring every integrator to build them from scratch.

Planned categories include data display, rich content, and domain-specific widgets. Contributions and RFCs are welcome via Issues.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Agent / LLM                                                 │
│  emits updateComponents / updateDataModel messages           │
└──────────────────────────┬──────────────────────────────────┘
                           │ JSON
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  @bote/a2ui-render                                           │
│  BaseRenderer → LitSurfaceHost → @a2ui/lit Web Components  │
│  · theme presets · onAction · remote registry merge          │
└──────────────────────────┬──────────────────────────────────┘
                           │ component name lookup
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  @bote/a2ui-custom-kit                                       │
│  defineComponentApi · createReactComponent / createNative   │
│  defineRegistryEntry · mergeRegistryEntries · remote ESM   │
└─────────────────────────────────────────────────────────────┘
```

**Which package do I need?**

- **Standard A2UI components only** → `@bote/a2ui-render`
- **Custom components in-app** → both packages; kit produces registry, render consumes it
- **Custom components as remote scripts** → kit for authoring + render's `loadRemoteA2UICustomRegistry` at runtime

---

## Quick Start

### Install

```bash
yarn add @bote/a2ui-render

# if you need custom components
yarn add @bote/a2ui-custom-kit
```

### Minimal render

```tsx
import { BaseRenderer } from '@bote/a2ui-render';

export function AgentPanel({ messages }) {
  return (
    <BaseRenderer
      messages={messages}
      protocolVersion="0.9"
      themePreset="conversation"
      onAction={(event) => console.log(event.name, event.context)}
    />
  );
}
```

### With custom components

```tsx
import { BaseRenderer } from '@bote/a2ui-render';
import { myCustomRegistry } from './my-custom-registry';

<BaseRenderer
  messages={messages}
  protocolVersion="0.9"
  customComponents={myCustomRegistry}
  onAction={handleAction}
/>
```

---

## API Highlights

### `@bote/a2ui-render`

| Export | Description |
|--------|-------------|
| `BaseRenderer` | Core renderer — messages + optional registry |
| `BoteRenderer` | Bote-specific renderer extension |
| `LitSurfaceHost` | Low-level Lit surface host (advanced) |
| `A2UI_THEME_PRESETS` / `A2UI_THEME_PRESET_NAMES` | Built-in theme definitions |
| `loadRemoteA2UICustomRegistry` | Dynamic import a remote `.mjs` registry |
| `loadRemoteA2UICustomRegistries` | Batch-load multiple remote registries |
| `inferProtocolVersionFromMessages` | Auto-detect v0.8 vs v0.9 |
| `useResponsive` / `isMobile` | Responsive utilities |

### `@bote/a2ui-custom-kit`

| Export | Description |
|--------|-------------|
| `defineComponentApi` | Zod-based component API schema |
| `defineRegistryEntry` / `defineSimpleRegistryEntry` | Build registry entries |
| `mergeRegistryEntries` | Merge local + remote registries |
| `createReactComponent` | React → A2UI custom element adapter |
| `createNativeElement` | Native Web Component adapter |
| `readComponentProps` / `dispatchA2UIAction` | Runtime element helpers |
| `subscribeV09ComponentUpdates` | Subscribe to v0.9 property updates |

---

## Development

```bash
# install all workspace dependencies
yarn bs

# start Playground (see "Try the Playground" above)
yarn start

# watch both packages
yarn watch

# build all packages
yarn build

# publish (bumps version + gitHead)
yarn pub a2ui-render 0.1.1
yarn pub a2ui-custom-kit 0.1.1
```

---

## Related

- [A2UI protocol (Google)](https://github.com/google/A2UI)
- [Repository](https://github.com/BoteAI/a2ui)

---

## License

MIT
