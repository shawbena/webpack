# Asset Management

如果从一开始你就按照指南做，现在你将有性展示 "Hello webpack" 的工程。现在让我们加入一些 assets, 如 images, 看看怎么处理他们。

在 webpack 出现之前，前端开发者会使用一些其他的工具如 grunt 和 gulp 处理这些 assets 并将他们从 `/src` 文件夹移动到 `dist` 或 `/build` 目录中。这样的想法也适用于 JavaScript 模块，但是 webpack 这样的工具将动态 bundle 所有依赖 (将已知创建为[依赖图表](https://webpack.js.org/concepts/dependency-graph)). 这样是很棒的因为每个模块现在都明确声明其依赖，我们将避免 bundling 那些不使用的模块。

webpack 最酷的特色就是你可以用 loader 引入任何类型的文件，不仅仅是 JavaScript。这意味着应于于 JavaScript 的好处同样也适用于构建网站或 webapp 的一切东西。让我们从 CSS 开始。