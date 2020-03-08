var fs = require('fs');
var http = require('http');
var https = require('https');
var path = require('path');

//同步读取密钥和签名证书
var options = {
    key:fs.readFileSync(path.join(__dirname,'./server.key')),
    cert:fs.readFileSync(path.join(__dirname,'../server.crt'))
}

var app = express();
var httpsServer = https.createServer(options,app);
var httpServer = http.createServer(app);

module.exports = {
    httpServer : httpServer,
    httpsService : httpsServer
}