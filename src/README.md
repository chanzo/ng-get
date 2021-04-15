# ng-get

[![NPM version][npm-image]][npm-url]
[![GitHub last commit][github-last-commit]](#)
[![Downloads][downloads-image]][npm-url]
[![Dependency status][david-dm-image]][david-dm-url]
[![Dev Dependency status][david-dm-dev-image]][david-dm-dev-url]
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

Get the environment files of a publish Angular app.

This version is still really experimental and works only in some cases.

### Example command

```bash
npx ng-get https://my-angular-website.com
```

<details>
  <summary><strong>Output:</strong></summary>

```text
Inspecting: https://my-angular-website.com

{
  "index": {
    "scripts": [
      "assets/fastclick.js",
      "runtime-es2015.df7729926071e5dff236.js",
      "runtime-es5.df799e51df077f262236.js",
      "polyfills-es5.45be4962716823e202d2.js",
      "polyfills-es2015.184b2fce185406366c85.js",
      "scripts.0c82fb8e202bc9df94df.js",
      "main-es2015.1021e34d6643056b5e3b.js",
      "main-es5.1021e6b33d60e653544b.js"
    ],
    "main": "main-es2015.1021e34d6643056b5e3b.js"
  },
  "ngVersion": "9.1.13",
  "environment": {
    "production": 0,
    "mobile": 1,
    "notifications": 1,
    "firebase": {
      "apiKey": "h4mgWLON54B89EdyXNgvT6jDIsAQawyzfKNrkmw",
      "authDomain": "my-angular.firebaseapp.com",
      "databaseURL": "https://my-angular.firebaseio.com",
      "projectId": "my-angular",
      "storageBucket": "my-angular.appspot.com",
      "messagingSenderId": "11034621970",
      "appId": "1:11034621970:android:059dg57hf478gd3465c69564"
    }
  }
}
```

</details>
&nbsp;
