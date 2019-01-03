var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const token = require('./token/token')
const Response = require('./routes/BaseResponse')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sellerRouter = require('./routes/seller')
var loginRouter = require('./routes/login')
var sellerProductRouter = require('./routes/seller_product')
var sellerCategoryRouter = require('./routes/seller_category')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
}, function (req, res, next) {
    const auth = req.get("Authorization")
    if(auth){
        req.token = auth;
        if(token.checkToken(auth)){
            req.info = token.decodeToken(auth).payload.data
        }else{
            res.send(Response.createError(-100,"token已超时,请重新登录"))
        }
    }
    next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/seller', sellerRouter);
app.use('/login', loginRouter);
app.use('/seller/category',sellerCategoryRouter)//店铺食物分类
app.use('/seller/product',sellerProductRouter) //获取店铺的商品信息


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log("app use null")
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


module.exports = app;
