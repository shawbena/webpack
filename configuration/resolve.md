# resolve

这个选项更改如何解析模块。webpack 提供合理的默认值，但也可以更改解析细节。

看下 [Module Resolution](/concepts/module-resolution) 关于解析器如何工作的详细细节。

## `resolve`

`object`

配置如何解析模块。例如当以 ES2015 调用 `import "lodash"` 时，`resolve` 可以更改 webpack 去哪里查找 `"lodash"` (见 [modules](#resolve-modules)).

### `resolve.alias`

`object`

创建别名，`import` 或 `require` 特定模块更容易。如给常用的 `src/` 目录分支创建别名：

```js
alias: {
    Utilities: path.resolve(__dirname, 'src/utilities/')
    Templates: path.resolve(__dirname, 'src/templates/')
}
```

现在你可以这样做了：

```js
import Utility from 'Utilities/utility';
```

而非：

```js
import Utility from '../../utilities/utility';
```

可以给给定对像的链尾加 `$` 表示精确匹配：

```js
alias: {
    xyz$: path.resolve(__dirname, 'path/to/file.js')
}
```

这会生成以下结果：

```js
import Test1 form 'xyz';    //精确匹配，所以 path/to/file.js 被解析并被引入
import Test2 from 'xyz/file.js'; // 不是精确匹配，正常解析
```

下面的表解释其他情形：

| `alias:`                           | `import "xyz"`                        | `import "xyz/file.js"`              |
| ---------------------------------- | ------------------------------------- | ----------------------------------- |
| `{}`                               | `/abc/node_modules/xyz/index.js`      | `/abc/node_modules/xyz/file.js`     |
| `{ xyz: "/abs/path/to/file.js" }`  | `/abs/path/to/file.js`                | error                               |
| `{ xyz$: "/abs/path/to/file.js" }` | `/abs/path/to/file.js`                | `/abc/node_modules/xyz/file.js`     |
| `{ xyz: "./dir/file.js" }`         | `/abc/dir/file.js`                    | error                               |
| `{ xyz$: "./dir/file.js" }`        | `/abc/dir/file.js`                    | `/abc/node_modules/xyz/file.js`     |
| `{ xyz: "/some/dir" }`             | `/some/dir/index.js`                  | `/some/dir/file.js`                 |
| `{ xyz$: "/some/dir" }`            | `/some/dir/index.js`                  | `/abc/node_modules/xyz/file.js`     |
| `{ xyz: "./dir" }`                 | `/abc/dir/index.js`                   | `/abc/dir/file.js`                  |
| `{ xyz: "modu" }`                  | `/abc/node_modules/modu/index.js`     | `/abc/node_modules/modu/file.js`    |
| `{ xyz$: "modu" }`                 | `/abc/node_modules/modu/index.js`     | `/abc/node_modules/xyz/file.js`     |
| `{ xyz: "modu/some/file.js" }`     | `/abc/node_modules/modu/some/file.js` | error                               |
| `{ xyz: "modu/dir" }`              | `/abc/node_modules/modu/dir/index.js` | `/abc/node_modules/dir/file.js`     |
| `{ xyz: "xyz/dir" }`               | `/abc/node_modules/xyz/dir/index.js`  | `/abc/node_modules/xyz/dir/file.js` |
| `{ xyz$: "xyz/dir" }`              | `/abc/node_modules/xyz/dir/index.js`  | `/abc/node_modules/xyz/file.js`     |

如果 `package.json` 中有定义那 `index.js` 可能解析成另外的文件。

`/abc/node_modules` 也可能解析在 `/node_modules` 中。

指定一个字段如 `browser`, 根据 [this specification](https://github.com/defunctzombie/package-browser-field-spec) 转换。
默认：

```js
aliasFields: ['browser']
```

## `resolve.cashWithContext`

`boolean` (从 webpack 3.1.0) 开始

## `resolve.descriptionFiles`

`array`

用于描述的 JSON 文件，默认：

```js
descriptionFiles: ["package.json"]
```

## `resolve.enforceExtension`

`boolean`

如果 `true`, 将不允许没有扩展的文件。所以默认如果 `./foo` 有 `.js` 扩展 `require('./foo')` 将会起作用，但启用了这个选项，只有 `require('./foo.js')` 可以工作。默认：

```js
enforceExtension: false
```

## `resolve.enforceModuleExtension`

`boolean`

是否需要模块 (如，loaders) 的扩展名, 默认：

```js
enforceModuleExtension: false
```

## `resolve.extensions`

`array`

自动解析特写的扩展。默认值是：

```js
extensions: ['.js', '.json']
```

这使得用户可以去掉引入时的扩展：

```js
import File from '../path/to/file';
```

使用这个将覆盖默认的数组，意味着 webpack 将不再尝试用默认的扩展解析模块了。当引入带扩展名的模块时，如： `import SomeFile from './somefile.ext'`, 要正确解析，这个数组中必须有一个包含 "*" 的字符串。

## `resolve.mainFields`

`array`

当从 npm 包引入时，如 `import * as D3 from 'd3'`, 这个选项将决定检查 `package.json` 中的哪个字段。默认值其于你 webpack 配置文件的 [target](/concepts/targets) 变化。

当 `target` 属性被设为 `webworker`, `web`, 或未设置：

```js
mainFields: ['browser', 'module', 'main']
```

对于其他目标 (包括 `node`):

```js
mainFields: ['node', 'main']
```

如，[D3](https://d3js.org) 包含这些字段：

```json
    ...
    main: 'build/d3.Node.js',
    browser: 'build/d3.js',
    module: 'index'
    ...
```

这意味着当我们 `import * as D3 from "d3'` 时，将解析 `browser` 属性中的文件。这里 `browser` 属性优先级高，因为他是 `mainFields` 中的第一个字段。而，一个 Node.js 应用的 bundle, webpack 将会解析 `module` 字段的文件。

## `resolve.mainFiles`

`array`

解析目录时使用的文件名。默认：

```js
mainFiles: ['index']
```

## `resolve.modules`

`array`

告诉 webpack 当解析目录时应去哪里查找。

绝对路径和相对路径都可以，但他们的行为有点不同。

相对路径将会像似 Node 扫描 `node_modules` 那样，查找当前目录及其祖先 (如 `./node_modules`, `./node_modules`, 等等)。

绝对路径，将只搜索给定目录。

`resolve.modules` 默认为：

```js
modules: ['node_modules']
```

如果你想添加一个比 `node_modules/` 优先级高的搜索目录:

```js
modules: [path.resolve(__dirname, 'src'), 'node_modules']
```

## `resolve.unsafeCache`

## `resolve.plugins`

将被应用的其他解析插件列表。他允许如 [DirectoryNamedWebpackPlugin](https://www.npmjs.com/package/directory-named-webpack-plugin)

```js
plugins: [new DirectoryNamedWebpackPlugin()]
```

## `resolve.symlinks`

`boolean`

是否解析链接至链接的位置。默认：

```js
symlinks: true
```

## `resolve.cachePredicate`

## `resolveLoader`

`object`

等同于 `resolve` 属性的选项集合，但仅用于解析 webpack 的 [loader](/concepts/loader) 包。默认：

```js
{
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main']
}
```

这城你可以使用别名和其他上面熟悉的特色。如 `{txt: 'raw-loader'}` 会调整 `txt!/templates/demo.txt` 使用 `raw-loader`

## `resolveLoader.moduleExtensions`

`array`

解析模块 (如 loaders) 时尝试用的扩展。默认是空字符串。

如果你想使用 loaders 而不使用 `-loader` 后缀，你可以使用：

```js
moduleExtensions: ['-loader']
```