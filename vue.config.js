const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const path = require('path')
// const glob = require('glob-all')
// const PurgecssPlugin = require('purgecss-webpack-plugin')
// const resolve = dir => path.resolve(__dirname, dir)
let UglifyJsPluginRun = {};
let CompressionWebpackRun = [];
if (process.env.NODE_ENV === 'production') {
    UglifyJsPluginRun = {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                        warnings: false,
                        drop_console: true, //console
                        drop_debugger: true, //移除debugger
                        pure_funcs: ['console.log'] //移除console
                    }
                }
            })
        ]
    };
    CompressionWebpackRun = [new CompressionWebpackPlugin({
        test: /\.js$|\.html$|\.css/, //匹配文件名
        threshold: 10240,//对超过10k的数据压缩
        deleteOriginalAssets: false //不删除源文件
    })];
    // CompressionWebpackRun.push(
    //     new PurgecssPlugin({
    //         paths: glob.sync([resolve('./**/*.vue')]),
    //         extractors: [
    //             {
    //                 extractor: class Extractor {
    //                     static extract(content) {
    //                         const validSection = content.replace(
    //                             /<style([\s\S]*?)<\/style>+/gim,
    //                             ''
    //                         )
    //                         return validSection.match(/[A-Za-z0-9-_:/]+/g) || []
    //                     }
    //                 },
    //                 extensions: ['html', 'vue']
    //             }
    //         ],
    //         whitelist: ['html', 'body'],
    //         whitelistPatterns: [/ant-.*/],
    //         whitelistPatternsChildren: [/^token/, /^pre/, /^code/]
    //     })
    // )
}
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ?
        '/web/' : '/',
    productionSourceMap: process.env.NODE_ENV === 'production' ?
        false : true,
    configureWebpack: {
        optimization: UglifyJsPluginRun,
        plugins: CompressionWebpackRun
    },
    // devServer: process.env.NODE_ENV === 'production' ?  {} : {
    //     proxy: {
    //         '/apt/api': {
    //             target: 'http://sinopatient.ashermed.cn',
    //             ws: true,
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 '^': '/'
    //             }
    //         }
    //     }
    // },
    chainWebpack: (config) => {
        // 修复HMR
        config.resolve.symlinks(true);
        // if (process.env.NODE_ENV === 'production') {
        //     config.plugin('webpack-report')
        //         .use(BundleAnalyzerPlugin, [{
        //             analyzerMode: 'static',
        //         }]);
        // }
    }
}