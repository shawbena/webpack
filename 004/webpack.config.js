const path = require('path');
const webpack = require('webpack'); //访问内置插件
const htmlWebpackPlugin = require('html-webpack-plugin');
const extraTextPlugin = require('extract-text-webpack-plugin');

let config = {
    entry: './app.js',
    output: {
        filename: 'dist/js/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },{
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin(),
        new htmlWebpackPlugin({
            title: 'hello world',
            filename: 'index.html'
        })
    ]
};

module.exports = config;