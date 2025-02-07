import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function hasBabelConfig(root) {
  return existsSync(join(root, 'babel.config.cjs'));
}

export function hasTypescript(root) {
  return existsSync(join(root, 'tsconfig.json'));
}
