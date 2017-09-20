# Module Resolution

解析器是一个库，用于通过模块的绝对路径来定位模块。一个模块可以成为另一个模块需要的依赖。

```js
import foo from 'path/to/module';
//or
require('path/to/module');
```

依赖模块可以来自应用代码或第三方库。解析器帮助 webpack 找到诸如每个 `require/import` 语要进打包的模块代码。当打包模块时 webpack 使用 [enhanced-resolve](https://github.com/webpack/enhanced-resolve) 文件路径。

## Resolving ruels in webpack

使用 `enchanced-resolve`, webpack 可以解析三种文件路径：

`Absolute paths`

```js
import "/home/me/file";
import "C:\\Users\\me\\file";
```

我们已经有到文件的绝对路径，不需要深入解析。

`Relative paths`

```js
import "../src/file1";
import "./file2";
```

这种情形 `import` 或 `require` 出现地方的资源文件的目录取为上下文目录。`import/require` 中指定的相对路径合并入上下文路径生成至模块的绝对路径。

`Module paths`

```js
import "modules";
import "module/lib/file";
```

模块在 [resolve.module](https://webpack.js.org/configuration/resolve/#resolve-modules) 指定的目录中搜索。你可以用 [resolve.alias](https://webpack.js.org/configuration/resolve/#resolve-alias) 配置选项创建一个原始路径的别名，用可选路径替换原始路径。

一旦路径基于以上路径被解析到了，解析器便去核实路径是否指向一个文件或目录。如果路径指向一个文件：

* 如果路径有文件扩展名，那么直接打包文件。

* 否则基于 [resolve.extensions](https://webpack.js.org/configuration/resolve/#resolve-extensions) 选项解析文件扩展名, 告诉解析器哪些扩展名 (如 `.js`, `.jsx`) 可接受解析。

如果路径指向一个文件夹，会采取以下步骤找到有正确扩展名的正确文件：

* 如果文件夹中包含一个 `package.json` 文件，将会按顺序查找 [resolve.mainFields](https://webpack.js.org/configuration/resolve/#resolve-mainfields) 配置选项中指定的字段，`package.json` 中这样的字段决定文件路径。

* 如果没有 `package.json` 或 main field 没有返回有效的路径，将会查找 [resolve.mainFiles](https://webpack.js.org/configuration/resolve/#resolve-mainfiles) 中指定的文件名，查看 imported/required 目录中是否存在匹配的文件名。

* 文件扩展名将会使用 `resolve.extensions` 选项以同样的方式解析。

webpack 提供的这些选项的 [defalut](https://webpack.js.org/configuration/resolve) 决于你构建的 target.

## Resolving Loaders

这个遵循用于文件解析同样的规则。但是 [resolveLoader]() 配置选项可用作用于 loaders 的独立的解析规则。

## Caching

访问的每个文件系统都被缓存，所以多个并行或或连续的对同一文件的访问会很快。在 [watch mode](https://webpack.js.org/configuration/watch/#watch) 中，只有修改的文件会从缓存中驱逐。如果 watch 模式关闭，在每次编译前都会清除缓存。

见 [Resolve API](https://webpack.js.org/configuration/resolve) 学习更多上面提到的配置选项。