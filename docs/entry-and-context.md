# Entry and Context

entry 对象是 webpack 从哪查找开始打包。context 是一个至目录的绝对的包含入口文件的字符串.

## Context

`string`

基目录，一个绝对路径，用于解析入口点和配置中的 loaders.

```js
context: path.resolve(__dirname, "app")
```

默认使用当前目录，但是建议你在你的配置中传一个值。这使得你的配置独立于 CWD (current working directory);