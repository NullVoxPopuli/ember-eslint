# ember-eslint

The easiest way to get linting going in in your ember project

## Setup

```bash
npm add ember-eslint eslint
```

In `eslint.config.mjs`,
```js
import { ember } from 'ember-eslint';

export default [
    ...ember.recommended(import.meta.dirname),
];
```

In `package.json`:

```js
"scripts": {
    "lint:js": "eslint .",
    "lint:js:fix": "eslint . --fix"
}
```

And that's it!

## The configs

All configs will "do the right thing" when they detect that you're using (or not using) TypeScript, V2 (Vite) projects, etc

### `recommended` aka "official"

This config mirrors the lint config that is specified in `ember-cli`, and where any significant change has a Request For Comments.

```js
import { ember } from 'ember-eslint';

export default [
    ...ember.recommended(import.meta.dirname),
];
```

## Debugging ESLint

Docs: https://eslint.org/docs/latest/use/configure/debug
 
Print a file's calculated configuration

```bash
npx eslint --print-config path/to/file.js
```

Inspecting the config

```bash
npx eslint --inspect-config
```
