let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let Visualizer = require('webpack-visualizer-plugin');

const DIST = path.resolve(__dirname, 'dist');
const SRC = path.resolve(__dirname, 'src');

module.exports = {
    entry: './src/main.js',
    output: {
        path: DIST,
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Tree Shaking'
        }),
        new CleanWebpackPlugin([DIST]),
        new Visualizer()
    ]
};
