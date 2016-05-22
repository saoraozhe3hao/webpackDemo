'use strict';

let path = require('path'),
    fs = require('fs'),
    stat = fs.stat,
    webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    copy = require('./webpack/copy');

// 获取命令参数，命令写在package.json中
let args = process.argv;
// 判断命令参数里有没有 --debug
const DEBUG = args.indexOf('--debug') >= 0;
// 确定目录
let dist = path.resolve(__dirname, './', 'webpack-dist/');
let src = path.resolve(__dirname);
// 复制 lib index.html 等
// 用webpack命令的话 用 copy 模块复制；用gulp的话，就用gulp复制
if(DEBUG){
    copy(src,dist);
}

// webpack 配置
module.exports = {
    // 入口文件
    entry: {
        index: './src/index.js'
    },
    // 代码中require 这些模块，不会被打进包里
    externals: {
        'react': 'React',  // 即 require('react') 对应全局变量 React
        'react-dom': 'ReactDOM',
        'react-router': 'ReactRouter',
        'fastclick': 'FastClick'
    },
    // 输出
    output: {
        // 输出目录
        path: dist,
        // 公共资源路径
        publicPath: 'http://localhost:63342/webpackDemo/webpack-dist/',
        // 输出文件名
        filename: '[name].js',
        sourceMapFilename: '[file].map',
        pathinfo: true
    },

    // 路径处理配置
    resolve: {
        // 模块别名,模块是一个目录以及里面的index文件
        alias: {
            detail: path.resolve(__dirname, '../', './src/detail')
        },
        // 以什么样的后缀名 来识别模块里的index文件
        extensions: ['', '.coffee', '.js', '.jsx']
    },

    // 语法检查配置
    eslint: {
        configFile: './webpack/.eslintrc',
        emitError: true,
        emitWarning: true,
        failOnError: true
    },

    module: {
        // 前置加载器
        preLoaders: [{
            test: /\.(js|jsx)$/,
            exclude: /(node_modules|iscroll\-lite\.js)/,
            loader: 'eslint'
        }],
        // 加载器配置
        loaders: [{
            // 目标文件
            test: /\.css$/,
            // 加载器，从后往前以叹号分割。即碰到 require('.css') 时，先用css-loader处理css,再用style-loader将css写入<style>标签
            loader: "style!css"
        }, {
            test: /\.less$/,
            // 使用这个插件，使得所有less 能被打入一个文件，而不是一个个style。传入的参数为 叹号分开的 loader
            loader: ExtractTextPlugin.extract('css!postcss!less')
        }, {
            test: /\.(js|jsx)$/,
            // 排除目标
            exclude: /(node_modules)/,
            // 用babel-loader 编译 jsx，问号后面为参数
            loader: 'babel?presets[]=react,presets[]=es2015'
        }, {
            test: /\.(png|jpg|jpeg|gif|webp|svg)$/,
            // 小于 8k的图片，输出为base64 dataurl
            loader: 'url-loader?name=assets/images/[name].[hash:8].[ext]&limit=8192'
        }, {
            test: /\.(ttf|otf|woff|eot)$/,
            // 字体转 dataurl
            loader: 'url-loader?name=assets/fonts/[name].[hash:8].[ext]&limit=1024'
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    },

    // 额外插件
    plugins: [
        // 定义插件 loader 配置中使用
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        })
    ],

    // 设置加载器为 debug 模式
    debug: true,
    // 设置 map 文件的 格式
    devtool: 'source-map'
};