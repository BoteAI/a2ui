import { defineRegistryEntry, mergeRegistryEntries } from '@boteteam/a2ui-custom-kit';
import { YourComponentApi } from '../api/yourComponent.api';
import { YourComponentElement } from '../elements/yourComponent.element';

export const yourCustomComponents = mergeRegistryEntries(
  defineRegistryEntry(YourComponentApi, YourComponentElement),
);
