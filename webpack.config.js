'use strict';

let path = require('path');
let args = process.argv;
const DEBUG = args.indexOf('--debug') >= 0;

let baseConfig = require(`./webpack/webpack.${DEBUG ? 'config' : 'product'}`);
module.exports = baseConfig({
    app: 'warbreief',
    resolve: {
        alias: {
            style: path.resolve(__dirname, './src/assets/style'),
            config: path.resolve(__dirname, './src/config')
        }
    }
});