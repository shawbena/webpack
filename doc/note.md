css-loader
使得 css 和 js 代码捆绑起来。不好的是不能使用浏览器并行或同步加载 css. 页面必须要等到整个 js 文件加载完成后，才渲染样式。
ExtractTextWebpackPlugin

webpack 配置对象（webpack configuration object）(https://doc.webpack-china.org/configuration)

webpack 是一个现代的 JavaScript 应用程序的模块打包器 。当 webpack 处理应用程序时，他会递归地构建一个依赖关系图表，其中包含应用程序需要的每个模块，然后将所有的模块打包成少量的 bundle - 通常只有一个，由浏览器加载。

Loader
webpack 的目标是，让 webpack 聚焦于项目中的所有资源，webpack 把每个文件作用模块处理，而 webpack 中理解 JavaScript.
webpack loader 会将这些文件转换为模块，转换后的文件会被添加到依赖图表中。

Plugins
插件用于解决 loader 无法实现的其他事。webpack 以插件形式提供了灵活强大的自定义 api 功能。使用插件，我们可以为 webpack 添加功能。另外，webpack 提供生命周期钩子以便注册插件。在每个生命周期点，webpack 会支行所有注册的插件，并提供当前 webpack 编译状态信息。

输出（output）
此选项影响 compliation 对象的输出，output 选项控制 webpack 如何向硬盘写入编译文件。可以有多个入口，但只有一个输出。
output.path 是一个绝对路径，是你希望一次性打包的目录。
output.filename 指定每个输出文件的名称。在这里不能指定为绝对路径！output.path 选项规定了文件被写入硬盘的位置。filename 仅用于命名每个文件。

```js
//单个入口
{
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/build'
    }
}
//写入到硬盘：./build/bundle.js
```
```js
//多个入口
//如果你配置创建了多个 'chunk' (例如使用多个入口起点或使用类似 CommonsChunkPlugin 的插件)，你应该使用以下的替换方式来确保每个文件名都不重复：[name] 被 chunk 的 name 替换。[hash] 被 compilation 生命周期的 hash 替换。[chunkhash] 被 chunk 的 hash 替换

{
    entry: {
        app: './src/app.js',
        search: './src/search.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build'
    }
}
```