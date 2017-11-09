# loaders

Loaders 是应用到模块源代码上的转换 (transformations)。Loaders 允许你在 `import` 或 "loade" 文件时预处理他们。因此 loaders 有点像其他构建工具中的 "tasks", loaders 提供处理前端构建的强大方式。Loaders 可以将文件从不同的语言转换为 (如 TypeScript) JavaScript, 或内联图像为 data URLs. Loaders 甚至允许你直接往你的 JavaScript 模块中引入如 CSS 文件。

## Example

如你可以用 loaders 告诉 webpack 加载 CSS 文件或转换 TypeScript 为 JavaScript. 要这么做，你要首先安装需要的 loaders:

```bash
npm install --save-dev css-loader
npm install --save-dev ts-loader
```

然后指示 webpack 将 [css-loader](/loaders/css-loader) 用于每个 `.css` 文件，[ts-loader](https://github.com/TypeStrong/ts-loader) 用于所有的 `.ts` 文件：

__webpack.config.js__

```js
module.exports = {
    module: {
        rules: {
            { test: /\.css$/, use: 'css-loader' },
            { test: /\.ts$/, use: 'ts-loader' }
        }
    }
};
```

## Using Loaders

在你的应用程序中使用 loaders 有三种方式：

- 配置文件 (推荐): 在 **webpack.config.js** 文件中指定他们

- 内联：明确地在每个 `import` 语句中使用他们

- CLI： 用 shell 命令指定他们

### Configuration

[module.rules]() 允许你在你的 webpack 配置中指定一些 loaders. 这是简洁的方式，有助于代码清晰。也提供给你一个每个对应 loader 的完整视图：

```js
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: ['style-loader'](/loaders/style-loader) },
          {
            loader: ['css-loader'](/loaders/css-loader),
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
```

### Inline

也可以在 `import` 语句中指定 loaders, 或是任何 [equivalent "importing" method](/api/module-methods). 用 `!` 将 loaders 和资源分开。每个部分相对于当前目录解析。

```js
import Styles from 'style-loader!css-loader?modules!./styles.css';
```

也可以前缀整条规则以 `!` 来覆盖配置中的任何 loaders.

选项可用查询字符串传递，如 `?key=value&foo=bar`, 或一个 JSON 对象，如 `?{"key": "value", "foo": "bar"}`

T> Use module.rules whenever possible, as this will reduce boilerplate in your source code and allow you to debug or locate a loader faster if something goes south.

### CLI

You can also use loaders through the CLI:

```bash
    webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
```

This uses the jade-loader for .jade files, and the style-loader and css-loader for .css files.

## Loader Features

- Loaders 可被链式。They are applied in a pipeline to resource. 链式的 loader 按年代的次序被编译 (A chain of loaders are compiled chronologically)。链子中第一个 loader 返回一个值给下一个 loader. webpack 期望结尾的 loader 返回 JavaScript.

- Loaders 可以是同步的也可以异步的。

- Loaders 在 Node.js 中运行，可以做任何可能的事。

- Loaders 可接收查询字符串 (query parameters)，这可用于传递配置给 loaders.

- 可用 `options` 对象配置 loaders. // 怎么配置？

- 除正常的 `main` 以外，正常的模埠可以能过 `package.json` 中的 `loader` 字段导出一个 loader.

- 插件可以给 loaders 更多特色。

- Loaders 输出 (emit) 出额外的任意文件。

loaders 通过预处理函数允许 JavaScript 生态中有更强大的能力。使用者能过引入精细的逻辑如压缩，打包，语言转换[等等](/loaders) 获得更多的灵活性。

## Resolving Loaders

Loaders 遵循标准的 [module resolution](/concepts/module-resolution/)。大多情况下将会是 [module path](/concepts/module-resolution/#module-paths) 中的 loader.

期望一个 loader 输出为一个函数并以 Node.js 兼容的 JavaScript 书写。Loader 常常由 npm 管理，但你的应用程序中也可以有自定义的 loader. 按约定，loader 通常以 `xxx-loader` (e.g. `json-loader`) 命名。详情见 ["How to Write a Loader?"](/development/how-to-write-a-loader)