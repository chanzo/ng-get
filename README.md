[![NPM version][npm-image]][npm-url]
[![GitHub last commit][github-last-commit]](#)
[![Downloads][downloads-image]][npm-url]
[![Dependency status][david-dm-image]][david-dm-url]
[![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]

[![NPM](https://nodei.co/npm/ng-get.png?compact=false)](https://www.npmjs.com/package/ng-get)

[![License][license-image]](/LICENSE)

[npm-url]: https://npmjs.org/package/ng-get
[npm-image]: https://img.shields.io/npm/v/ng-get.svg
[downloads-image]: https://img.shields.io/npm/dm/ng-get.svg
[github-last-commit]: https://img.shields.io/github/last-commit/chanzo/ng-get.svg?maxAge=2400
[david-dm-url]: https://david-dm.org/chanzo/ng-get
[david-dm-image]: https://img.shields.io/david/chanzo/ng-get.svg
[david-dm-dev-url]: https://david-dm.org/chanzo/ng-get?type=dev
[david-dm-dev-image]: https://img.shields.io/david/dev/chanzo/ng-get.svg
[license-image]: https://img.shields.io/npm/l/ng-get.svg

# ![Logo](docs/readme-logo.png) ng-get sources

This repository contains the Typescript source code of `ng-get`. The sources are located in the **src** directory.
This readme describes how to build and deploy `ng-get` it self. For the npm package documentation open
the [readme](src/README.md) located in the **src** directory.

### Tools

- [node](https://nodejs.org/en/) - JavaScript runtime
- [nvm](https://github.com/creationix/nvm) - node version manager
- [tsc](https://www.typescriptlang.org/) - TypeScript
- [launch](https://www.npmjs.com/package/script-launcher) - Script Launcher

### Basic setup

```bash
git clone git@github.com:chanzo/ng-get.git
cd ng-get

npm install
npm start
```

### Build & Publish

```bash
npm start build
cd dist/package
npm login
npm whoami
npm publish
```

### Dependencies

- [acorn](https://github.com/acornjs/acorn) - A small, fast, JavaScript-based JavaScript parser
- [acorn-walk](https://github.com/acornjs/acorn/tree/master/acorn-walk) - An abstract syntax tree walker for the ESTree format
- [htmlparser2](https://github.com/fb55/htmlparser2) - Forgiving HTML and XML parser
