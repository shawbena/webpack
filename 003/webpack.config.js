var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: './app/index.js',
    output: { //??
        filename: 'bundle.js',
        //__dirname 是当前文件的绝对路径
        //node 中的全局变量
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        loaders:[
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") }
        ]
    },
    plugins: [
        //给输出文件头部加注释信息
        new webpack.BannerPlugin('created by shaw'),
        new ExtractTextPlugin('styles.css')
    ]
};