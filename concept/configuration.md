# configuration

你可能注意到了一些 webpack 配置文件看起来很相似。这是因为 webpack 配置文件是一个输出一个对象的 JavaScript 文件。稍后 webpack 基于这个对象的属性处理他。

因为配置文件是一个标准的 Node.js CommonJS 模块，你可以做以下事情：

- 引入其他文件通过 `require(...)`

- 通过 npm 上的工具通过 `require(...)`

- 使用 JavaScript 控制流程语法，如 `?:` 操作符

- 对经常使用的值使用常量或变量

- 写和执行函数来生成部分配置

适时使用这些特色。

虽然技术上可行的，但以下实践应该避免：

- 访问 CLI 参数，当使用 webpack CLI 时 (而是应该写你自己的 CLI, 或使用 [--env](/configuration/configuration-types/))

- 输出不确定的值 (二次调用 webpack 应该生成同样的输出文件)

- 写长的配置 (而是将配置分割成多个文件

你从这篇文章学到的最重要的一点是，有很多不同的方式格式或设计 (style) 你的 webpack 配置。关键是坚持你和你团队能理解且可维护的东西。

以下配置描述 webpack 配置文件怎么既具表达性又因其代码具有可配置性：

## The Simple Configuration

__webpack.config.js__

```js
var path = require('path');

module.exports = {
    entry: './foo.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'foo.bundle.js'
    }
};
```

## Multiple Targets

见 [Exporting multiple configurations](/configuration/configuration-types/#exporting-multiple-configurations)

## Using other Configuration Languages

webpack 接受用多种编程语言和数据语言写的配置文件。

见 [Configuration Languages](/configuration/configuration-languages/)