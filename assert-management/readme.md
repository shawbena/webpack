# Asset Management

如果从一开始你就按照指南做，现在你将有性展示 "Hello webpack" 的工程。现在让我们加入一些 assets, 如 images, 看看怎么处理他们。

在 webpack 出现之前，前端开发者会使用一些其他的工具如 grunt 和 gulp 处理这些 assets 并将他们从 `/src` 文件夹移动到 `dist` 或 `/build` 目录中。这样的想法也适用于 JavaScript 模块，但是 webpack 这样的工具将动态 bundle 所有依赖 (将已知创建为[依赖图表](https://webpack.js.org/concepts/dependency-graph)). 这样是很棒的因为每个模块现在都明确声明其依赖，我们将避免 bundling 那些不使用的模块。

webpack 最酷的特色就是你可以用 loader 引入任何类型的文件，不仅仅是 JavaScript。这意味着应于于 JavaScript 的好处同样也适用于构建网站或 webapp 的一切东西。让我们从 CSS 开始。

## 加载 CSS

webpack 使用正则表达式决定查找哪个文件用于特定的 loader. 这个例子中以 `.css` 结尾的文件将用于 `style-loader` 和 `css-loader`.

这使得你 `import './style.css'` 至依赖样式的文件。现在，当模块运行时，你 html 文件中的 `<head>` 里面将插入一个 `<style>` 标签。

你也可以[分割你的CSS](https://webpack.js.org/plugins/extract-text-webpack-plugin) 文件以便在产中在更好的时机加载。除此之外，还有很多口味的 CSS loader - [postcss](https://webpack.js.org/loaders/postcss-loader). [sass](https://webpack.js.org/loaders/sass-loader) 和 [less](https://webpack.js.org/loaders/less-loader)

## 加载 图像

现在为至我们加入了 CSS，但是背景和图标图片呢？使用 [file loader](https://webpack.js.org/loaders/file-loader) 将很容易把这些包含在我们的体系内：

现在，当你 `import MyImage from './my-image.png'`, 这个图像将被处理并添加到 `output` 目录并且 `MyImage` 变量包含处理后图像的最终 url. 当使用 `css-loader` 时，对于 css 中的 `url('./my-image.png')` 会进行同样的处理。loader 将识别这是个本地文件，并用 `output` 目录中图像的最终路径替换 `'./my-image.png'`。[html-loader](https://webpack.js.org/loaders/html-loader) 以同样的方式处理 `<img src="./my-images.png">`

下一步的罗辑是最小化和优化你的图象，看看 [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader) 和 [url-loader](https://webpack.js.org/loaders/url-loader) 怎样增强你的图像加载处理。

## 加载字体

那么关于 fonts 这样的 assets 呢? file 和 url loader 将接任何文件并将他们输出到构建目录中。这意味着你可以使用任何文件，包括字体。让我们更新我们的 `webpack.config.js` 来处理字体文件：

## 加载 Data

另一个有用的可加载的 asset 是 data, 如 JSON 文件, CSVs, TSVs, 和 XML.实际上内置 JSON 支持, 类似 NodeJS。默认 `import Data from './data.json'` 将可用。要引入 CSVs, TSVs 和 XML 你要用 [csv-loader](https://github.com/theplatapi/csv-loader) 和 [xml-loader](https://github.com/gisikw/xml-loader)

你可以 `import` 四种数据类型 (JSON, CSV, TSV, XML) 中的任何一种 `Data` 变量将包含转换后易用的 JSON：

当你实现一些数据可视化时如[d3](https://github.com/d3)这样的工具这将非常有帮助。你可以在构建过程中将数据加载进模块当模志一加载进流览器转换后的数据就准备好了，而非并运行时发起一个 ajax 请求并转换数据。

## Global Assets

上面我们提到过的最酷的就是，以这样的方式加载 assets 使得你以更直观的方式将模块和 assets 组织在一块。你可以将 asserts 和用得到他们的代码放在一组，而非依赖包含一切的 `/assets` 目录。如下面的结构会非常有用：

```structure
- |- /assets
+ |- /components
+ |  |- /my-component
+ |  |  |- index.jsx
+ |  |  |- index.css
+ |  |  |- icon.svg
+ |  |  |- img.png
```

这个设置使得你的代码有很多便携性，因为关系密切的放在一块。假设你在另一个项目中想用 `/my-component`, 仅拷贝一下或把他移动到那里的 `/components` 目录就可以了。只要你安装了所有外部依赖且你的配置有同样定义的 loaders, 你就可以这么做。

然而，假设你受限于你老的方式或者你有一些多个组件 (views, templates, modules, etc) 之间共享的 assets. 仍然可以在一个基目录存储这些 assets 并且使用 [aliasing](https://webpack.js.org/configuration/resolve#resolve-alias) 来使他们更易 `import`

## 结尾

下一个指南我们用的 asserts 和这节不山口王，所以让我们做一些清理工作以便为下节的指南 [Output Management](https://webpack.js.org/guides/output-management/) 做准备。