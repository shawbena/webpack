# webpack-demo

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

