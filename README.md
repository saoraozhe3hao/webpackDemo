######
CommonJS 模块 + webpack 
########
webpack的bundle（打包）功能支持CommonJS模块 和 AMD 模块，也可以配合Bable将ES6模块转成CommonJS 模块，再bundle。本例中是CommonJS模块
######
1、安装 webpack 命令行工具
   npm install -g webpack
######
2、安装依赖模块
  npm install
######
3、用webpack命令打包并监听,具体命令在 package.json 中
  npm run webpack
######
4、或者用gulp命令打包并监听
  gulp default
