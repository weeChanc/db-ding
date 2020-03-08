var express = require('express');
var router = express.Router();
var db = require('../utils/db/mysql')
var Response = require('../utils/base_response')

const SQL_CREATE_SELLER = "INSERT INTO seller " +
    "(password,phone,seller_name,store_name,position,idcard,create_time,store_image)" +
    "VALUES (MD5(?),?,?,?,?,?,CURRENT_TIMESTAMP(),?)"

const SQL_DELETE_SELLER = "DELETE seller WHERE seller_id = ?"

var SQL_UPDATE_SELLER = "UPDATE seller SET" //动态拼凑SQL

router.get('/', async function (req, resp) {
    try {
        const sellerid = req.query.sellerId
        const result = await db.exec("SELECT notice,store_name,position,create_time,store_image" +
            " FROM seller WHERE seller_id = ? ", [sellerid])
        if (result.length === 0) {
            resp.send(new Response(-2, ' this shop not exisits', null))
            return;
        }
        resp.send(Response.createSuccess(result[0]))
    } catch (e) {
        resp.send(Response.createError(-1, e))
    }
})

router.post('/', async function (req, resp, next) {
    async function insert() {
        const path = req.files.shop_images[0].newPath
        await db.exec(SQL_CREATE_SELLER, [this.password[0], this.phone[0], this.sellername[0],
            this.store_name[0], this.position[0],this.idcard[0], path])
        resp.send(Response.createSuccess(null))
    }

    try {
        await insert.call(req.body)
    } catch (e) {
        console.log(e)
        resp.send(Response.createError(-1, e))
    }
})

module.exports = router;
