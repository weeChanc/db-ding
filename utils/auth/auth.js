const token = require('../token/token')
const Response = require('../base_response')
function auth (req, res, next) {
    const auth = req.get("Authorization")
    console.log(req.originalUrl)
    if (auth && req.originalUrl != '/login' && req.originalUrl != '/users') {
        req.token = auth;
        if (token.checkToken(auth)) {
            req.info = token.decodeToken(auth).payload.data
            next();
        } else {
            res.send(new Response(-100, "token已超时,请重新登录",null))
        }
    }else{
        next()
    }
}


module.exports = auth;
