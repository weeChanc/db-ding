var fs = require('fs')
var multiparty = require('multiparty');
var express = require('express');
var router = express.Router();
var path = require('path');

function multipart(req, resp, next) {
    var form = new multiparty.Form();
//设置编辑
    form.encoding = 'utf-8';
//设置文件存储路径
    form.uploadDir = __dirname + "../../../files/images";
//设置单文件大小限制
    form.maxFilesSize = 2 * 1024 * 1024;
    //同步重命名文件名

    form.parse(req, function (err, fields, files) {
        for (key in files) {
            for (item of files[key]) {
                const fileName = Date.now() + item.originalFilename;
                fs.renameSync(item.path, path.join(__dirname, "../../files/images/" + fileName));
                item.newPath = "/images/" + fileName
            }
        }
        req.files = files;
        for (key in fields) {
            req.body[key] = fields[key]
        }
        next()
    })
}

module.exports = multipart
