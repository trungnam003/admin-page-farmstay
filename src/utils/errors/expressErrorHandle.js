const STATUS_CODES = require('./statusCode')

class HttpError extends Error{
    constructor(statusCode, messageResponse){
        super('HTTP ERROR')
        
        if(STATUS_CODES.hasOwnProperty(statusCode) && statusCode>=400 && statusCode<=600){
            this.statusCode = statusCode;
            this.nameError = STATUS_CODES[statusCode];
            this.messageResponse = messageResponse??STATUS_CODES[statusCode].replaceAll('_', ' ');
        }else{
            throw new Error('This status code does not exist')
        }
    }
    static badRequest(msg){
        const statusCode = 400;
        const _msg = msg??STATUS_CODES[statusCode].replaceAll('_', ' ');
        return new HttpError(statusCode, _msg);
    }
    static internalServer(msg){
        const statusCode = 500;
        const _msg = msg??STATUS_CODES[statusCode].replaceAll('_', ' ');
        return new HttpError(statusCode, _msg);
    }
    static notFound(msg){
        const statusCode = 404;
        const _msg = msg??STATUS_CODES[statusCode].replaceAll('_', ' ');
        return new HttpError(statusCode, _msg);
    }
}

class HttpError400 extends HttpError{
    constructor(msg) {
        const statusCode = 400;
        const _msg = msg??STATUS_CODES[statusCode].replaceAll('_', ' ');
        super(statusCode, _msg);
    }
}
class HttpError404 extends HttpError{
    constructor(msg) {
        const statusCode = 404;
        const _msg = msg??STATUS_CODES[statusCode].replaceAll('_', ' ');
        super(statusCode, _msg);
    }
}

class HttpError401 extends HttpError{
    constructor(msg) {
        const statusCode = 401;
        const _msg = msg??STATUS_CODES[statusCode].replaceAll('_', ' ');
        super(statusCode, _msg);
    }
}
class HttpError409 extends HttpError{
    constructor(msg) {
        const statusCode = 409;
        const _msg = msg??STATUS_CODES[statusCode].replaceAll('_', ' ');
        super(statusCode, _msg);
    }
}
module.exports ={ HttpError, HttpError404, HttpError409, HttpError401, HttpError400}