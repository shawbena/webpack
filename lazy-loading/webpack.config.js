let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugijn = require('clean-webpack-plugin');
let Visualizer = require('webpack-visualizer-plugin');

const DIST = path.resolve(__dirname, 'dist');
const SRC = path.resolve(__dirname, 'src');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        path: DIST,
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js'
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
        }),
        new Visualizer()
    ]
};