var express = require('express');
var router = express.Router();
var db = require('../utils/db/mysql')
var Response = require('../utils/base_response')


router.get("/daily", async function (req, resp) {
    const sellerId = req.info.seller_id
    var date = new Date();
    const d = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
    date = new Date(Date.now() - 60 * 60 * 24 * 1000)
    const yd = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`
    console.log(sellerId, d)
    try {
        var result1 = await db.exec("SELECT * FROM seller_daily_report WHERE seller_id = ? AND date = ? ", [sellerId, d])
        var result2 = await db.exec("SELECT * FROM seller_daily_report WHERE seller_id = ? AND date = ? ", [sellerId, yd])
        result1 = result1[0]
        result2 = result2[0]
        Object.assign(result1, {
            "order_gap": result1.count - result2.count,
            "amount_gap": result1.amount - result2.amount
        })
        resp.send(Response.createSuccess(result1))
    } catch (e) {
        resp.send(Response.createError(e))
    }

})

module.exports = router
