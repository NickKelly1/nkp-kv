# @nkp/kv

[![npm version](https://badge.fury.io/js/%40nkp%2Fkv.svg)](https://www.npmjs.com/package/@nkp/kv)
[![deploy status](https://github.com/nickkelly1/nkp-kv/actions/workflows/release.yml/badge.svg)](https://github.com/nickkelly1/nkp-kv/actions/workflows/release.yml)
[![known vulnerabilities](https://snyk.io/test/github/nickkelly1/nkp-kv/badge.svg)](https://snyk.io/test/github/nickkelly1/nkp-kv)

Zero-dependency NodeJS utility to stringify the key-value pairs of an object.

```ts
import { kv } from '@nkp/kv';

// hello="word"  library="@nkp/kv"
kv({ hello: 'world', im: 'nick' });

// hello="word"
kv({ hello: 'world', }, { key(key: string) => chalk.green(key) });

// change the default key mapper
kv.key = (key: string) => chalk.green(key);
```

## Table of contents

- [Installation](#installation)
  - [npm](#npm)
  - [yarn](#yarn)
  - [pnpm](#pnpm)
  - [Exports](#exports)
- [Usage](#usage)
- [Updating Dependencies](#updating-dependencies)

## Installation

### NPM

```sh
npm install @nkp/kv
```

### Yarn

```sh
yarn add @nkp/kv
```

### PNPM

```sh
pnpm add @nkp/kv
```

### Exports

`@nkp/kv` targets CommonJS and ES modules. To utilise ES modules consider using a bundler like `webpack` or `rollup`.

## Usage

---USAGE-TEXT---

## Updating dependencies

To update dependencies run one of

```sh
# if npm
# update package.json
npx npm-check-updates -u
# install
npm install

# if yarn
# update package.json
yarn create npm-check-updates -u
# install
yarn

# if pnpm
# update package.json
pnpx npm-check-updates -u
# install
pnpm install
```

## Publishing

To a release a new version:

1. Update the version number in package.json
2. Push the new version to the `master` branch on GitHub
3. Create a `new release` on GitHub for the latest version

This will trigger a GitHub action that tests and publishes the npm package.
