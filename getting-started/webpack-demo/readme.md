# webpack-demo

在这个例子中， `<script>` 标签间有不明确的依赖。`index.js` 在运行前依赖 `lodash` 先加载进页面。 `index.js` 从未声明对 `lodash` 的依赖，他只假设 `_` 存在。

这样管理 JavaScript 项目有些问题：

- 脚本对外部库依赖并不明显
- 如果依赖丢失或放置顺序不对
- 如果引入了依赖但没有用，浏览器将下载无用代码

让我们用 webpack 管理这些脚本。