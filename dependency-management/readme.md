# dependency-management

> es6 modules

> commonjs

> amd

## require with expression

如果你的请求包含表达式会创建上下文，所以大编译时不能确定精确的模块。

例如：

```js
require('./template/' + name + '.ejs');
```

webpack parses

webpack 转换 `require()` 调用并抽取一些信息：

```js
Directory: ./template
Regular expression: /^.*\.ejs$/
```

__context module__

生成一个上下文模块。他包含那个目录中匹配正则表达式的可能被请求的所有模块的引用。上下文模块中包含转换请求至模块 id 的映射。

例如：

```js
{
    "./table.ejs": 42,
    "./table-row.ejs": 43,
    "./directory/folder.ejs": 44
}
```

这个上下文模块也包括运行时访问 map 的逻辑。

这意味着支持动态请求，但将会造成所有可能的模块都被包括的 bundle 中。

## `require.context`

你可以用 `require.context()` 函数创建你自己的上下文。

他允许你传递要搜索的目录，是否要搜索子目录的标志，及匹配文件的正则表达式。

webpack 在构建时转换代码中的 `require.context()`.

语法如下：

```js
require.context(directory, useSubdirectories = false, regExp = /^\.\//);
```

例子：

```js
require.context('./test', false, /\.test\.js$/);
// a context with files from the test directory that can be required with a request endings with `.test.js`.
```

```js
require.context('../', true, /\.stories\.js$/);
// a context with all files in the parent folder and descending folders eding with `.stories.js`.
```

传递给 `require.context` 的参数必须是字面量！

## context module API

...