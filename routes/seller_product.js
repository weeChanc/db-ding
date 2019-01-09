var express = require('express');
var router = express.Router();
var db = require('../utils/db/mysql')
var Response = require('../utils/base_response')

const SQL_INSERT_DISH = "INSERT INTO product_info (category_id,product_name,product_description,product_icon) VALUES (?,?,?,?)"
const SQL_INSERT_SEPC = "INSERT INTO product_spec (product_id,spec,price) VALUES (?,?,?)"
const SQL_SELECT_CATEGORY_DISH = "SELECT I.*,any_value(min(price)) min_price FROM product_info I,product_spec S \n" +
    "WHERE I.product_id=S.product_id AND category_id = ?\n" +
    "GROUP BY product_id"

const SQL_ALL_DISHES = `
SELECT C.*,D.spec_id,D.spec,D.price FROM
(SELECT A.*,B.product_name,B.product_description,B.product_icon,B.product_id 
FROM (SELECT * FROM product_category WHERE seller_id=?) A  
LEFT JOIN  (SELECT * FROM product_info) B ON  A.category_id = B.category_id) C
LEFT JOIN product_spec D ON C.product_id = D.product_id`

router.get("/", async function (req, resp) {

    async function queryByCategoryId() {
        const id = req.query.category_id
        try {
            const result = await db.exec(SQL_SELECT_CATEGORY_DISH, [id])
            resp.send(Response.createSuccess(result))
        } catch (e) {
            resp.send(Response.createError(-1, e))
        }
    }

    async function queryBySellerId() {
        const id = req.query.sellerId
        try{
            const result = await db.exec(SQL_ALL_DISHES,[id])
            const obj = {}
            for ( const item of result){
                const key = item.category_id
                if(!obj[key]){
                    obj[key] = []
                }
                obj[key].push(item)
            }
            const obj2 = []
            for(const key in obj){
                var obj3 = {}
                obj3.name = obj[key][0].category_name
                obj3.type = obj[key][0].category_id
                obj3.foods = []

                for(item of obj[key]){
                    if(item.product_id){
                        obj3.foods.push(item)
                    }
                }
                obj2.push(obj3);
            }
            resp.send(Response.createSuccess(obj2))
        }catch (e) {
            console.log(e)
        }
    }

    if(req.query.sellerId){
        queryBySellerId()
    }else if( req.query.category_id){
        queryByCategoryId()
    }

})

router.post("/", async function (req, resp) {
        console.log(req.body)
        const categodyId = req.body.category_id
        const name = req.body.name[0]
        const desc = req.body.description[0]
        const icon = req.files.icon[0].newPath
        var conn = null;
        try {
            const conn = await db.getConnection()
            conn.beginTransaction()
            const insert_result = await db.execBy(SQL_INSERT_DISH, [categodyId, name, desc, icon], conn)
            const product_id = insert_result.insertId
            if (req.body.big) {
                await db.execBy(SQL_INSERT_SEPC, [product_id, "big", req.body.big[0]], conn);
            }

            if (req.body.medium) {
                await db.execBy(SQL_INSERT_SEPC, [product_id, "medium", req.body.medium[0]], conn);
            }

            if (req.body.small) {
                await db.execBy(SQL_INSERT_SEPC, [product_id, "small", req.body.small[0]], conn);
            }
            conn.commit();
            resp.send(Response.SIMPLE_SUCCESS)
        } catch (e) {
            if (conn != null) {
                conn.rollback()
            }
            resp.send(Response.createError(-3, e))
        }
    }
)


module.exports = router
