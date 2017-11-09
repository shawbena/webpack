const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        index: './index.js',
        vendor: [
            'lodash'
        ]
    },
    output: {
        filename: './dist/[name].[chunkhash].js'
    },
    
    plugins: [
        // new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Caching',
            filename: path.resolve(__dirname, 'index.html'),
            chunks: ['index', 'runtime'],
            // excludeChunks: [],
            favicon: './favicon.ico',
            // template: '' // 模板如果指定 .html 文件，要指定 html-loader, 不过你可以使用开箱即用的 loadash 语法
        
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        }),
        new webpack.HashedModuleIdsPlugin()
    ]
};