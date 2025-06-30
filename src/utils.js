import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const babelConfigCandidates = [
  'babel.config.cjs',
  'babel.config.mjs',
  'babel.config.js',
];

export function hasBabelConfig(root) {
  return babelConfigCandidates.some((candidate) => {
    return existsSync(join(root, candidate));
  });
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
