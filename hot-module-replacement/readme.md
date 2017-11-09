# hot-module-replacement

这篇文章扩展了 [Development](/guids/development) 指南中的代码。

Hot Module Replacement (or HMR) 是 webpack 提供的最有用的特色之一。他允许各种模块在运行时更新而不用完全刷新。本文关注于实现而 [concepts page](/concepts/hot-module-replacement) 给出关于他工作的细节和为什么他是有用的。

`HMR` 不适合用于生产中，意味着他只应用于开发中。详情见 [building for production guide](/guides/production).

## Enable HMR

这个特色对生产力很有用。需要你做的就是更新我们的 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 配置, 使用 webpack 内置的 HMR 插件。我们也移除了 `print.js` 的入口点因为将在 `index.js` 中使用他。

如果你采用 `webpack-dev-middleware` 而非 `webpack-dev-server`, 请使用 [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware) 包来对你的自定义服务或应用启用 HMR.

webpack.config.js

```diff
    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
+   const webpack = require('webpack');
    module.exports = {
        entry: {
-          app: './src/index.js',
-          print: './src/print.js'
+          app: './src/index.js'
        },
        devtool: 'inline-source-map',
        devServer: {
            contentBase: './dist',
+           hot: true
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist')
        }
    }
```

你也可以用 CLI 来修改 [webpack-dev-server]() 配置：`webpack-dev-server --hotOnly`

让我们用 `npm start` 在命令行运行程序。

现在让我们更新 `index.js` 文件所以当侦测到 `print.js` 改动时，我们告诉 webapck 接收更新的模块。

index.js

```diff
  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);

    return element;
  }

  document.body.appendChild(component());
+
+ if (module.hot) {
+   module.hot.accept('./print.js', function() {
+     console.log('Accepting the updated printMe module!');
+     printMe();
+   })
+ }
```

开始改动 `print.js` 中的 `console.log` 语句，你应该看动浏览器控制台有以下输出。

print.js

```diff
  export default function printMe() {
-   console.log('I get called from print.js!');
+   console.log('Updating print.js...')
  }
```

console

```diff
[HMR] Waiting for update signal from WDS...
main.js:4395 [WDS] Hot Module Replacement enabled.
+ 2main.js:4395 [WDS] App updated. Recompiling...
+ main.js:4395 [WDS] App hot update...
+ main.js:4330 [HMR] Checking for updates on the server...
+ main.js:10024 Accepting the updated printMe module!
+ 0.4b8ee77….hot-update.js:10 Updating print.js...
+ main.js:4330 [HMR] Updated modules:
+ main.js:4330 [HMR]  - 20
+ main.js:4330 [HMR] Consider using the NamedModulesPlugin for module names.
```

## Via the Node.js API

当 Webpack Dev Server 和 Node.js API 一起使用时，不要将 dev server 选项放在 webpack 配置对象中。而在创建时传递为第二个参数。如：

`new WebpackDevServer(compiler, options)`

要启用 HMR, 你也需要修改 webpack 配置对象以包括 HMR 入口点。`webpack-dev-server` 包包括一个叫 `addDevServerEntrypoints` 的方法，你可以使用他来做这个事情。可以看下下面的小例子：

```js
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
    contentBase: './dist',
    hot: true
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(5000, () => {
    console.log('dev server listenging on port 5000');
});
```

## Gotchas

Hot Module Replacement 可以是棘手的。为了展示一下，让我们返回我们的例子。如果你直接点击示例页面的按钮，你将意识到控制台打印老的 `printMe` 函数。

发生这样的事情是因为 button 的 `onclick` 事件处理程序仍然绑定着原来的 `printMe` 函数。

要使这用于 HMR 我们需要更新绑定至新的 `printMe` 函数，使用 `module.hot.accept`:

index.js

```diff
  import _ from 'lodash';
  import printMe from './print.js';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;  // onclick event is bind to the original printMe function

    element.appendChild(btn);

    return element;
  }

- document.body.appendChild(component());
+ let element = component(); // Store the element to re-render on print.js changes
+ document.body.appendChild(element);

  if (module.hot) {
    module.hot.accept('./print.js', function() {
      console.log('Accepting the updated printMe module!');
-     printMe();
+     document.body.removeChild(element);
+     element = component(); // Re-render the "component" to update the click handler
+     document.body.appendChild(element);
    })
  }
```

这只是一个示例，还有很多会绊到用户。

幸运的是，有很多 loader (一些会在下面涉及) 使 hot module replacement 变得更加容易。

## HMR with Stylesheets

Hot Module Relacement 用于 CSS 在 `style-loader` 的帮助下是相当直接的。这个 loader 私底下使用 `module.hot.accept`，当 CSS 依赖更新时打补丁 `<style>` 标签。

首先用以下命令安装两个 loader:

```bash
npm install --save-dev style-loader css-loader
```

让我们更新配置文件使用这两个 loader.

webpack.config.js

```diff
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const webpack = require('webpack');

  module.exports = {
    entry: {
      app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true
    },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: ['style-loader', 'css-loader']
+       }
+     ]
+   },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement'
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

热加载样式是容易的，因为他们是以模块引入的。

project

```diff
  webpack-demo
  | - package.json
  | - webpack.config.js
  | - /dist
    | - bundle.js
  | - /src
    | - index.js
    | - print.js
+   | - styles.css
```

style.css

```css
body {
  background: blue;
}
```

index.js

```diff
  import _ from 'lodash';
  import printMe from './print.js';
+ import './styles.css';

  function component() {
    var element = document.createElement('div');
    var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;  // onclick event is bind to the original printMe function

    element.appendChild(btn);

    return element;
  }

  let element = component();
  document.body.appendChild(element);

  if (module.hot) {
    module.hot.accept('./print.js', function() {
      console.log('Accepting the updated printMe module!');
      document.body.removeChild(element);
      element = component(); // Re-render the "component" to update the click handler
      document.body.appendChild(element);
    })
  }
```

将 `body` 的样式改为 `background: red`, 你会马上看到页面背景发生变化而不用整个刷新。

```diff
  body {
-   background: blue;
+   background: red;
  }
```

## Other Code and Frameworks

社区里有很多 loader 和示例使得 HMR 与各种框加和库交互顺畅...

- [React Hot Loader](https://github.com/gaearon/react-hot-loader): 实时调整 react 组件。

- [Vue Loader](https://github.com/vuejs/vue-loader): 这个 loader 支持开箱即用的 vue 组件 HMR.

- [Elm Hot Loader](https://github.com/fluxxu/elm-hot-loader)

- [Redux HMR](https://survivejs.com/webpack/appendices/hmr-with-react/#configuring-hmr-with-redux) 不需要 loader 或 plugin! 只需要改动你的 main store 文件就可以啦。

- [Angular HMR](https://github.com/AngularClass/angular-hmr): 不需要 loader! 仅仅改变你的 main NgModule 文件就可以实现 HRM API 的完全控制。

如果你知道有其他的 loaders 或 plugins 有助于增加 Hot Module Replacement 请提交一个 pull 请示并添加到这个列表中!
