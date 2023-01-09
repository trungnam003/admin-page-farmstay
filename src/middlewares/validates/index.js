const {HttpError, HttpError404, HttpError400} = require('../../utils/errors')
const {Validate} = require('../../helpers/validate_request')
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
        const {error, value} = Validate(req.params, target)
        if(error){
            next(new HttpError400("Yêu cầu của bạn không hợp lệ"))
        }else{
            next();
        }
    }
}

module.exports.Validate = Validate;