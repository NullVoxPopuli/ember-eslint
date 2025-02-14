import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function hasBabelConfig(root) {
  return existsSync(join(root, 'babel.config.cjs'));
}

export function hasTypescript(root) {
  return existsSync(join(root, 'tsconfig.json'));
}

export function hasTypeModule(root) {
  let manifestPath = join(root, 'package.json');
  let buffer = readFileSync(manifestPath);
  let manifest = JSON.parse(buffer.toString());

  return manifest.type === 'module';
}
