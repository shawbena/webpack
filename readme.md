# production

下面的文章描述了使用 webpack 构建一个发布版的站点或应用时的最佳实践和工具。

## The Automatic Way

运行 `webpack -p` (或等同的 `webpack --optimize-minimize --define process.env.NODE_ENV="'production'"`). 这执行以下步骤：

* 使用 `UglifyJsPlugin` 压缩
* 运行 `LoderOptionsPlugin` 见 (/content/plugins/loder-options-plugin.md)
* 设置 NodeJS 环境变化触发某些包裹进行区别编译

### Minification

webpack comes with `UglifyJsPlugin`，他运行 [UglifyJS](http://lisperator.net/uglifyjs/)进行最小化输出。此插件支持所有的 [UglifyJS options](https://github.com/mishoo/UglifyJS2#usage). 在命令行指定 `--optimize-minimize`, 添加以下插件配置：

```js
// webpack.config.js
const webpack = require('webpack');

module.export = {
  /*...*/
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: options.devtool && (options.devtool.indexOf('sourcemap') >= 0 || options.devtool.indexOf('source-map') >= 0)
    })
  ]
};
```

因此 Source Maps 依赖 [devtool options](configuration/devtool) 生成。

### Source Maps

我们鼓励在生产中启用 source maps, 这对调试和 benchmark test 都很有用。webpack 可生成内联的 source map 或独立文件的 source map.

在你的配置中，使用 `devtool` 对像设置 Source Map 类型。我们当前支持7种类型的 source maps，详见[配置文档](configuration/devtool)页面 (`cheap-module-source-map` 是一个简单的选项，使用简单的每行映射)。

## Node Environment Variable

运行 `webpack -p` (或 `--define process.env.NODE_ENV="'production'"`) 以以下方式调用调用 [DefinePlugin](https://github.com/webpack/webpack.js.org/blob/master/plugins/define-plugin)：

```js
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  /*...*/
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};
```
...
/.\\\..

## The Manual Way

当我们心中有用于不同环境的多个配制时，最简单的方法是为每个环境写单独的 webpack 配置。

### Simple Approach

最简单的方式定义两个完全独立的文件，如：

webpack.dev.js

```js
module.exports = {
  devtool: 'cheap-module-source-map',
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: '[name].bundle.js',
    publicPath: publicPath,
    sourceMapFilename: '[name].map'
  },
  devServer: {
    port: 7777,
    host: 'localhost',
    historyApiFallback: true,
    stats: 'minimal',
    publicPath: publicPath
  }
};
```

webpack.prod.js

```js
module.exports = {
  output: {
    path: path.join(__dirname, '/../dist/asserts'),
    filename: '[name].bundle.js',
    publicPath: publicPath,
    sourceMapFilename: '[name].map'
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    })
  ]
};
```

然后调整 `package.json` 中的 `scripts`:

package.json

```json
"scripts": {
  ...
  "build:dev": "webpack --env=dev --progress --profile --colors",
  "build:dist": "webpack --env=dev --progress --profile --colors"
}
```

现在把我们的基本配置变成一个接收 `env` 参数 (能过 `--env` 设置) 函数，你可以在两个配置之间切换A:

webpack.config.js

```js
module.exports = function(env){
  return require(`./webpack.${env}.js`);
}
```

关于 `env` 标符的详细信息请参考 [common options section](https://webpack.js.org/api/cli#common-options).

### Advanced Approach

更复杂的是有一个基本的配置，包含环境和能与环境特定配置和并的通用配置。这会生成对每个环境的完整配置且防止共同项的重复。

用于执行合并的工具叫 [webpack-merge](https://github.com/survivejs/webpack-merge) 且提供了各种合并选项，然而我们要用的是最简单的版本。

添加我们的基本配置：

webpack.common.js
...

然后用 `webpack-merge` 合并通用配置和环境特写的配置。让我们看一个我们合并的发布版的例子：

webpack.prod.js
...

你将注意到 webpack.prod.js 文件有大主要更新：

* 使用 `webpack-merge` 与 'webpack.common.js' 合并
* 将 `output` 属性移动到 `webpack.common.js`, 因为该属性通用所有的环境
* 只在 `webpack.prod.js` 中使用 `production` 定义 `'process.env.NODE_ENV'` 为 `'production'`.

上面的例子仅仅演示了几个在每个环境中使用的典型的配置选项。既然你已经知道了如何分割配置项，选项放哪里取决于你。

## output.publicPath

`string`, default ""

```js
publicPath: "https://cdn/example.com/assets/", //CDN (always HTTPS)
publicPath: "//cdn.example.com/assets/", //CDN (same protocol)
publicPath: "/assets/", //server-relative
publicPath: "../assets/", //relative to HTML page
publicPath: "" //relative to HTML page (same directory)
```

当按要加载或加载外部资源如图像，文件等竺时很有用。如果指定的不正确的值，那加载资源时会收到 404 错误。

这个选项指定输出目录在浏览器中引用的 public URL。相对的 URL 是相对 HTML 页面 (或 `<base>` 标签) 解析.

这个选项前缀每个运行时或 loaders 创建的 URL. 因为这个选项的值大多情况下以 / 结尾。

webpack-dev-server 也从 `publicPath` 得到暗示，使用他决定从哪里服务输出文件

## webpack.LoaderOptionsPlugin

`LoaderOptionsPlugin` 与其他插件的不同在于他用于从 webpack 1 到 2 的迁移。webpack 2, 中 `webpack.config.js` 的架构变得更加严格，不再对其他 loaders 或 plugins 扩展开放。这个插件用于直接给 loaders 或 plugins 传递 `options` (如 `options` 不在是 global 的或共享的)

然而，直至 loader 更新至依赖直接传递给他们的选项，`LoaderOptionsPlugin` 将一直存在作为桥梁。你可用用这个插件配置全局选项，所有的 loader 都会收到这些选项。

```js
new webpack.LoaderOptionsPlugin({
  //options...
})
```

这个插件将在将来移除，他的存在仅用于迁移.

### 选项

该插件支持以下选项：

`options.debug` (boolean): 插件是否以 debug 模式，debug 将在 webpack 3 中移除
`options.minimize` (boolean): 是否可以切换插件以最小化代码
`options.options` (object): 一个配置对象，可用于配置老的 loader - 这将与 webpack.config.js 采取同样的架构
`options.options.context` (string): 可用于配置老的 loader 的上下文
`webpack.config.js` 允许的其他选项

### 用法

这里有一个怎么使用这个插件的例子：

```js
new webpack.LoaderOptionsPlugin({
  minimize: true,
  debug: false,
  options: {
    context: __dirname
  }
})
```