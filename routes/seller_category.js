var express = require('express');
var router = express.Router();
var db = require('../db/mysql')
var Response = require('./BaseResponse')

const SQL_INSERT_CATEGORY = "INSERT INTO product_category (seller_id,category_name) VALUES (?,?)"

router.post('/', async function (req, resp) {
    const name = req.categoryName
    try{
        await db.exec(SQL_INSERT_CATEGORY,[req.info.seller_id,name])
        resp.send(Response.SIMPLE_SUCCESS)
    }catch (e) {
        resp.send(Response.createError(-2,e))
    }
})


module.exports = router
