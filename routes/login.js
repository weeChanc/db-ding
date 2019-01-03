var express = require('express');
var router = express.Router();
var db = require('../db/mysql')
const crypto = require('crypto');
const token = require('../token/token')
const Response = require('./BaseResponse')

const SQL_FIND_USER = "SELECT * FROM user WHERE phone = ?"
const SQL_FIND_SELLER = "SELECT seller_id,username,password,phone,seller_name,store_name,position FROM seller WHERE phone = ?"

router.post("/", async function (req, resp) {
    const phone = req.body.phone;
    var password = req.body.password;
    var loginType = req.body.type || 0;
    try {
        var result;
        if (loginType == 0) {
            result = await db.exec(SQL_FIND_USER, [phone])
        }
        else if (loginType == 1) {
            result = await db.exec(SQL_FIND_SELLER, [phone])
        }

        if (result.length == 0 ) {
            resp.send(Response.createError(-1, new Error("user not exists")))
            return;
        }

        const md5 = crypto.createHash('md5')
        password = md5.update(password, 'utf-8').digest('hex');
        if (result[0].password === password) {
            var body = result[0]
            delete body.password
            body.token = token.createToken(body, 6000 * 60 * 24 * 7)
            resp.send(Response.createSuccess(body))
        } else {
            resp.send(new Response(-1, "password incorrect", null))
        }
    } catch (e) {
        resp.send(Response.createError(-1, e))
    }
})

module.exports = router;
