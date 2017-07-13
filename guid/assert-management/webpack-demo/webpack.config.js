let path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
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
            }
        ]
    }
};