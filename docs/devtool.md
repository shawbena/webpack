# devtool

这个选项控制怎样生成 source maps.

更精细的配置控制请使用 [sourcemapDevToolPlugin](/plugins/source-map-dev-tool-plugin)。[source-map-loader](/loaders/source-map-loader) 处理现有的 source maps.

## devtool

`string`  `false`

选择 [source mapping](http://blog.teamtreehouse.com/introduction-source-maps) 来增强调试过程。这些值可以显著地影响构建和重构速度。

webpack 仓库包含一个 [example showing the effect of all `devtool` variants](https://github.com/webpack/webpack/tree/master/examples/source-map) 这些例了将有助于你理解区别。

除了 `devtool` 选项你也可以直接使用 `SourceMapDevToolPlugin` / `EvalSourceMapDevToolPlugin` 因为他有更多的选项。不要将 `devtool` 选项和 plugin 一起使用。`devtool` 选项在内部添加插件所以你不要再次应用插件。

| devtool                        | build | rebuild | production | quality                       |
| ------------------------------ | ----- | ------- | ---------- | :---------------------------- |
| (none)                         | +++   | +++     | no         | bundled code                  |
| eval                           | +++   | +++     | no         | generated code                |
| cheap-eval-source-map          | +     | ++      | no         | transformed code (lines only) |
| cheap-module-eval-source-map   | o     | ++      | no         | original source (lines only)  |
| eval-source-map                | --    | +       | no         | original source               |
| cheap-source-map               | +     | o       | no         | transformed code (lines only) |
| cheap-module-source-map        | o     | -       | no         | original source (lines only)  |
| inline-cheap-source-map        | +     | o       | no         | transformed code (lines only) |
| inline-cheap-module-source-map | o     | -       | no         | original source (lines only)  |
| source-map                     | --    | --      | yes        | original source               |
| inline-source-map              | --    | --      | no         | original source               |
| hidden-source-map              | --    | --      | yes        | original source               |
| nosources-source-map           | --    | --      | yes        | without source content        |

T> `+++` super fast, `++` fast, `+` pretty fast, `o` medium, `-` pretty slow, `--` slow

一些值适合开发，一些适合生产。开发时你通常想要更快的 Source Maps 而牺牲了 bundle size, 生产时你想要独立的且支持最小化的 Source Maps.

见 [output.sourceMapFilename](/configuration/output#output-sourcemapfilename) 自定义生成的 Source Maps 文件名。

## Qualities

## Development


