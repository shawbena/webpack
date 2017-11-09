# configuration types

除了导出一个单个配置对象，也有其他方式满足其他需求。

## Exporting a Function

最终你要区别你的 `webpack.config.js` 是在 [development](/guides/development) 还是 [production builds](/guides/production)。你有 (至少) 两个选择。

选择一是从 webpack 配置中输出一个函数而非输出一个对象。将用两个参数调用这个函数：

- 环境作为第一个参数。语法示例见 [environment options CLI](/api/cli#environment-options)。

- 映射为第二个参数的选项 (`argv`)。这描述传递给 webpack 的选项，键如 [output-filename](/api/cli/#output-options) 和 [optimize-minimize](/api/cli/#optimize-options). // cli 中没有关于第二个参数的描述

## Exporting a Promise

webpack 将运行配置文件输出的函数并等待 Promise 返回。当你需要异步加载配置变量是便宜。

```js
module.exports = () => {
    return new Promise(resolve, reject) => {
        setTimeout(() => {
            resolve({
                entry: './app.js',
                /* ... */
            })
        }, 5000
    })
};
```

## Exporting multiple configurations

你也可以导出多个配置 (multiple functions are supported since webpack 3.1.0) 而非只输出一个单一配置。当运行 webpack 时，所有的配置都被构建。如，当构建一个用于多[目标](/configuration/output#output-librarytarget)如 AMD 和 CommonJs 的[库](/guides/author-libraries)时有用:

```js
module.exports = [{
    output: {
        filename: 'dist-amd.js',
        libraryTarget: 'amd'
    },
    entry: './app.js'
},{
    output: {
        filename: './dist-commonjs.js',
        libraryTarget: 'commonjs'
    },
    entry: './app.js'
}];
```
