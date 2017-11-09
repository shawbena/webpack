## output

配置 `output` 选项告诉 webpack 如何往磁盘写编译的文件。注意，虽然可以有多个入口点，但只能指定一个 `output` 配置。

## Usage

你 webpack 配置中 output 属性的最小需求是将他的值设置为有以下两样的一个对象：

- 用于输出文件的 `filename`

- 喜爱的输出目录的绝对 `path`

__webpack.config.js__

```js
const config = {
    output: {
        filename: 'bundle.js',
        path: '/home/proj/public/assets'
    }
};

module.exports = config;
```

这个配置会往 `/home/proj/public/assets` 目录输出一个单一的 `bundle.js` 文件。

## Multiple Entry Points

如果你的配置创建了不止一个单一的 "chunk" (有多个入口点或当使用 CommonsChunkPlugin 这样的插件)，你应该使用 [substitutions](/configuration/output#output-filename) 来确保每个文件有独一无二的名称。

```js
{
    entry: {
        app: './src/app.js',
        search: './src/search.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    }
}

// writes to dist: ./dist/app.js, ./dist/search.js
```

## Advanced

这里有一个更加复杂的使用 CDN 和 hashes 用于静态资源：

__config.js__

```js
output: {
    path: '/home/proj/cdn/assets/[hash]', // 应该是编译是 hash, 见 output.path
    publicPath: 'http://cdn.example.com/assets/[hash]'
}
```

当在编译时汪能确定输出文件的最终的 `publicPath` 时，可以留空并在运行时在每个入口点文件中设置。如果编译时你不知道 `publicPath`, 你可以忽略他并在你的入口点中设置 `__webpack_public_path__`

```js
__webpack__public_path__ = myRuntimePublicPath

// rest of your application entry
```