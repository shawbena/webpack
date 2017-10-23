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

### Avoid Production Specific Tooling

### Minimal Entry Chunk

## Production

### Multiple Compilations

### Source Maps

## Specific Tooling Issues

### Babel

### Typescript

### Sass

