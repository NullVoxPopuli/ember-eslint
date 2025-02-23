import { official } from './official.js';
import { hasBabelConfig, hasTypescript, hasTypeModule } from './utils.js';
import { esm } from './parser-options.js';

// export { stylistic } from './stylistic.js';
//
export const ember = {
  official,
  recommended: official,
};

export const utils = {
  hasBabelConfig,
  hasTypescript,
  hasTypeModule,
};

export const parsers = {
  esm,
};
