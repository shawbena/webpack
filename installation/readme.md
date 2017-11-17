# Installation

本指南带你用各种方法安装 webpack.

## Pre-requisites

在开始前，确保你已安装了新版本的 [Node.js](https://nodejs.org/en/). 当前的长期支持发布版 (LTS) 是理想的开始点。使用旧版本的 Node.js 可能会遇到各种问题，因为他们可能缺少 webpack 和/或其相关包需要的功能。

# 本地安装

最新的 webpack 发布版是：

[![GitHub release](https://img.shields.io/npm/v/webpack.svg?label=webpack&style=flat-square&maxAge=3600)](https://github.com/webpack/webpack/releases)

安装最近的发布版或指定的版本，运行以下命令之一：

```bash
npm install --save-dev webpack
npm install --save-dev webapck@<version>
```
对大多项目我们推荐用本地安装。这使得当大的变化引入时更容易单独更新项目。通常 webpack 通过一个或多个 [npm](https://docs.npmjs.com/misc/scripts)脚本运行, 这些脚本将会寻找你本地 `node_modules` 目录中安装的 webpack.

```json
"scripts": {
    "start": "webpack --config webpack.config.js"
}
```
要运行本地安装的 webpack 你可以访问其 bin 版本 `node_modules/.bin/webpack`

# 全局安装

以下 NPM 安装将命名 `webpack` 全局可用：

```bash
npm install --global webpack
```

注意这是不推荐的实践。全局安装将锁定一个特定版本的 webpack 在使用不同版本 webpack 的项目中将会失败。

## Bleeding Edge

如果对 webpack 提供的最新的技术很有热情，你可以用以下命令安装 beta 版或甚至直接众 webpack 仓库安装：

```bash
npm install webpack@beta
npm install webpack/webpack$<tagname/branchname>
```

安装这些 bleeding edge 发布版时请注意！他们可能仍包含 bugs 且不应用在生产中。