# hot-module-replacement

如果 [Hot Module Replacement](/concepts/hot-module-replacement) 已通过 [HotModuleReplacementPlugin](/plugins/hot-module-replacement-plugin) 启用了，这个接口将暴露在 [module.hot](/api/module-variables#module-hot-webpack-specific-) 属性下。通常用户将检查是否这个接口可访问，然后开始使用他。下面的例子展示你如何 `accept` 一个更新的 module:

```js
if(module.hot){
    module.hot.accept('./library.js', function(){
        // Do something with the update library module...
        // 这样的代码有什么用啊？如果在开发中用了这样的代码，生产中要怎么去掉？
    });
}
```

支持以下方法...

## `accept`

接收给定 `dependencies` 的更新并触发一个 `callback` 以响应这些更新。

```js
module.hot.accept(
    dependencies,   // Either a string or an array of strings
    callback // Function to fire when the dependencies are update
);
```

## `decline`

Reject updates for the given `dependencies` forcing the update to fail with a `'decline'` code.

```js
module.hot.decline(
    dependencies // Either a string or an array of strings
);
```

## `dispose` (或 `addDisposeHandler`)

添加一个当前模块代码被替换时要被执行的处理程序。这应该用于移除你已声明的或创建的持续的代码。如果你想给更新的模块传递状态，添加给定的 `data` 参数。这个对象在更新后在 `module.hot.data` 可用。

```js
module.hot.dispose(data => {
    // Clean up and pass data to the update module...
});
```

## `removeDisposeHandler`

移除通过 `dispose` 或 `addDisposeHandler` 添加的回调。

```js
moduel.hot.removeDisposeHandler(callback);
```

## `status`

取回模块热替换进程的当前状态。

```js
module.hot.status() // Will return one of the following strings...
```

| __Status__ | __Description__ |
| ---------- | --------------- |
| idle       | 进程等待 `check` (见下) 调用|
| check      | 进程正在检查更新            |
| prepare    | 进程正在为更新准备 (如，在下载更新的模块) |
| ready      | 更新已经准备好并可用                   |
| dispose    | 进程调用要被替换的模块中的 `dispose` 处理程序 |
| apply      | 进程调用 `accept` 处理程序并重新执行自我接受的模块 |
| abort      | 更新中止，但系每仍处于先前状态           |
| fail       | 更新抛出异常并且系统状态已经妥协         |

## `check`

测试所有的模块更新，如果存在更新 `apply` 他们。

```js
// 这是一个 promise 吗？
module.hot.check(autoApply).then(outdateModules => {
    // outdated modules
}).check(error => {
    // catch errors;
});
```

`autoApply` 参数既可以是一个 boolean 也可以是调用 `apply` 时传递的 `option`

## `apply`

继续更新进程 (只要 `module.hot.status() === 'ready'`)

```js
module.hot.apply(options).then(outdateModules => {
    // outdated modules...
}).catch(error => {
    // catch errors
});
```

可选的 `options` 对象可以包括以下属性：

- `ignoreUnaccepted` (boolean):  Ignore changes made to unaccepted modules.

- `ignoredDeclined` (boolean): Ignore changes made to declined modules.

- `ingoreErrored` (boolean): Ignore errors throw in accept handlers, error handlers and while reevaulating module.

- `onDeclined` (function(info)): Notifier for declined modules

- `onAccepted` (function(info)): Notifier for accepted modules

- `onDisposed` (function(info)): Notifier for disposed modules

- `onErrored` (function(info)): Notifier for errors

`info` 参数是一个包含以下某些值的对象：

```js
{
  type: "self-declined" | "declined" | 
        "unaccepted" | "accepted" | 
        "disposed" | "accept-errored" | 
        "self-accept-errored" | "self-accept-error-handler-errored",
  moduleId: 4, // The module in question.
  dependencyId: 3, // For errors: the module id owning the accept handler.
  chain: [1, 2, 3, 4], // For declined/accepted/unaccepted: the chain from where the update was propagated.
  parentId: 5, // For declined: the module id of the declining parent
  outdatedModules: [1, 2, 3, 4], // For accepted: the modules that are outdated and will be disposed
  outdatedDependencies: { // For accepted: The location of accept handlers that will handle the update
    5: [4]
  },
  error: new Error(...), // For errors: the thrown error
  originalError: new Error(...) // For self-accept-error-handler-errored: 
                                // the error thrown by the module before the error handler tried to handle it.
}
```

## `addStatusHandler`

注册一个函数注册 `status` 变化。

```js
module.hot.addStatusHandler(status => {
    // React to the current status...
});
```

## `removeStatusHandler`

移除注册的 status 处理程序。

```js
module.hot.removeStatusHandler(callback)
```