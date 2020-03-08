var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multipart = require('./utils/multipart/multipart')
const auth = require('./utils/auth/auth')
const cross = require('./utils/cross/cross')
var fs = require('fs');



//同步读取密钥和签名证书


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sellerRouter = require('./routes/seller')
var loginRouter = require('./routes/login')
var sellerProductRouter = require('./routes/seller_product')
var sellerCategoryRouter = require('./routes/seller_category')
var orderRouter = require("./routes/order")
var reportRouter = require('./routes/report')



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'files')));


app.all('*',cross,auth,multipart)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/seller', sellerRouter);
app.use('/login', loginRouter);
app.use('/seller/category', sellerCategoryRouter)//店铺食物分类
app.use('/seller/product', sellerProductRouter) //获取店铺的商品信息
app.use('/order',orderRouter)
app.use('/report',reportRouter)




// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


module.exports = app;

