import React from 'react';
import { createReactComponent } from '@boteteam/a2ui-custom-kit';
import { YourComponentApi } from '../api/yourComponent.api';

export const YourComponentElement = createReactComponent(YourComponentApi, ({ props }) => {
  const text = String(props.title ?? '');
  return (
    <h2
      style={{
        margin: 0,
        fontWeight: 600,
        color: 'var(--a2ui-color-primary, #1677ff)',
      }}
    >
      {text}
    </h2>
  );
});
