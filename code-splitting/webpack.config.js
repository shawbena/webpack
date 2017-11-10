let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugijn = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
        another: './src/another-module.js'
    },
    output: {
        filename: './[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Code Splitting',
            filename: 'index.html',
            // template: 'src/index.html'
        }),
        new CleanWebpackPlugijn(['dist']),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common'  // Specify the common bundle's name.
        })
    ]
};