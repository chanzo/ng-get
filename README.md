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

Get the environment files of a publish Angular app.

### Example command

```bash
npx ng-get https://my-angular-website.com
```

<details>
  <summary><strong>Output:</strong></summary>

```text
[
  'runtime-es2015.df79926e5071dff72236.js',
  'runtime-es5.df79926e5071dff72236.js',
  'polyfills-es5.45b23e47196826e202d2.js',
  'polyfills-es2015.8518fc4b12e406366c85.js',
  'main-es2015.1021e6b3443d65605e3b.js',
  'main-es5.1021e6b3443d65605e3b.js'
]
```

</details>
&nbsp;
