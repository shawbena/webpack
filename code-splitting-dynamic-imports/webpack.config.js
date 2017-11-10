let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugijn = require('clean-webpack-plugin');

module.exports = {
    devtool: 'cheap-source-map',
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: './[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Code Splitting'
        }),
        new CleanWebpackPlugijn(['dist'])
    ]
};