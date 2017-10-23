# public-path.md

`publicPath` 配置选项在不同种类的情形中会相当有用。他使得你可以指定你应用程序中的所有静态资源的 (assets) 基路径 (base path)。

## Use Cases

在真实的应用程序的一些使用情形中这个特色变得特别灵巧。本质上来说，发出至你 `output.path` 目录的文件将被从 `output.publicPath` 位置引用。这包括 child chunks (通过 [code splitting](/guides/code-splitting/)) 和其他属于你依赖图表的 assets (如，图像，字体等)。//那怎样引用 assets

# Environment Based

在开发环境中，我们的 `assets/` 目录可能和首页同级。这很好，但是如我们想要在生产中将所有的静态资源放在 CDN 上呢？

要解决这个问题，你可以轻易地使用一个老的环境变量。假设我们有一个 `ASSET_PATH` 变量：

```js
import webpack from 'webpack';

// Try the environment variable, otherwise use root
const ASSET_PATH = process.env.ASSET_PATH || '/';

export default {
    output: {
        publicPath: ASSET_PATH
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
        })      
    ]
};
```

## On The Fly

另一种可能的使用情形是在运行中设置 `publicPath`. webpack 暴露了一个叫 `__webpack_public_path__` 的全局变量使得你可以这样做。所以在你应用程序的每个入口点，你只需这样做：

```js
__webpack_public_path__ ==  process.env.ASSET_PATH;
```

这就需要你做的。因为我们已经在配置中使用了 `DefinePlugin`, `process.env.ASSET_PATH` 将总是有定义，所以可以放心地这样做。

注意如果入口文件中如果你使用 ES6 模块引入, `__webpack_public_path__` 赋值将会在 imports 之后完成。你要将公共路径赋值移到专用的模块中然后在你的 entry.js 中的顶部引入：

```js
//entry.js
import './public-path';
import './app';
```