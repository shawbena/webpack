# watch

webpack 可以观测文件并当他们变化时重新编译他们。此页面解释如何启用这个功能及当观测功能不适当工作时你可以怎么调整。

## `watch`

`boolean`

开启观测模式。打开观测模式。这意味着在初始构建后，webpack 将继续观测任何解析的文件的变化。默认观测模式是关闭的：

```js
watch: false
```

在 webpack-dev-server 和 webapck-dev-middleware 中 watch 模式默认是开启的。

## `watchOptions`

`object`

自定义观测模式的设置选项：

```js
watchOptions: {
    aggregateTimeout: 300,
    pool: 1000
}
```

## watchOptions.aggregateTimeout

`number`

添加一旦第一个文件变化时重新构建前的延迟。这使得 webpack 合并这段时间时间内的其他变化成一个重新构建。传递一个毫秒值：

```js
aggregateTimeout: 300 // 默认
```

在一些系统上，观测太多文件会消耗大量 CPU 或内存。也可以排除一个文件夹，如 `node_modules`:

```js
ignored: /node_modules/
```

也可以使用 [anymatch](https://github.com/es128/anymatch) 模式：

```js
ignored: 'files/**/*.js'
```

## `watchOptions.poll`

`boolean` `number`

传递 `true` 打开 [polling](http://whatis.techtarget.com/definition/polling), 或指定 poll 间隔的毫秒数：

```js
poll: 1000 // Check for changes every secone
```

如果观测不起作用，试试这个选项。在 NFS 和 VirtualBox 中，观测不起作用。