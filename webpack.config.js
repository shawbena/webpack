let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CleanWebpackPlugijn = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    output: {
        filename: './dist/[name].bundle.js',
        path: path.resolve(__dirname)
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
                    },{
                        loader: "sass-loader",   //compiles Sass to CSS
                        options: {
                            //见 node-sass
                        }
                    }
                ]
            },{
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader?outputPath=./images/'
                ]
            },{
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
            },{
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader?outputPath=./fonts/'
                ]
            },{
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },{
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
        ]
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './',
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hot Module Replacement',
            filename: 'index.html',
            // template: 'src/index.html'
        }),
        new CleanWebpackPlugijn(['dist']),
        new webpack.HotModuleReplacementPlugin()
    ],
};