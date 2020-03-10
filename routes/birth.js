var express = require('express');
var router = express.Router();
var db = require('../utils/db/mysql')
var Response = require('../utils/base_response')


var form = null
var address = null

//提交订单
router.post("/", async function (req, resp) {
    const body = req.body
    console.log(body)
    if(form == null){
        resp.send(Response.createSuccess())
        // form = body;
    }else{
        resp.send(Response.createError(-1,"error"))
    }
    // db.execBy(,,conn)
})


router.post("/address", async function (req, resp) {
    const body = req.body
    console.log(body)
    if(address == null){
        resp.send(Response.createSuccess())
        // form = body;
    }else{
        resp.send(Response.createError(-1,"error"))
    }
})

module.exports = router;