Loader
loader 用于对模块的源代码进行转换。loader 可以使用你在 require() 或“加载”模块时预处理文件。因此，loader 类似于其他构建工具中“任务（task）”, 并提供了处理前端构建步骤的强大方法。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript, 或将内联图像转换为 data URL. loader 甚至允许你在 JavaScript 中 require() CSS 文件。

loader  特性
* loader 支持链式传递，能够对资源使用流水线（pipeline）。loader 链式地按照先后顺序进行编译。loader 链中的第一个 loader 返回值给下一个 loader. 在最后一个 loader, 返回 webpack 所预期的 JavaScript.
* loader 可以是同步或异步函数。
* loader 运行在 Node.js 中，并且能够执行任何可能的操作。
* loader 接收查询参数。用于 loader 间传递配置。
* loader 能够使用 options 对象进行配置
* 插件可以为 loader 带来更多特性
loader 通过（loader）预处理函，为 JavaScript 生态系统提供了更多有力功能。用户现在可以更加灵活的引入细粒度的逻辑，如压缩，打包、语言翻译和其他更多（https://doc.webpack-china.org/loaders）。

配置
通过配置文件

```js
module: {
    rules: [
        test: /\.css$/,
        use: [
            {
                loader: 'style-loader'
            },
            {
                loader: 'css-loader',
                options: {
                    modules: true
                }
            }
        ]
    ]
}
```

```js
{test: /\.css$, loader: 'css-loader'/}
//or equivalently
{test: /\.css$/, use: 'css-loader'}
//or equivalently
{test: /\.css$/, use: {
    loader: 'css-loader',
    options: {}
}}
```

在 require() 语句中使用 loader

```js
require('style-loader!css-loader?modules!./styles.css');
//可用查询字符串 (?key=value&foo=bar) 或 JSON (?{"key":"value","foo":"bar"}) 对象传递 options
```

通过命令行

```js
webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
```