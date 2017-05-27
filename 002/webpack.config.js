var webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: './entry.js',
    output: {
        path: __dirname, //??
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({

                use: "css-loader"
            })
        }]
    },
    plugins: [
        //给输出文件头部加注释信息
        new ExtractTextPlugin("styles.css"),
    ]
};
