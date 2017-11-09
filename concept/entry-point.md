# entry-points

正如在 [Getting Started](/guides/getting-started/#using-a-configuration) 提到的，定义 webpack 配置文件中的 `entry` 属性有多种方式。我们将展示你可以配置 `entry` 属性的方式，并解释下为什么他对你有用。

## Single Entry (Shorthand) Syntax

用法：`entry.string|Array<string>`

__webpack.config.js__

```js
const config = {
    entry: './path/to/my/entry/file.js'
};

module.exports = config;
```

`entry` 属性的单个接口写法是以下写法的简写：

```js
const config = {
    entry: {
        main: './path/to/my/entry/file.js'
    }
};
```

如果给 `entry` 传数一个数组会怎样？给 `entry` 属性传递一个数组的的文件路径创建所谓的 **"multi-main entry"**. 当你想一同注入多个依赖文件并将他们的依赖绘成一个 "chunk". // 慎用此语法

## Object Syntax

Usage: `entry: {[entryChunkName: string]: string | Array<string>}`

__webpack.config.js__

```js
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```

对象语法非常详细。而这是定义你应用程序入口点的最具伸缩的方式。

可伸缩的 (scalable) webpack 配置是可被重用且可以结合其他部分配置。这种流行的技术用于用环境，构建目标和运行时分开关系。然后用指定的工具如 [webpack-merge]((https://github.com/survivejs/webpack-merge) 合并。

## Scenarios

以下是一个入口配置列表和其真实的使用情形：

### Separate App and Vendor Entries

__webpack.config.js__

```js
const config = {
    entry: {
        app: './src/app.js',
        vendors: './src/vendors.js'
    }
};
```

这做了什么？表面上这告诉 webpack 从 `app.js` 和 `vendors.js` 创建依赖图表。这些图标是分开和彼此独立的 (每个 bundle 中将会有一个 webpack bootstrap). 常见的是仅有一个入口点 (不包括 vendors) 的单一页面应用。

为什么？这个设置使得你可以利用 `CommonsChunkPlugin` 并从你的 app bundle 中往你的 vendor bundle 中提取任何 vendor 引用，以 `__webpack_require__()` 调用替换他们。如果你的应用 bundle 中没有 vendor 代码，那你可以获得 webpack 中称为 [long-term vendor-caching](/guids/caching) 的常见模式。

考虑移除这种情形使用 DllPlugin, 其提供更好的 vendor-splitting.

### Multi Page Application

__webpack.config.js__

```js
const config = {
    entry: {
        pageOne: './src/pageOne/index.js',
        pageTwo: './src/pageTwo/index.js',
        pageThree: './src/pageThree/index.js'
    }
};
```
这做了什么？这告诉 webpack 我们想要3个不同的依赖图表 (类似上面的示例)。

为什么？在多页面应用中，服务器将为你获取一个新的 HTML 文档。页面重载新文档且静态资源 (assets)重新下载。而这也给你做很多事情的机会：

- 使用 `CommonsChunbkPlugin` 创建每个页面间共享的应用程序代码。入口点间重用很多代码的多页面应用随着用入点的增加会从这些技术中大大获益。

经验之谈：对于每个页面只使用一个入口点。
