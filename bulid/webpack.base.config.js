'use strict';
let path = require('path'),
      fs = require('fs')

let webpack = require('webpack'),
          _ = require('lodash'),
       glob = require('glob')

let ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin')

let vue = require('vue')

let     UglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
    CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

let rootPath = path.join(process.cwd(), '..')
console.log('rootPath', rootPath);
let      srcDir = path.resolve(rootPath, path.join(rootPath, '/src/client')),
    nodeModPath = path.resolve(rootPath, path.join(rootPath, '/node_modules')),
         assets = path.join(rootPath, '/assets/');
        // pathMap = require('./src/pathmap.json')

let plugins = []
module.exports = (options) => {
    options = options || {}

    let      debug = options.debug !== undefined ? options.debug : true,
        publicPath = '',
        cssLoader,
        lessLoader

    if(debug) {
        // 开发阶段，css直接内嵌
        cssLoader = 'style!css'
        lessLoader = 'style!css!less'
    } else {
        // 编译阶段，css分离出来单独引入
        cssLoader = ExtractTextPlugin.extract('style', 'css?minimize') // enable minimize
        lessLoader = ExtractTextPlugin.extract('style', 'css?minimize', 'less')

        plugins.push(
            new ExtractTextPlugin('css/[contenthash:8].[name].min.css', {
                // 当allChunks指定为false时，css loader必须指定怎么处理
                // additional chunk所依赖的css，即指定`ExtractTextPlugin.extract()`
                // 第一个参数`notExtractLoader`，一般是使用style-loader
                // @see https://github.com/webpack/extract-text-webpack-plugin
                allChunks: false
            })
        )

        plugins.push(new UglifyJsPlugin())
    }
    let config = {
        entry: srcDir + '/main.js',
        devtool: 'source-map',
        output: {
            path: path.resolve(assets + 'public'),
            filename: debug ? 'js/[name].js' : 'js/[chunkhash:8].[name].min.js',
            chunkFilename: debug ? 'js/[chunkhash:8].chunk.js' : 'js/[chunkhash:8].chunk.min.js',
            hotUpdateChunkFilename: debug ? 'js/[id].js' : 'js/[id].[chunkhash:8].min.js',
            publicPath: publicPath
        },
        resolve: {
            root: [srcDir, './node_modules'],
            extensions: ['', '.js','.vue', '.css', '.less', '.tpl', '.png', '.jpg']
        },
        resolveLoader: {
            root: path.join(__dirname, 'node_modules')
        },
        module: {
            preLoaders: [{
                test: /\.vue$/,
                loader: 'eslint',
                include: srcDir,
                exclude: /node_modules/
            },{
                test: /\.js$/,
                include: srcDir,
                exclude: /node_modules/,
                loader: 'eslint'
            }],
            loaders: [
                {
                    test: /\.(jpe?g|png|gif)$/i,
                    loaders: [
                        'image?{bypassOnDebug: true, progressive:true, \
                            optimizationLevel: 3, pngquant:{quality: "65-80", speed: 4}}',
                        // url-loader更好用，小于10KB的图片会自动转成dataUrl，
                        // 否则则调用file-loader，参数直接传入
                        'url?limit=10000&name=img/[hash:8].[name].[ext]',
                    ]
                },
                { test: /\.(woff|eot|ttf)$/i, loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]' },
                { test: /\.(tpl|ejs)$/, loader: 'ejs'},
                { test: /\.css$/, loader: cssLoader},
                { test: /\.less$/, loader: lessLoader},
                { test: /\.(woff|woff2|ttf|eot|svg|otf)(\?t=[0-9]*(\#[a-zA-Z]*)?)?$/,   loader: "file"},
                { test: /\.js$/, exclude: /node_modules/, loader: 'babel?presets[]=es2015,presets[]=stage-3'},
                { test: /\.vue$/, exclude: /node_modules/, loader: 'vue'}
            ]
        },
        vue: {
            loaders: {
                js: 'babel!eslint'
            }
        },
        eslint: {
          formatter: require('eslint-friendly-formatter')
        },
        plugins: [
            new CommonsChunkPlugin({
                name: 'vender'
            }),
            new HtmlWebpackPlugin({
                filename: '../views/pages/index.html',
                template: srcDir + '/index.html',
                  inject: 'body'
            })
        ].concat(plugins),
        devServer: {
            hot: true,
            noInfo: false,
            inline: true,
            publicPath: publicPath,
            stats: {
                cached: false,
                colors: true
            }
        }
    }

    return config

}
