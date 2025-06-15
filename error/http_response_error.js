module.exports = class HttpResponseError extends Error{
    constructor(code,msg){
        super(code,msg);
        this.name = "HttpResponseError";
        if(Error.captureStackTrace) Error.captureStackTrace(this,HttpResponseError);
        this.code = code;
        this.message = msg;
    }
}