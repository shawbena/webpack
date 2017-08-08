# Hot Module Replacement

这篇指南是在 `Development` 指南上扩展的。

Hot Module Replacement (或 HMR) 是 webpack 提供的最有用的特色之一。他允许所有种类的模块更新而不需要完整的刷新。本页关注于实现，[concept page](https://webpack.js.org/concepts/hot-module-replacement).

HMR 并非为生产设计，这意味关他应该只用于开发。详见 [building production guid](https://webpack.js.org/guides/production).

## 启用 HMR

这个特色对生产力帮助很大。我们需要做的是更新 webpack-dev-server 配置，使用 webpack 内置的 HMR 插件。我们也会移除 `print.js` 的入口点，`print.js` will be consumed by the `index.js` 模块。

你也可以用 CLI 修改 webpack-dev-server 配置：

`webpack-dev-server --hotOnly`

从命令行运行 `npm start` 启动他。

现在我们更新 `index.jhs` 文件，当侦测到 `print.js` 变化时，我们告诉 webpack 接受更新的模块。

```js index.js
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

更改 `print.js` 中的 `console.log`，你会发现流览器的控制台有以下输出。

```js print.js
 export default function printMe(){
-     console.log('I get called from print.js!');
+     console.log('Updating print.js...');
 }
``

```console
[HMR] Waiting for update signal from WDS...
main.js:4395 [WDS] Hot Module Replacement enabled.
+2main.js:4395 [WDS] App updated. Recompiling...
+ main.js:4395 [WDS] App hot update...
+ main.js:4330 [HMR] Checking for updates on the server...
+ main.js:10024 Accepting the updated printMe module!
+ 0.4b8ee77….hot-update.js:10 Updating print.js...
+ main.js:4330 [HMR] Updated modules:
+ main.js:4330 [HMR]  - 20
+ main.js:4330 [HMR] Consider using the NamedModulesPlugin for module names.
```

## Gotchas

当我们只更新 `print.js` 时， 点击页面的 button 按钮，你会发现控制台打印的是老的 `printMe` 函数。

这是因为 `index.js` 没有更新，button 的 click 事件，仍绑定着原始的 `printMe` 函数。你可以使用 `module.hot.accept` 更新新绑定新的 `printMe` 函数。

```js

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

这仅仅是一个例子而已，还有很多能轻轻松松把人们绊倒。幸运的是，我们有很多的 loader (一些下面会讲到) 会使得 HMR 更简单。

## HMR with Stylesheets

## Other Code and Framework

There are many other loaders and examples out in the community to make HMR interact smoothly with a variety of frameworks and libraries...

[React Hot Loader](https://github.com/gaearon/react-hot-loader): Tweak react components in real time.

[Vue Loader](https://github.com/vuejs/vue-loader): This loader supports HMR for vue components out of the box.

[Elm Hot Loader](https://github.com/fluxxu/elm-hot-loader): Supports HMR for the Elm programming language.
[Redux HMR](https://survivejs.com/webpack/appendices/hmr-with-react/#configuring-hmr-with-redux): No loader or plugin necessary! A simple change to your main store file is all that's required.

[Angular HMR](https://github.com/AngularClass/angular-hmr): No loader necessary! A simple change to your main NgModule file is all that's required to have full control over the HMR APIs.
If you know of any other loaders or plugins that help with or enhance Hot Module Replacement please submit a pull request to add to this list!

## Further Reading

[Concepts - Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement)
[API - Hot Module Replacement](https://webpack.js.org/api/hot-module-replacement)