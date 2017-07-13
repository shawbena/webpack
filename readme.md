# Installation

本指南带你用各种方法安装 webpack.

# 本地安装

```bash
npm install --save-dev webpack
npm install --save-dev webapck@<version>
```
对大多项目我们推荐用本地安装。这使得当大的变化引入时更容易单独更新项目。通常 webpack 通过一个或多个 [npm](https://docs.npmjs.com/misc/scripts)脚本运行, 这些脚本将会寻找你本地 node_modules 目录中安装的 webpack.

```json
"scripts": {
    "start": "webpack --config webpack.config.js"
}
```
要运行本地安装的 webpack 你可以访问其 bin 版本 node_modules/.bin/webpack

# 全局安装