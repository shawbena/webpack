# webpack-demo

## 加载 CSS

webpack 使用正则表达式决定查找哪个文件用于特定的 loader. 这个例子中以 `.css` 结尾的文件将用于 `style-loader` 和 `css-loader`.

这使得你 `import './style.css'` 至依赖样式的文件。现在，当模块运行时，你 html 文件中的 `<head>` 里面将插入一个 `<style>` 标签。

你也可以[分割你的CSS](https://webpack.js.org/plugins/extract-text-webpack-plugin) 文件以便在产中在更好的时机加载。除此之外，还有很多口味的 CSS loader - [postcss](https://webpack.js.org/loaders/postcss-loader). [sass](https://webpack.js.org/loaders/sass-loader) 和 [less](https://webpack.js.org/loaders/less-loader)

## 加载 图像

