let path = require('path');
let webpack = require('webpack');
let Merge = require('webpack-merge');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');

let common = {
    entry: {
        app: './src/main.js'
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Tree Shaking',
            filename: 'index.html'
        }),
    ]
};
let development = Merge(common, {
    output: {
        filename: './dist/[name][chunkhash].bundle.js',
        sourceMapFilename: './dist/[name][chunkhash].map'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './',
    },

});

let production = Merge(common, {
    output: {
        filename: './dist/[name].min.js',
        sourceMapFilename: './dist/[name].min.map'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true
            },
            comments: false
        })
    ]
});
// development or production
module.exports = development;
