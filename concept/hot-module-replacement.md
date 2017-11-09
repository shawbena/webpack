# Hot Module Replacement

Hot Module Replacement (HMR) 交互，添加，或移除 [modules]() 当应用程序在运行时，而不用完全重载。这可以在以下几方面显著增加开发速度：

- 保持完全重载可能丢失的应用程序状态

- 仅更新变化部分节省宝贵的开发时间

- 调整样式速度快 -- 几乎与在浏览器调试器中改变样式可比

## How it Works

让我们从不同的视角理解 HMR 怎么工作的...

### In the Application

The following steps allow modules to be swapped in and out of ana application:

1. 应用程序要求 HMR 运行时检查更新 //怎么要求？

2. 运行时异步下载更新并通知应用程序
 
3. 应用程序然后要求运行时应用更新

4. 运行时同步应用更新

你可以设置 HMR 使这个过程自动发生，或你可以选择需要用户交互来更新。 //?

## In the Compiler

除了正常的 assets，编译器需要发出 "update" 使得从前一个版本到新的版本的更新"。"update" 包括两个方面：

1. 更新 [manifest](https://webpack.js.org/concepts/manifest)(JSON)

2. 一个或多个 chunks (JavaScript) 更新

manifest 包含新的编译哈希值和所有更新的 chunks 列表。每个这些 chunks 包含用于更新的所有模块的新的代码 (或指示模块被移除的标志)。

编译器确保模块 IDs 和 chunk IDs 在这些构建间是一致的。他通常将这些 IDs 存储在内存中 (e.g. with [webpack-dev-server](https://webpack.js.org/configuration/dev-server/)), 但也可将他们存储在 JSON 文件中。

## In a Module

HMR 是一个选择性加入的特色，他只影响包含 HMR 代码的模块。一个例子就是通过 [style-loader](https://github.com/webpack/style-loader) 打补丁样式。为了使补丁起作用，`style-loader `实现了 HMR 接口，当他通过 HMR 接收到更新时，他用新的样式替换掉旧的样式。

相似地，当在模块中实现 HMR 接口你可以描述模块更新时发生什么。然而，大多情形中是不强制每个模块中都要写 HMR 代码。如果一个模块没有 HMR 处理程序，更新向上冒泡，这意味着一个处理程序可以更新一个完整的模块树。如果树中一个模块更新了，整个依赖集都被重载。

见 [HMR API page](/api/hot-module-replacement) 关于 `module.hot` 接口的详细信息。

## In the Runtime
...

## Get Started

HMR 可用在开发环境中用作动态重载替换。[webpack-dev-server](/configuration/dev-server/) 支持 `hot` 模式，在这种模式中在尝试重载整个页面前他尝试以 HMR 更新。详情见 [Hot Module Replacement guid](/guides/hot-module-replacement).

正如其他特色一样，webpack 的强大处在于他的自定义性。根据一个项目的特殊需求有很多配置 HMR 的方式。然而，对大多数目的，`webpack-dev-server` 够合适了且将使得你快速开始使用 HMR.

