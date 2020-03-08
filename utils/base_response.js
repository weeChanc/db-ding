function Base_response(code, message, body) {
    this.code = code;
    this.message = message;
    this.data = body;
    this.toJson = function () {
        return JSON.stringify(this)
    }
}

Base_response.SIMPLE_SUCCESS = new Base_response(200,"success",null)
Base_response.SIMPLE_ERROR = new Base_response(-1,"error",null)
Base_response.createError =  function(code, e) {
    return  new Base_response(code ,e.message,null).toJson()
};
Base_response.createSuccess =  function(body){
    return new Base_response(200,"success",body).toJson()
};

module.exports = Base_response
