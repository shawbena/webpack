## environment-variable

为了弄明白你的 `webpack.config.js` 在 [development](/guides/development) 还是在 [production builds](/guides/production), 你可以使用环境变量。

使用 webpack 命令行 [environment option](/api/cli/#environment-options) `-env`, 你想传多少环境变量都可以。可在 `webpack.config.js` 中访问环境变量。如 `--env.production` 或 `--env.NODE_ENV=local` (`NODE_ENV` 常常用于定义环境类型，见[此](https://dzone.com/articles/what-you-should-know-about-node-env))

```bash
webpack --env.NODE_ENV=local --env.production --progress
```

设置你的 `env` 变量而不赋值，`--env.production` 默认设置 `--env.production` 为 `true`. 也有其他语法可供使用。详细信息见 [webpack CLI](/aip/cli).

然而你需要更改下 webpack 配置。通常，在你的 webpack 配置中，`module.exports` 指向配置对象。

要使用 `env` 变量，你必须把 `module.exports` 转换为函数：

__webpack.config.js__

```js
module.exports = env => {
    // Use env.<YOU VARIABLE> here:
    console.log('NODE_ENV', env.NODE_ENV); // 'local'
    console.log('Production:', env.production); // true

    return {
        entry: './src/index.js',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist')
        }
    };
}
```

