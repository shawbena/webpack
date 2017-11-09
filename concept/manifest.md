用 webpack 构建的通常的应用程序中，有三种主要类型的代码：

1. 你，或许你的团队写的源代码

2. 你们源代码依赖的第三方库或 "vendor" 代码

3. A webpack runtime and *manifest* that conducts the iteration of all modules. //that 指什么？

本文关注三者中的最后一个，运行时尤其是 manifest.

## Runtime

正如上面提到的，我们仅简单的涉及一点这个。运行时及 manifest 数据，是 webpack 需要的连接你运行在浏览器中的应用程序需要的所有代码。他包括当交互时要连接你模块的加载和解析逻辑。这包括连接已经加载进浏览器中的模块及懒加载还未加载的逻辑。

## Manifest

所以一旦你的应用程序以 `index.html` 的形式加载进流览器，一些 bundles, 各种各样的其他 assets，他们是什么样子？你精心布置的 `/src` 目录没了，那 webpack 是如何管理你所有模块之间的交互呢？这便要讲下 manifest...

 当编译器进入，解析，规划你的应用程序时，他详细地记录了你所有的模块。这个数据集合叫 "Manifest"，运行将用他来解析和加载 bundle 的和分发到浏览器的模块。无论你选择哪种 [module syntax](/api/module-methods)，这些 `import` 或 `require` 语句现在变成了指向模块标识符的 `__webpack_require__` 方法。使用 manifest 中的数据，运行时将成找出哪里取回标识符后的模块。

 // 这些 manifest 放在哪里呢？

## The Problem

现在你对 webpack 私底下是怎么工作的有一点了解了吧。"可是，这对我有啥影响？"，你可能会问。简单的答案是，大多情形下没有什么影响。运行时将做他的事情，使用 manifest, 且一旦你的应用进入了济览器一切就像魔法那样工作。不过，如果你决定使用济览器缓存提升项目的性能，理解这个过程会突然变得很重要。

通过在你 bundle 文件名中使用 content hashes, 你可以指示浏览器何时文件内容变化了因此使缓存失效。然而一旦你开始这样做，你会立即发现一些有趣的行为，即使内容显然没有变化某些 hashes 也变化了。这是由于每次构建注入运行时和 manifest 造成的。见我们构建文件指南的[the manifest section](/guides/output-management#the-manifest ) 学习如何提取 manifest 文件，并读下后面的指南关于复杂的长期缓存。
