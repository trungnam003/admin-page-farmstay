const {HttpError, HttpError404, HttpError400} = require('../../utils/errors')
const {Validate, Joi} = require('../../helpers/validate_request')
/**
* 
* @param {object} source object cần được validate vd req.params, req.body, req.query
* @param {object} target object chứa các key value, key là property của source cần validate - value là loại validate cho key
* @param {string} target.key
* @param {Validate} target.value
* 
*/
module.exports.validateParam = function (target){
    return (req, res, next)=>{
        const {error, } = Validate(req.params, target)
        if(error){
            next(new HttpError400("Yêu cầu của bạn không hợp lệ"))
        }else{
            next();
        }
    }
}
module.exports.validateBody = function (target){
    return (req, res, next)=>{
        const {error, } = Validate(req.body, target)
        
        if(error){
            console.log(error)
            return next(new HttpError400("Yêu cầu của bạn không hợp lệ"))
        }else{
            return next();
        }
    }
}
module.exports.validateQuery = function (target){
    return (req, res, next)=>{
        const {error, } = Validate(req.query, target)
        
        if(error){
            console.log(error)
            return next(new HttpError400("Yêu cầu của bạn không hợp lệ"))
        }else{
            return next();
        }
    }
}
module.exports.Validate = Validate;
module.exports.Joi = Joi