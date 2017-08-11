let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugijn = require('clean-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        app: './src/index.js',
    },
    output: {
        filename: './dist/[name].bundle.js',
        path: path.resolve(__dirname),
        publicPath: '',
        //配置如何命名 source map， 默认使用 "[file].map".
        //只有 devtool 使用输出 SourceMap 文件的选项时才使用该选项。当需要时相对服务器的 URL, 相对协议的 URL 或绝对的 URL 都是可能的，如 assets 在 CDN 上。
        sourceMapFilename: './dist/[name].map'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }, {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"  //creates style nodes from JS string
                    }, {
                        loader: "css-loader"    //translates CSS into CommonJS
                    }, {
                        loader: "sass-loader",   //compiles Sass to CSS
                        options: {
                            //见 node-sass
                        }
                    }
                ]
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader?outputPath=./images/'
                ]
            }, {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                            removeComments: true,
                            collapseWhitespace: false
                        }
                    }
                ]
            }, {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader?outputPath=./fonts/'
                ]
            }, {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            }, {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
        ]
    },
    devServer: {
        port: 7777,
        host: 'localhost',
        historyApiFallback: true,
        noInfo: false,
        publicPath: '',
        contentBase: './',
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Production',
            filename: 'index.html',
            // template: 'src/index.html'
        }),
        new CleanWebpackPlugijn(['dist', 'fonts', 'images']),
        new webpack.HotModuleReplacementPlugin()
    ],
};