# output

## output.chunkFilename

`string`

此选项定义非入口点块文件。见 [output.filename](#output.filename) 选项关于可能的值的详细信息。

注意文件名需要在运行时生成以发送对块的请求。因此像 `[name]` 和 `[chunkhash]` 这样的占位符需要用 webpack 添加从块 id 至占们符值至输出块的映射。这会增加大小当用于块的占位符变化时可能使块无效。

默认, 使用 `[id].js` 或从 [output.filename](#output.filename) 推断来的值 (`[name]` 被 `[id]` 替换或前面加 `[id].`).

## output.filename

`string`

此选项决定每个输出块的名称。块被写至 [output.path](#output.path) 指定的目录。

对于单个 [entry](../entry-context#entry), 可以是静态的名称。

```js
name: "bundle.js"
```

然而，当通过不止一个入口点，代码分割或各种插件创建多个块时，你应该使用以下部分之一给每个块独一无二的名称...

使用入口名：

```js
filename: "[name].bundle.js"
```

使用内部块 id:

```js
filename: "[id].bundle.js"
```

使用每个构建生成的唯一的 hash:

```js
filename: "[name].[hash].bundle.js"
```

使用基于每个块内容的 hashes:

```js
filename: "[chunkhash].bundle.js"
```

请读读 [Caching guid](/guides/caching), 设置这个选项涉及到很多步骤。

注意这个选项叫文件名，但仍然允许你做 `"js/[name]/bundle.js"` 来创建文件夹结构。

注意此选项不影响按需加载的块的输出文件。这些文件用 [output.chunkFilename](output.chunkFilename) 选项. 他也不影响 loaders 创建的文件。这些文件见 loder 选项。

以下置换可用于模板字符串 (通过 webpack 内部的 [TemplatedPathPlugin](https://github.com/webpack/webpack/blob/master/lib/TemplatedPathPlugin.js))。

| Template       | Description                                      |
| -------------- | ------------------------------------------------ |
| [hash]         | The hash of the module identifier                |
| [chunkhash]    | The hash of the chunk content                    |
| [name]         | The module name                                  |
| [id]           | The module identifier                            |
| [query]        | The module query, i.e., the string following `?` in the filename |

当使用 [ExtractTextWebpackPlugin](/plugins/extract-text-webpack-plugin) 时，使用 `[contenthash]` 来获得提取文件的 hash (neither `[hash]` nor `[chunkhash]` work).

## output.path

`string`

绝对路径的输出目录。

```js
path: path.resolve(__dirname, 'dist/assets')
```

注意些参数中的 `[hash]` 将被编译的 hash 替换。详见 [Caching guid](/guides/caching). //？

## output.pathinfo

`boolean`

告诉 webpack 把包含模块的信息注释到 bundles 中。些选项默认是 `false` 且不应该用在生产中，但在开发中当读生成的代码时非常有用。

```js
pathinfo: true
```

Note it also adds some info about tree shaking to the generated bundle.

## output.publicPath

`string`

这是个重要的选项，当你按需加载或加载外部资源如图像，文件等等。如果指定了不正确的值那加载这些文件时会收到 404 错误。

。。。

## output.sourceMapFilename

`string`

仅当 [devtool](/configuration/devtool) 使用写输出文件的 SourceMap 选项时使用此选项。

配置如何命名 source maps. 默认使用 `"[file].map"`.

可以用来自 [output-filename](#output.filename) 的 `[name]`, `[id]`, `[hash]`, 和 `[chunkhash]`代替。除了这些，你也可以用下面列出的代替项。`[file]` 占位符用源文件的文件名替换。我们建议*只使用 `[file]` 占位符*，因为其他占位符对 non-chunk 文件不起作用。

| Template   | Description                  |
| [file]     | The module filename          |
| [filebase] | The module [basename](https://nodejs.org/api/path.html#path_path_basename_path_ext) |

## outputs.sourcePrefix

`string`

改变输出 bundles 中每行的前缀。

```js
sourcePrefix: "\t"
```

注意默认使用空字符串。使用某种缩写使 bundles 看起来更美观，但对多行字符串会造成问题。

不需要改变此选项。

### output.umdNamedDefine

`boolean`

当使用 `libraryTarget: "umd"`, 设置：

```js
umdNamedDefine: true
```

将命名 AMD 模块 UMD 构建。否则使用匿名的 `define`。 //?

## output.library

`string`

`string` 或 `Object` (从 webpack 3.1.0 开始；用于 `libraryTarget: "umd"`)

`output.library` 的值怎么使用取决于 [output.libraryTarget](#output.libraryTarget) 选项，请读读那章节的完整细节。注意默认的 [output.libraryTarget](#output.libraryTarget) 是 `var`，所以如果使用以下配置：

```js
output: {
    library: "MyLibrary"
}
```

`MyLibrary` 将绑定你入口文件的返回值，如果结果输出被加进了 HTML 页面的 script 标签。

读下 [authoring libraries guid](/guides/author-libraries) 及 `output.libraryTarget` 更多关于 `output.library` 的信息。

## output.libraryExport

`string` 或 `string[]` (从 webpack 3.0.0 开始)

> 默认 `_entry_return`

配置哪个模志或哪些模块将通过 `libraryTarget` 输出。

默认值 `_entry_return` 是你入口文件返回的名称空间或默认模块。
...

## output.libraryTarget

`string`

> 默认 `"var"`

配置如何暴露库。可能以使用以下的任何一个选项。注意这这选项和赋给 [output.library](#output-library) 一同工作。以下示例我们假设这个值配置为 `MyLibrary`.

注意下面示例代码中的 `entry_return_` 是入口点返回的值。在 bundle 本身中，他是由 webpack 从入口点生成的输出函数。//入口点怎么返回值？？, 应该与 module.exports, exports 有关，毕竟 webpack 采用的是 CommonJS 的模块, es6 模块语法也可以，因为 wepback 也支持 es6 模块，CommonJS 模块的输出也可以

### Expose a Variable

这个选项将入口点 (如，无论入口点输出什么) 返回的值赋给 `output.library` 提供的命名。

`libraryTarget: "var"` - (default) 当你的库加载时，你入口点的返回值将赋值给一个变量：

```js
var MyLibrary = _entry_return_;

// In a separate script...
MyLibrary.doSomething();
```

当使用这个选项时，一个空的 `output.library` 将会造成无赋值。

`libraryTarget: "assign"` - 这将生成一个暗示的全局变量，可能给现有的值重新赋值 (使用时注意)：

```js
MyLibrary = _entry_return_;
```

当使用这个选项时，空的 `output.library` 将会造成破坏的输出 bundle.

### Expose Via Object Assignment

这个选项赋值入口点 (e.g. whatever the entry point exported) 的返回值以 `output.library` 定义的名称下的特定对象。

如果 `output.library` 没有赋予非空字符串，默认的行为是入口点返的所有属性将赋给为 `output.libraryTarget` 定义的对象。

`libraryTarget: "this"` - 你入口点的返回值将赋给 this 下 `output.library` 命名的属性。`this` 的含义取决于你：

```js
this["MyLibrary"] = _entry_return_;

//In a separate script
this.MyLibrary = doSomething();
MyLibrary.doSomething(); // if this is window
```

`LibraryTarget: "window"` - 你入口点的返回值将赋给 `window` 对象下的 `output.library` 值。

```js
window["MyLibrary"] = _entry_return_;

window.MyLibrary.doSomething();
```

`libraryTarget: "global"` - 你入口点的返回值将赋值给 `global` 下的 `output.library` 值。

```js
global["MyLibrary"] = _entry_return_;

global.MyLibrary.doSomething();
```

`libraryTarget: "commonjs"` - 你入口点的返回值将被赋给 `exports` 对象下的 `output.library` 的值。正如其名称那样，这用于 CommonJS 环境中。 // 用 es6 的模块语法可以被 wepback 打包成 CommonJS 模块。

```js
exports["MyLibrary"] = _entry_return_;

require("MyLibrary").doSomething();
```

### Module Definition Systems

这些选项的结果 bundle 会有更完整的头部以保证兼容各种模块系统。在以下 `output.libraryTarget` 选项睛 `output.library` 选项将有不同的含义。

`libraryTarget: "commonjs2"` - 你入口点的返回值将被赋值给 `module.exports`. 正如其名所暗示，这用于 CommonJS 环境： // 和 Export via Object Assign 中的 commonjs 选项的输出的变量结构不一样。前者是输出到 output.library 值命名的变量下

```js
module.exports = _entry_return_;

require("MyLibrary").doSomething();
```

注意 `output.library` 被忽略掉了，此特殊的 `output.libraryTarget` 不需要这个值。

好奇 CommonJS 和 CommonJS2 的区别？然而他们很相似，他们之前有一些细微的区别在 webpack 的语境中通常不相关。(详情[读此](https://github.com/webpack/webpack/issues/1114))

`libraryTarget: "amd"` - 这将会使你的库暴露为 AMD 模块。AMD 模块要求每个 chunk 以特殊的属性定义，如 `define` 和 `require`, 这些通常由  RequirJS 或其他兼容的加载器提供 (如 almond)。否则加载会造成 AMD bundle 直接造成错误如 `define is not defined`.

所以，以以下配置...

```js
output: {
    library: 'MyLibrary',
    libraryTarget: 'amd'
}
```

将生成名为 "MyLibrary" 的输出，i.e.

```js
//?
define("MyLibrary", [], function() {
  // This module return value is what your entry chunk returns
});
```

这个 bundle 可以引为 script 标符的一部分，这个 bundle 可以像这样调用：

```js
require(['MyLibrary'], function(MyLibrary) {
  // Do something with the library...
});
```

如果 `output.library` 是 undefined, 会生成以下代友：

```js
define([], function(){
    // This module returns is what your entry chunk returns
});
```

`libraryTarget: "umd"` - 这将你的库暴露在所有的模块定义下，使他可用于 CommonJS, AMD 或全局变量。看一下 [UMD Reposity](https://github.com/umdjs/umd) 详细了解一下。

这种情形你需要一用 `library` 属性来命名你的模块：

```js
output: {
    library: 'MyLibrary',
    libraryTarget: 'umd'
}
```

最终的输出是：

```js
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    exports["MyLibrary"] = factory();
  else
    root["MyLibrary"] = factory();
})(this, function() {
  //what this module returns is what your entry chunk returns
});
```

注意，忽略 `library` 将导至入口点返回的所有属性赋值给根 root 对象，[object assignment section](#exposing-the-library-via-object-assignment) 有描述。如：

```js
output: {
  libraryTarget: "umd"
}
```

输出会是：

```js
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else {
    var a = factory();
    for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
  }
})(this, function() {
  //what this module returns is what your entry chunk returns
});
```

从 webpack 3.1.0 开始，你可以为 `library` 指定一个对象以对不同的目标命名：

```js
output: {
    library: {
        root: 'MyLibrary',
        amd: 'my-library',
        commonjs: 'my-common-library'
    },
    libraryTarget: 'umd'
}
```

## Other Targets

...

你库的依赖将由 [externals](/configuration/externals) 定义。

