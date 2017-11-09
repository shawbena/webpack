# targets

因为 JavaScript 既可用于服务端也可用于浏览器，webpack 可提供多个布署目标，你可以在你的 webpack [configuration](/configuration) 中设置。

不要把 webpack 的 `target` 属性与 `output.libraryTarget` 属性混淆了。

## Usage

要设置 `target` 属性，你只要在 webpack 配置中设置 target 的值：

__webpack.config.js__

```js
module.exports = {
    target: 'node'
};
```

## Multiple Targets

## Resources