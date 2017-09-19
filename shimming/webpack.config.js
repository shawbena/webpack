const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    context: path.resolve(__dirname, 'src'),
    entry: './index.js',
    output: {
        filename: './dist/bundle.js',
        // sourceMapFileName: './dist[name].js.map'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.ProvidePlugin({
            _: 'lodash',
            join: ['lodash', 'join'],
            lodash: 'lodash'
        }),
        new HtmlWebpackPlugin({
            title: 'Shimming',
            filename: path.resolve(__dirname, 'index.html'),
        }),
    ]
};