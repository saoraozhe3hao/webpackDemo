'use strict';

let path = require('path'),
    fs = require('fs'),
    stat = fs.stat;

// 递归删除目录
let deleteFolder = function (path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
// 复制单个文件
let copyFile = function (src, dst) {
    fs.writeFileSync(dst, fs.readFileSync(src));
}
// 把一个目录下的所有文件复制到另一个目录下
let copyFiles = function (src, dst) {
    fs.readdir(src, function (err, paths) {
        if (err) {
            throw err;
        }
        paths.forEach(function (path) {
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;
            stat(_src, function (err, st) {
                if (err) {
                    throw err;
                }
                if (st.isFile()) {
                    readable = fs.createReadStream(_src);
                    writable = fs.createWriteStream(_dst);
                    readable.pipe(writable);
                }
                else if (st.isDirectory()) {
                    copyFolder(_src, _dst, copyFiles);
                }
            });
        });
    });
};
// 复制目录
let copyFolder = function (src, dst, callback) {
    fs.exists(dst, function (exists) {
        // 已存在
        if (exists) {
            callback(src, dst);
        }
        // 不存在
        else {
            fs.mkdir(dst, function () {
                callback(src, dst);
            });
        }
    });
};


module.exports = function (src,dist) {

    // 重建目标目录
    deleteFolder(dist);
    fs.mkdirSync(dist);
    // 复制index.html
    copyFile(path.resolve(src, './', 'src/index.html'), path.resolve(dist ,'./', 'index.html'));
    // 复制lib
    let lib = path.resolve(src, dist, 'lib/')
    fs.mkdirSync(lib);
    copyFolder(path.resolve(src, './', 'lib/'), lib, copyFiles);
    
};