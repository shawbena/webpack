# build-performance.md

这篇指南包含一些用于改进构建或编译性能的有用建议。

## General

以下良好的实践将对你有所帮助，无论你是在开发环境还是在生产环境。

### Stay Up to Date

使用最新的 webpack 版本。我们一直在做性能改进。最新版本的 webpack 是：

[![latest webpack version](https://img.shields.io/npm/v/webpack.svg?label=webpack&style=flat-square&maxAge=3600)](https://github.com/webpack/webpack/releases)

保持最新的 *Node.js* 也有助于性能。除此之外，保持更新包管理器 (如 `npm` 或 `yarn`) 最新也有所帮助。新版本创建更有效的模块树而且增加解析速度。

### Loaders

将 loaders 应用到所需的最小数量的模块。而非：

```js
{
    test: /\.js$/,
    loader: "babel-loader"
}
```

使用 `include` 字段将 loaders 只应用于要被转换的模块：

```js
{
    test: /\.js$/,
    include: path.resolve(__dirname, "src"),
    loader: "babel-loader"
}
```

### Bootstrap

每个额外的 loader/plugin 有启动时间。尽可能试着用一些不同的工具。

### Resolving

以下步骤将会增加解析速度：

- 最小化 `resolve.modules`, `resolve.extensions`, `resolve.mainFiles`, `resolve.descriptionFiles` 中的项，因为他们增加文件系统调用。

- 设置 `resolve.symlinks: false`，如果你不同 symlinks (e.g. `npm link` 或 `yarn link`)

- 设置 `resolve.cacheWithContext: false`, 如果你使用自定义的非环境特写的解析插件。

### Dlls

使用 `DllPlugin` 将经常很少变化的代码移入单独的编译。这将增加编译速度，会增加构建进程的复杂度。

### Small = Faster

减少编译总量的大小来增加构建性能。试着保持 chunks small.

- 使用少或小的库

- 在多页面应用中使用 `CommonsChunksPlugin`

- 在多页面应用程序的 `async` 模式中使用 `CommonsChunksPlugin`

- 移除无用代码

- 只编译你当前开发的代码 //怎么做？

### Worker Pool

`thread-loader` 可用于卸下开销在的 loader 到 worker pool.

不要用太多的 worker，这对 Node.js 运行时和 loader 有启动开销。最小化 worker 和主进程间的模块转换。IPC 开销很大的。

### Persistent cache

使用 `cache-loader` 启用一致的缓存。清理 `package.json` 中 `postinstall` 的缓存目录。

### Custom plugins/loaders

配置他们不要在此引入性能问题。

## Development

以下步骤在开发环境中很有用。

## Incremental Builds

使用 webpack 的 watch 模块。不要用其他工具监测文件然后调用 webpack. 内置的 watch mode 将保持追踪时间戳并将这个信息传递给编译用于缓存验证。

设置监测失败至 polling mode. 太多监测文件会造成很多 CPU 负载。这种情形你可以用 `watchOption.poll` 增回抽查间隔。

### Compile in Memory

以下工具通过将编译并将资源放在内存中而非磁盘上来增加性能：

- `webpack-dev-server`

- `webpack-hot-middleware`

- `webpack-dev-middleware`

### Devtool

对不同 `devtool` 设置的不同性能区别要有意识。

- `"eval"` 有最佳性能，but doesn't assist you for transpired code.

- `cheap-source-map` 变种性能表现好一点，如果你能忍受有点差劲的 mapping 质量的话

- 使用 `cheap-module-eval-source-map` 变种用于渐进构建

=> 大多情况下 `cheap-module-eval-source-map` 是最佳的选择。

### Avoid Production Specific Tooling

某些工具，plugins 和 loader 仅当生产构建时有用。如在开发时用 `UglifyJsPlugin` minify 和 mangle 你的代码没什么意义。这些工具通常不应该用在开发中：

- `UglifyJsPlugin`

- `ExtractTextPlugin`

- `[hash] / [chunkhash]`

- `AggreesiveSplittingPlugin`

- `AggreesiveMergingPlugin`

- `ModuleConcatentionPlugin`

### Minimal EntryChunk

## Production

以下步骤在生产中特别有用。

*别为了一点小小的性能牺牲了应用的质量！*

记住大多情况下质量的优化比性能的优化更重要。

### Multiple Compilations

When using multiple compilations the following tools can help:

- parallel-webpack: It allows to do compilation in a worker pool.
- cache-loader: The cache can be shared between multiple compilations.

### Source Maps

Source maps 开销真的很大。你真的需要他们吗？

## Specific Tooling Issues

以下工具有某些问题会降低构建性能。

### Babel

- 最小化 preset/plugins 的数量

### Typescript

- 使用 `fork-ts-checker-webpack-plugin` 在单独进程中进行类型检查

- 配置 loaders 跳过类型检查

- 使用 `ts-loader` 用 `happyPackMode: true` / `transpileOnly: true`

### Sass

`node-sass` 有个 bug 会阴塞 Node.js 线程池中的线程。当他和设置 `workerParallelJobs: 2` 的 `thread-loader` 一起使用时。

