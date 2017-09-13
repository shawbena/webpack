# Output Management

目前我们手动地在 `index.html` 上文件中引入我人们的 asserts, 但是是随着我们的应用程序成长且一旦你[在文件名中用哈希](https://webpack.js.org/guides/caching)并且有 [mutiple bundles](https://webpack.js.org/guides/code-splitting) 手动管理 `index.html` 将很困难。不过，你不担心，有几个插件可以使这个过程管理起来更简单。

## 设置 HtmlWebpackPlugin

如果我们改变了入口点名称或添加了一个新的，那会生成新的 bundle, 但我们的 `index.html` 文件中仍引用着老的 bundle. 让我们用 [HtmlWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin) 来解决这个问题。

在我们 build 之前，你应该知道 `HtmlWebpackPlugin` 默认会生成自己的 `index.html` 文件，即使 `dist/` 目录中已经有一个了。这意味着他将用最新生成的替代我们的 `index.html`。让我们 `npm run build` 看看会发生什么:

如果你在编辑器中打开 `index.html`，你将会看到 `HtmlWebpackPlugin` 已经创建了一个全新的文件并且自动加上了所有的 bundles.

如果你了解 `HtmlWebpackPlugin` 提供的所有特色和选项，那你可以参考下 [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin).

你也可以看下 [html-webpack-templte](https://github.com/jaketrent/html-webpack-template) 看年除了默认的模板外还有什么额外的特色。

## 清理 `/dist` 文件夹

你可能已经注意到了从之前的指南和 代码示例，我们的 `/dist` folder 已经变得乱七八槽了。Webpack 生成文件并将他们放在 `dist` 目录下，但他不追踪哪个文件在我们项目中真的用到。

通常每次 build 都清理下 `/dist` 文件夹是个很好的实践，因此只有用到的文件才会生成。让我们负起责任来。

一个很流行的管理这个的插件是 [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin), 让我们安装并配置他。

现在你运行 `npm run build` 并视察 `/dist` 目录，如果一切顺利你将会看到生成的文件并且不再有老文件了！

## Manifest

你可能会好奇 webpack 及其插件似乎知道该该生成什么文件。答案在 webpack 追踪的 manifest 以便知道所有的模块是如何生成到输出 bundles 的。可用 [WebpackManifestPlugin](https://github.com/danethurber/webpack-manifest-plugin) 将 manifest 数据提取成 json 文件以便研究一下。

We won't go through a full example of how to use this plugin within your projects, but you can read up on [the concept page](https://webpack.js.org/concepts/manifest) and the [caching guid](https://webpack.js.org/guides/caching) to find out how this ties into long term caching.

## Conclusion

现丰你已学习了如何动态地往 HTML 添加 bundles, 让我们进入下一章 [Development](https://webpack.js.org/guides/development) 吧。如果你想学习更高级的话题，我们建议你跳至 [Code Splitting](https://webpack.js.org/guides/code-splitting) 指南。