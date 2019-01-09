var express = require('express');
var router = express.Router();
var db = require('../utils/db/mysql')
var Response = require('../utils/base_response')

const SQL_SELECT_ALL_PRODUCT = `
SELECT I.*,S.price,S.spec FROM product_spec S,product_info I 
WHERE S.product_id=I.product_id AND S.spec_id=?
`

const SQL_INSERT_ORDER = `
INSERT INTO order_master (user_id,seller_id,create_time) VALUES(?,?,CURRENT_TIMESTAMP())
`

const SQL_INSERT_DETAILS = `
INSERT INTO order_detail (order_id,product_id,spec,product_name,price,product_icon,product_description)
VALUES(?,?,?,?,?,?,?)
`

//提交订单
router.post("/", async function (req, resp) {
    const specs = req.body.specs
    const sellerId = req.body.sellerId
    const userId = req.info.id;
    const conn = await db.begin();
    const insertResult = await db.execBy(SQL_INSERT_ORDER, [userId, sellerId], conn)
    const orderId = insertResult.insertId
    var totalPrice = 0;
    const all = []
    try {
        for (let sid of specs) {
            var result = await db.execBy(SQL_SELECT_ALL_PRODUCT, sid, conn)
            result = result[0]
            all.push({"product_name": result.product_name, "spec": result.spec, "price": result.price})
            totalPrice += result.price
            db.execBy(SQL_INSERT_DETAILS, [orderId, result.product_id, result.spec, result.product_name, result.price, result.product_icon,
                result.product_description], conn)
        }
        db.execBy("UPDATE order_master SET order_amount = ? WHERE order_id = ?", [totalPrice, orderId], conn)
        conn.commit()
        resp.send(Response.createSuccess({
            order_id: orderId,
            order_amout: totalPrice,
            details: all,
        }))
    } catch (e) {
        conn.rollback()
        resp.send(Response.SIMPLE_ERROR)
        console.log(e)
    } finally {
        conn.release()
    }

    // db.execBy(,,conn)
})

router.get("/", async function (req, resp) {

    async function getAllUserOrder(userId) {
        const sql = "SELECT * FROM order_master WHERE user_id = ? order by create_time desc";
        const orders = await db.exec(sql, [userId])
        resp.send(Response.createSuccess(orders))
    }

    async function getAllCustomerOrder(sellerId) {
        const sql = "SELECT * FROM order_view WHERE seller_id = ? order by create_time desc"
        const orders = await db.exec(sql, [sellerId])
        resp.send(Response.createSuccess(orders))
    }

    try {
        if (req.info.id)
            getAllUserOrder(req.info.id)
        if (req.info.seller_id)
            getAllCustomerOrder(req.info.seller_id)
    } catch (e) {
        resp.send(Response.createError(e))
    }


})

router.get("/todo", async function (req, resp) {
    const seller_id = req.info.seller_id
    try {
        const result = await db.exec("SELECT * FROM order_view WHERE seller_id = ? AND order_status='new' order by create_time desc", [seller_id])
        resp.send(Response.createSuccess(result))
    } catch (e) {
        resp. send(Response.createError(-1, e))
    }
})

router.get("/details", async function (req, resp) {
    const orderId = req.query.orderId
    try {
        const result = await db.exec("SELECT * FROM order_detail WHERE order_id=?", [orderId])
        resp.send(Response.createSuccess(result))
    } catch (e) {
        resp.send(Response.createError(-1, e))
    }
})

router.get('/finsih',async function (req,resp) {
    const orderId = req.query.orderId
    try{
        const result = await db.exec("UPDATE order_master SET order_status = 'ensure' WHERE order_id = ? " , [orderId])
        resp.send(Response.SIMPLE_SUCCESS)
    }catch (e) {
        resp.send(Response.SIMPLE_ERROR)
    }
})

module.exports = router;
