# Lazy Loading

这篇指南跟随 [Code Splitting](/guides/code-splitting). 如果你还没看过, 请先看下。

懒，或是近需加载是优化你站点或程序的很好的方式。这篇实践涉及了在逻辑点分割代码，然后一旦用户做了什么需要或将需要新的代码快时然后加载。这加快了应用的最初加载速度，减轻总体重量，因为一些块可能从不被加载。

## Example

让我们使用来自 [Code Splitting](/guides/code-splitting#dynamic-imports) 的例子并调整一下以更好地演示这个概念。这里的代码的确生成了一个独立的 chunk, `lodash.bundle.js`, 并且技术上一旦脚本运行时就被 "lazy-loads". 问题是加载这个模块没用用户交互 -- 这意味着每次页面加载时，都会触发请求。这没有太多帮助并对性能有负面冲击。

让我们尝试点不同的。我们添加了一些交互，当用户点击按钮时往控制台打印一些信息。然而直到出现第一次交互我们才加载代码 (`print.js`). 要这样做，我们返回并修改 _Code Splitting_ 中的 [final Dynamic Imports example](/guides/code-splitting#dynamic-imports) 并将 _lodash_ 留在主 chunk 中。

__project__

```diff
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
   |- index.js
+  |- print.js
|- /node_modules
```

__src/index.js__

```js
console.log('The print.js module has loaded! See the network tab in dev tools...');

export default () => {
    console.log('Button Clicked: Here\'s "some text"!');
}
```

__src/index.js__

```diff
+   import _ from 'lodash';
+
-   async function getComponent(){
+   function component(){
        var element = document.createElement('div');
-       const _ = await import(/* webpackChunkName: 'lodash' */ lodash);
+       var button = document.createElement('button');
+       var br = document.createElement('br');

+       button.innerHTML = 'Click me and look at the console!';
        element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+       element.appendChild(br);
+       element.appendChild(button);
+
+       // Note that because a network request is involved, some indication
+       // of loading would need to be shown in production-level site/app
+       button.onclick = e => import().then(module => {
+           var print = module.default;
+
+           print();
+       });
    }
        return element;
-   }

-   getComponent().then(component => {
-       document.body.appendChild(component);
-   });
+   document.body.appendChild(component());
```

当对 ES6 模块使用 `import()` 时你必须引用 `.default` 属性作为 promise 解析后返回的实际的 `module` 对象。

让我们运行 webpack 并检查我们新的 lazy-loading 功能：

```bash

```