# Module

这个选项决定如何对待项目中不同类型的[模块](/concepts/modules)。

## module.noParse

`[RegExp]|[RegExp]`

`RegExp|[RegExp]|function (webpack 3.0.0 开始)`

防止 webpack 解析给定正则表达式的文件。// 怎么不解析

忽略的文件不应调用 `import`, `require` `define` 或任何其他引入机制。当忽略大类库时这会增加构建性能。

```js
noParse: /jquery|lodash/

// since webpack 3.0.0
noParse: function(content){
    return /jquery|lodash/.test(content);
}
```

## module.rules

`array` [Rule](#rule) 数组，当模块创建时匹配请求。这些规则可修改如何创建模块。也可以对模块应用 loader, 或修改解析器 (parser)。

## Rule

一个规则可分为三部分 —— 条件，结果和嵌套规则。

### Rule Conditions

1. 资源 (the resource): 请求的文件的绝对路径。已经根据解析规则 ([`resolve` rules](/configuration/resolve)) 解析。

2. 发起者 (issuer): 请求资源的文件模块的绝对路径。引入路径。

例如：当在 `app.js` 中引入 `import './style.css'` 时，资源是 `/path/to/style.css` 发起者是 `/path/to/app.js`.

在规则中 [`test`](#rule-test), [`include`](#rule-include), [`exclude`](#rule-exclude) 和 [resource](#rule-resource) 匹配资源，[`issuer`](#rule-issuer) 匹配发起者。

当使用多个条件时，所有条件必须匹配。

注意！资源是解析 (resolved) 文件路径，这意味着符号链接的 (symlinked) 资源是真实路径面非符号链接的位置。当使用符号链接的包 (如 `npm linke`)时，记住这一点是很好的，常见如 `/node_modules/` 这样的条件可能无意地漏过符号链接的文件。

### Nested rules

可在属性 [rules](#rule-rules) 和 [oneOf](#rule-oneof) 下指定嵌套规则。

当 Rule condition 匹配时计算这些规则。

### `Rule.enforce`

可能的值是：`"pre" | "post"`

指定 loader 的类别。不指定值意味着正常的 loader. //?

也有一个额外的类别 "inline loader" 是应用到内联 import/require 的 loaders.

所有的 loaders 按 `pre`, `inline`, `normal`, `post` 排序并以此顺序使用。

所有正常的 loader 可前缀请示 `!` 被忽略 (覆盖)。 // 为什么要忽略 loader?

所有 normal 和 pre 的 loader 可以在请求中前缀 `-!` 来忽略 (覆盖)。

所有 normal, post 和 pre loader 可以在请求中前缀 `!!` 来忽略。

不应该使用内联 loader 和 `!` 前缀，因为他们是非正式的。They may be use by loader generated code. //..

### `Rule.exclude`

`Rule.exclude` 是 `Rule.resource.exclude` 是快捷方式。如果你提供了 `Rule.exclude` 选项，你不能也提供 `Rule.resource`. 详见 [Rule.resource](#rule-resource) 和 [Condition.exclude](#condition).

### `Rule.include`

`Rule.include` 是 `Rule.resource.include` 的快捷方式。如果你提供了 `Rule.include` 选项，你不能也提供 `Rule.resource`.详见 [Rule.resource](#rule-resource) 和 [Condition.exclude](#condition). 

### `Rule.issuer`

匹配发起请求的模块的 [Condition](#condition). 下面例子中，请求 `a.js` 的 `issuer` 便是 `index.js` 文件的路径。

__index.js__

```js
import A from './a.js';
```

此选项可用于应用 loader 到特定模块或模块集的依赖。

### `Rule.loader`

`Rule.loader` 是 `Rule.use: [{ loader }]` 的快捷方式。详见 [Rule.use](#rule.use) 和 [UseEntry.loader](#useentry).

### `Rule.loaders`

为了支持 `Rule.use` 这个选项被废弃了。

`Rule.loaders` 是 `Rule.use` 的别名。详见 [Rule.use](#rule-use).

### `Rule.oneOf`

[Rules](#rule) 数组，当规则匹配时只用第一个匹配的规则。

```js
{
    test: /.css$/,
    oneOf: [{
        resourceQuery: /inline/, // foo.css?inline
        use: 'url-loader'
    },{
        resourceQuery: /external/, // foo.css?external
        use: 'file-loader'
    }]
}
```

### `Rule.options / Rule.query`

`Rule.options` 和 `Rule.query` 是 `Rule.use: [{ options }]` 的快捷方式。详见 [Rule.use](#rule-use) 和 [UseEntry.options](#userentry).

为了支持 `Rule.options` 及 `UseEntry.options`, `Rule.query` 被废弃了。

### `Rule.parser`

一个有 parser 选项的对象。所有应用的 parser 选项都被合并。

Parsers 可能视察这些选项并相应地禁用或重新配置自已。大多默认插件如下解释这些值：

- 设置此选项为 `false` 禁用 parser.

- 设置此选项为 `true` 或留为 `undefined` 启用 parser.

而，parser plugins 可能接收不仅仅是 boolean. 如，内部的 `NodeStuffPlugin` 可接受一个对象而非 `true` 来为特定规则添加选项。

__Examples__ (parser options by the default plugins)

```js
parser: {
    amd: false, // disable AMD
    commonjs: false, // disable CommonJS
    system: false, // disable SystemJS
    harmony: false, // disable ES2015 Harmony import/export
    requireInclude: false, // disable require.include
    requireEnsure: false, // disable require.ensure
    requireContext: false, // disable require.context
    browserify: false, // disable special handling of Browserify bundles
    requireJs: false, // disable requirejs.*
    node: false, // disable __dirname, __filename, module ,require.extensions, require.main, etc
    node: {...} // reconfigure [node](/configuration/node) layer on module level
}
```

### `Rule.resource`

匹配资源的 [Condition](#condition). 你既可提供 `Rule.resource` 选项也可用 `Rule.use`, `Rule.exclude`, `Rule.include` 快捷方式。详见 [`Rule` conditions](#rule-conditions).

### `Rule.resourceQuery`

匹配 resource query 的 [Condition](#condition). 此选项用于测试请求字符串的 query 部分 (如 从问号标记开始)。如果你使用 `import Foo from './foo.css?inline'` 以下的条件将会匹配：

```js
{
    test: /.css$/,
    resourceQuery: /inline/,
    use: 'url-loader'
}
```

### `Rule.rules`

[Rules](#rule) 数组, 当 Rule 匹配时也会使用。// 没见哪里用过

### `Rule.test`

`Rule.test` 是 `Rule.resource.test` 的快捷方式。如果提供了 `Rule.test` 你不应也提供 `Rule.resource`. 详见 [Rule.resource](#rule.resource) 及 [Condition.test](#condition).

### `Rule.use`

应用到模块的 [UseEntry](#useentry) 列表。每条 (entry) 指定要使用的一个 loader.

转换一个字符串 (i.e. `use: [ 'style-loader' ]`)是加载属性 (i.e. `use[{ loader: 'style-loader' }]`) 的捷方式。

可传递多个 loader 将 loader 链起来，将从右至左应用 loader (last to first configured).

```js
use: [ 'style-loader', {
    loader: 'css-loader',
    options: {
        importLoaders: 1
    }
},{
    loader: 'less-loader',
    options: {
        noIeCompat: true
    }
}]
```

详见 [UseEntry](#useentry).

## `Condition`

Condition 可以是以下之一：

- 一个字符串：要区配，输出必须以提供的字符串开头。如一个目录路径，或绝对的文件路径。

- 一个正则：用于测试输入。

- 一个函数：调之以输入且须返回真值以匹配。

- 一个条件数组：至少有一个条件必须匹配。

- 一个对像：所有属性必须匹配。每个属性有定义的行为。

`{ test: Condition }`: 条件必须匹配。习惯上这里提供一个正则或正则数组，但不强制。

`{ include: Condition }`: 条件必须匹配。习惯上这里提供一个字符串或字符串数组，但不强制。

`{ exclude: Condition }`: 条件必须不匹配。习惯上这里提供一个字符串或字符串数组，但不强制。

`{ and: [Condition] }`: 所有条件必须匹配。

`{ or: [Condition] }`: 所有条件必须匹配。

`{ or: [Condition]}`: 所有条件必须匹配。

__Example__

```js
{
    test: /\.css$/,
    include: [
        path.resolve(__dirname, 'app/styles'),
        path.resolve(__dirname, 'vendor/styles')
    ]
}
``` 

## `UseEntry`

`object`

必须要有一个字符串类型的 `loader` 属性。他以相对于配置 [context](/configuration/entry-context#context) 以 loader 解析选项 ([resolveLoader](/configuration/resolve#resolveloader)) 进行解析。

他可以有一个字符串或对象类型的 `options` 属性。这个值传递给 loader 应该作为 loader 选项解释他。

为了兼容性，也可以有一个 `query` 属性，其是 `options` 的别名。使用 `options` 属性而非此属性。

__Example__

```js
{
    loader: 'css-loader',
    options: {
        modules: true
    }
}
```

注意 webpack 需要从资源和所有 loader 包括选项中生成一个独一无二的模块标识符。他尝试对 options 选项进程 `JSON.stringify`. 在 99.9% 的情形下是 ok 的，但如果你对资源应用了同样的 loader 不同的选项并且选项有字符串化的值时可能便不是独一无二的了。

如果选项对象不能字符串化 (i.e. circular JSON) 也会失败。因此你可以在选项中用 `ident` 属性作为独一无二的标识符。

## Module Contexts

> 避免使用这些选项，因为他们被废弃了且不久将被移除。

这些选项描述当遇到动态依赖时创建的语境的默认设置。

`unknown` 动态依赖的示例: `require`.

`expr` 动态依赖的示例: `require(expr)`.

`wrapped` 动态依赖的示例: `require('./templates/' + expr)`.

这里时有[默认值](https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsDefaulter.js)的可用的选项。

```js
{
    exprContextCritical: true,
    exprContextRecusive: true,
    exprContextRegExp: false,
    exprContextRequest: '',
    unknownContextCritical: true,
    unknownContextRecursive: true,
    unknownContextRegExp: false,
    unknownContextRequest: '.',
    wrappedContextCritical: false,
    wrappedContextRecusive: true,
    wrappedContextRegExp: /.*/,
    strictExportPresence: false // since webpack 2.3.0
}
```

你也可以用 `ContextReplacementPlugin` 来修改这些值用于单独依赖。这也移除警告。

几个使用情形：

- 警告动态依赖：`wrappedContextCritical: true`.

- `require(expr)` 应该包括整个目录: `exprContextRegExp: /^\.\//`

- `require('./templates/' + expr)` 不应该包括子目录，默认: `wrappedContextRecursive: false`

- `strictExportPresence` 使 missing exports 为错误面非警告