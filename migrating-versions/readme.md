# Migrating Versions

以下部分描述从 webpack 1 到 2 的主要变化。

注意 2 与 3 之间的变化很少，迁移应该不会太糟糕，如果你遇到问题，请看下 [the changelog](https://github.com/webpack/webpack/releases) 查看详情。

这些内容未来可能会移到 blog post 去，因为版本2已经过时了。除此以外，最近发布的版本3，版本4即将到来。迁移而是应该参考下 [the changelog](https://github.com/webpack/webpack/releases).、



## 不在需要 `json-loader` 了

当没有为 JSON 文件配置 loader 时，webpack 将自动尝试用 [json-loader](https://github.com/webpack/json-loader) 加载 JSON 文件。

```diff
module: {
    rules: [
-       {
-           test: /\.json/
-           loader: 'json-loader'
-       }
    ]
}
```

[我们决定这么样做](https://github.com/webpack/webpack/issues/3363)是为了消除 webpack, node.js 和 browserify 之间的差异。


## 配置文件中的 loaders 相对于 context 解析

**webpack 1** 中，配置的 loader 相对于匹配的文件解析。而在 **webpack 2** 中，配置的 loaders 相对于 `context` 选项解析。

## 移除 `module.preLoaders` 和 `module.postLoaders`

```diff
    module: {
-       preLoaders: [
+       rules: [
            {
                test: /\.js$/,
+               enforce: 'pre',
                loader: 'eslint-loader'
            }
        ]     
    }
```

## `UglifyJsPlugin` sourceMap

`UglifyJsPlugin` 的选项现在默认是 `false` 而非 `true`. 这意味着如果你需要压缩代码的 source maps 或相要 uglifyjs 警告的正确行号，你需要设置 `sourceMap: true`。// 与 devtool 一起使用

## `UglifyJsPlugin` 警告

`compress.warning` 选项现在默认为 `false`。这意味着如果你相见 uglifyjs warning, 你应该设置 `compreess.warning` 为 `true`. // 此选项会导致报错, 此选项也没有多大意义

```diff
    devtool: 'source-map',
    plugins: [
        new UglifyJsPlugin({
+           compress: {
+               warnings: true
+           }
        })
    ]
```

## `UglifyJsPlugin` minimize loaders

`UglifyJsPlugin` 不再将 loaders 切换至 minimize 模式。长期而言要需要给 loader 选项传递 `minimize: true`。见相关选项的 loader 文档。

用于 loaders 的 minimize 模式将在 webpack 3 及其以后移除。

为与旧 loaders 兼容，loaders 可能过 plugin 切换至 minimize 模式：

```diff
    plugins: [
+       new webpack.LoaderOptionsPlugin({
+           minimize: true
+       })   
    ]
```

// LoderOptionsPlugin 见 /plugins/loader-option-plugin

## `DedduePlugin` 已经移除

## `BannerPlugin` - 重大变化

`BannerPlugin` 不再接收两个参数，而是一个选项。

```diff
    plugins: [
-       new webpack.BannerPlugin('Banner', { raw: true, entryOnly: true})
+       new webpack.BannerPlugin({banner: 'Banner', raw: true, entryOnly: true})
    ]
```

## `OccurrenceOrderPlugin` 现在默认启用

`OccurrenceOrderPlugin` 现在默认启用且已经被从重使名了 (在 webpack 1 中是 `OccurenceOrderPlugin`). 请确保从你的配置中移除这个插件 

```diff
    plugins: [
        // webpack 1
-       new webpack.optimize.OccurenceOrderPlugin()
        // webpack 2
-       new webpack.optimize.OccurrenceOrderPlugin()
    ]
```

## `ExtractTextWebpackPlugin` - 重大变化

webpack 2 需要版本2的 [ExtractTextPlugin](https://github.com/webpack/extract-text-webpack-plugin).

这个插件配置变化主要是语法上的。

__ExtractTextPlugin.extract__

```diff
    module: {
        rules: [
            test: /\.css$/,
-           loader: ExtractTextPlugin.extract('style-loader', 'css-loader', { publicPath: '/dist' })
+           use: ExtractTextPlugin.extract({
+               fallback: 'style-loader',
+               use: 'css-loader',
+               publicPath: '/dist'
+           })
        ]
    }
```

__new ExtractTextPlugin({ options })__

```diff
    plugins: [
-       new ExtractTextPlugin('bundle.css', { allChunks: true, disable: false })
+       new ExtractTextPlugin({
+           filename: 'bundle.css',
+           disable: false,
+           allChunks: true
+       })
    ]
```

## 完全动态的 requires 现在默认完全失效

仅有表达式的依赖 (如 `require(expr)`) 将创建一个空的语境，而非完整目录的语境。

类似这样的代码应该被重构，因为他不能用于 ES2015 模块。如果这个不可能你可以使用 `ContextReplacementPlugin` 提示编译器朝向正确的解析。

## 在 CLI 和配置中使用自定义参数

如果你滥用 CLI 给配置传自定义参数：

```bash
webpack --custom-stuff
```

```js
//webpack.config.js
var custommStuff = process.argv.indexOf('--custom-stuff') >= 0;
/* ... */
module.exports = config;
```

你可能注意到不在允许这样做了。CLI 现在更可严格。

而是有一个接口可以给配置传递通用数。你应该用他。未来的工具可能会依赖于此。

```bash
webpack --env.customStuff
```

```js
module.exports = function(env){
    var customStuff = env.customStuff;
    /* ... */
    return config;
}
```

见 [CLI](https://webpack.js.org/api/cli)

## `require.ensure` 和 AMD `require` 都是异步的

这些函数现在总是异步的而非 chunk 已经加载就同步调用他们的回调。

`require.ensure` 现在依赖原生的 `Promise`. 如果在缺乏支持的环境中使用 `require.ensure`, 那么你需要一个 polyfill.

## Loader configuration is through `options`

你不能再在 `webpack.config.js` 中使用自定义属性配置 loader 了。必须通过 `options` 来完成。以下有 `ts` 属性的配置在 webpack 2 中不再有效：

```js
module.exports = {
    ...
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader'
        }]
    },
    // does not work with webpack 2
    ts: { transpileOnly: false}
    ...
};
```

### What are `options`?

问得好。严格来说，有两种可能的方式配置 webpack loader. 经典的 `options` 叫 `query`, 是追加到 loader 名的一个字符串，很像查询字符串但实际上更[强大](https://github.com/webpack/loader-utils#parsequery): 

```js
module.exports = {
    ...
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader?' + JSON.stringify({ transpileOnly: false })
        }]
    }
    ...
}
```

但也可以是一个分开的和 loader 一起提供的指定对象：

```js
module.exports = {
    ...
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: { transpileOnly: false }
        }]
    }
    ...
}
```

### `LoaderOptionsPlugin` context

一些 loaders 需要上下文信息并从配置中读取他们。从长期来讲需要能过 loader options 来传递。见 loader 文件的相关选项。

要与老的 loaders 兼容，这个信息可通过 plugin 传递：

```diff
    plugins: [
+       new webpack.LoaderOptionsPlugin({
+           options: {
+               context: ___dirname    
+           }
+       })
    ]
```

### `debug`

在 webpack 1 中这个选项切换 loader 至 `debug` 模式。长期来讲这需要通过 loader 选项来传递。相关选项见 loader 文档。

webpack 3 及其以后将移除 debug 模式。

为保持与旧 loaders 兼容，loaders 可以通过 plugin 切换至 debug 模式：

```diff
-   debug: true,
    plugins: [
+       new webpack.LoaderOptionsPlugin({
+           debug: true
+       })
    ]
```

## Code Splitting with ES2015

在 webpack 1 中，你可以使用 [require.ensure](/api/module-methods#require-ensure) 作用你应用懒加载 chunks 的方法：

```js
require.ensure([], function(require){
    var foo = require('./module');
});
```

ES2015 loader 规范定义了 [import()](/api/module-methods#import-) 作用运行时动态加载 ES2015 模块的方法。webpack 对待 `import()` 作为分割点并将请求的模块放在独立的 chunks 中。`import()` 接收模块名为参数并返回一个 Promise.

```js
function onClick(){
    import('./module').then( module => {
        return module.default;
    }).catch(err => {
        console.log('Chunk loading failed');
    });
}
```

好消息：现在可以处理加载失败了，因为他们是基于 `Promise` 的。

## Dynamic expressions

也可以给 `import()` 传递部分表达式。这和处理 CommonJS 中的表达式相似 (webpack 为所有可能的文件创建一个 [context](https://webpack.github.io/docs/context.html))).

`import()` 为每个可能的模块创建一个独立的 chunk.

```js
function route(path, query){
    return import(`./routes/${path}/route`).then(route => new route.Route(query));
}
```

// This creates a separate chunk for each possible route

## Mixing ES2015 with AMD and CommonJS

至于 AMD 和 CommonJS 你可以自由混合所有这三种模块类型 (即使在同一文件中). 这种情形 webpack 表现的和 babel 和 node-eps 相似：

```js
// CommonJS cosuming ES2015 Module
var book = require('./book');

book.currentPage;
book.readPage();
book.default === 'This is a book';
```

```js
// ES2015 Module consuming CommonJS
import fs from 'fs';    // module.exports map to default
import { readFileSync } from 'fs'; // named exports are read from returned object+

typeof fs.readFileSync === 'function';
typeof readFileSync === 'function';
```

有一点很重要的是你要告诉 Babel 不转换这些模块符号以致 webpack 可以使用他们。你可以在 `.babelrc` 或 `babel-loader` 选项中这设置他。

```json
{
    "presets"： ["es2015", { "modules": false }]
}
```

## Hints

No need to change something, but opportunities.

### Template strings

webpack 现在支持表达式中的模板字符串。这意味着你可以在 webpack 构造中使用他们：

```diff
-   require('./template/' + name);
+   require('./template/${name}');
```

### Configuraiton Promise

webpack 现在支持配置文件返回 `Promise`. 这使得可以在配置文件中做异步处理。

__webpack.config.js__

```js
module.exports = function(){
    return fetchLangs().then( lang => ({
        entry: "...",
        //...
        plugins: [
            new DefinePlugin({ LANGUAGE: lang })
        ]
    });
}
```

### Advance loader matching

webpack 现在支持匹配 loader 更多的事情。

```js
module: {
  rules: [
    {
      resource: /filename/, // matches "/path/filename.js"
      resourceQuery: /^\?querystring$/, // matches "?querystring"
      issuer: /filename/, // matches "/path/something.js" if requested from "/path/filename.js"
    }
  ]
}
```

### More CLI options

现在有些新的 CLI 选项可用：

`--define process.env.NODE_ENV="production"` 见 [DefinePlugin](/plugins/define-plugin/).

`--display-depth` 展示每个模块到入口点的距离。

`--display-used-exports` 展示模块中使用的 export 的信息。

`--display-max-modules` sets the number for modules displayed in the output (defaults to 15).

`-p` 定义了 `process.env.NODE_ENV` 为 `"production"` 现在。

## Loader changes

Changes only relevant for loader authors

### Cacheable

Loaders 现在默认 cacheable. 如果不 cacheable 必须设置。

```diff
    // Cacheable loader
    module.exports = function(source){
-       this.cacheable();
        return source;
    }
```

```diff
    // Not cacheable loader
    module.exports = function(source){
+       this.cacheable(false);
        return source;
    }
```

### Complex options

___webpack 1__ 仅支持用于 loaders 的可 `JSON.stringify` 的选项。

**webpack 2** 现在支持任何 JS 对象作为 loader 选项。

Before webpack 2.2.1 (i.e. from 2.0.0 through 2.2.0), using complex options required using ident for the options object to allow its reference from other loaders. This was removed in 2.2.1 and thus current migrations do not require any use of the ident key.

```diff
{
  test: /\.ext/
  use: {
    loader: '...',
    options: {
-     ident: 'id',
      fn: () => require('./foo.js')
    }
  }
}
```

