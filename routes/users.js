var express = require('express');
var router = express.Router();
var db = require('../db/mysql')
var Response = require('./BaseResponse')

router.use("/", function (req, res, next) {
    req.json = req.body
    next();
})

//注册用户
router.post("/", async function (req, res, next) {
    try{
       const result =  await db.exec("INSERT INTO user (username,email,phone,password) VALUES (?,?,?,MD5(?))",
           [req.body.username, req.body.email, req.body.phone,req.body.password])
        res.send(Response.createSuccess(req.body).toJson())
    }catch (e) {
        res.send(Response.createError(-1,e).toJson())
    }
})
//注销用户
router.delete("/", async function (req, res, next) {
    try{
        const result = await db.exec("DELETE FROM user WHERE user_id = ?",req.body)
    }catch (e) {
        res.send(Response.SIMPLE_ERROR)
    }
})

//修改用户信息
router.put("/", async function (req, res) {
    const user = req.body;
    var sql = "UPDATE user SET "
    var params = []
    for( const value in user){
        sql = sql + value +"=?,"
        params.push(user[value])
    }

    if(params.length === 0 )  {
        res.send(Response.SIMPLE_SUCCESS)
        return;
    }
    sql = sql.slice(0,-1)
    sql = sql + " WHERE id = ?"
    params.push(req.query.userId)
    try{
        await db.exec(sql,params)
        res.send(Response.createSuccess(user).toJson())
    }catch (e) {
        res.send(Response.SIMPLE_ERROR)
    }
})


module.exports = router;
