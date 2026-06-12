/* eslint-disable no-console */
import path from 'path';
import { fileURLToPath } from 'url';
import { generateA2uiSchemas } from './generate-a2ui-schemas.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'a2ui-preset-schema.config.mjs');

const userConfig = (await import(configPath)).default;
await generateA2uiSchemas(root, userConfig);
