function BaseResponse(code, message, body) {
    this.code = code;
    this.message = message;
    this.data = body;
    this.toJson = function () {
        return JSON.stringify(this)
    }
}

BaseResponse.SIMPLE_SUCCESS = new BaseResponse(200,"success",null)
BaseResponse.SIMPLE_ERROR = new BaseResponse(-1,"error",null)
BaseResponse.createError =  function(code,e) {
    return  new BaseResponse(code ,e.message,null)
};
BaseResponse.createSuccess =  function(body){
    return new BaseResponse(200,"success",body)
};

module.exports = BaseResponse
