let path = require('path');

module.exports = {
    entry: {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendors.ts',
        'main': './src/main.ts'
    },
    output: {
        path: path.join(__dirname, '/../dist/assets'),
        filename: './dist/[name].bunlde.js',
        publicPath: '',
        sourceMapFilename: './dist/[name].map'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        modules: [path.join(__dirname, 'src'), 'node_modules']
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: [/\.(spec|e2e)\.ts$/],
            use: [
                'awesome-typescript-loader',
                'angular2-template-loader'
            ]
        }, {
            test: /\.css$/,
            use: ['to-string-loader', 'css-loader']
        }, {
            test: /\.s(c|a)ss$/,
            use: ['to-string-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.(jpg|png|gif)$/,
            use: 'file-loader'
        }, {
            test: /\.(woff|woff2|eot|ttf|svg)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000
                }
            }
        }]
    },
    plugins: [
        new ForkCheckerPlugin(),
        new CleanWebpackPlugijn(['dist', 'fonts', 'images']),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['polyfills', 'vendors'].reverse()
        }),
        new HtmlWebpackPlugin({
            title: '',
            filename: 'index.html',
            template: 'src/index.html',
            chunksSortMode: 'dependency'
        })
    ]
};