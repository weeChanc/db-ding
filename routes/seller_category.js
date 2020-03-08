var express = require('express');
var router = express.Router();
var db = require('../utils/db/mysql')
var Response = require('../utils/base_response')

const SQL_INSERT_CATEGORY = "INSERT INTO product_category (seller_id,category_name) VALUES (?,?)"
const SQL_SELECT_CATEGORY = "SELECT * FROM product_category WHERE seller_id = ?"

router.post('/', async function (req, resp) {
    const name = req.body.category_name
    try {
        await db.exec(SQL_INSERT_CATEGORY, [req.info.seller_id, name])
        resp.send(Response.SIMPLE_SUCCESS)
    } catch (e) {
        resp.send(Response.createError(-2, e))
    }
})

router.get("/", async function (req, resp) {
    const seller_id = req.info.seller_id;
    try {
        const result = await db.exec(SQL_SELECT_CATEGORY, [seller_id])
        resp.send(Response.createSuccess(result))
    } catch (e) {
        resp.send(Response.createSuccess(-1, e))
    }
})

router.delete("/", async function (req, resp) {
    const category_id = req.query.category_id;
    try {
        const result = await db.exec("DELETE FROM product_category WHERE category_id = ?", [category_id])
        resp.send(Response.SIMPLE_SUCCESS)
    } catch (e) {
        resp.send(Response.SIMPLE_ERROR)
    }
})
module.exports = router
