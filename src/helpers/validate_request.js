const Joi = require('@hapi/joi');


/**
 * 
 * @param {object} source object cần được validate vd req.params, req.body, req.query
 * @param {object} target object chứa các key value, key là property của source cần validate - value là loại validate cho key
 * @param {string} target.key
 * @param {object} target.value
 * 
 */
function Validate(source, target){
    let objSource = {};
    const objs = Object.keys(target).reduce((obj, key)=>{
        objSource[key] = source[key]
        return {[key]: target[key], ...obj}
    }, {})
    const SCHEMA = Joi.object().keys(objs)
    const {error, value} = SCHEMA.validate(objSource);
    return {error, value}
}


Validate.isString = function(){
    return Joi.string().required();
}
Validate.isNumber = function(){
    return Joi.number().required();
}
Validate.isEmail = function(){
    return Validate.isString().email();
}
Validate.isUsername = function(){
    return Validate.isString().regex(/^[A-Za-z][A-Za-z0-9]*(?=[a-zA-Z0-9._]{3,120}$)(?!.*[_.]{2})[^_.].*[^_.]$/);
}


// const req = {};
// req.body = {
//     email: 'thtntrungnam@gmail.com',
//     username: 'tutunana123',
//     test: '12'
// }
// Validate(req.body, {
//     'email': Validate.isEmail(),
//     'username': Validate.isUsername(),
//     'test': Validate.isNumber()
// });

module.exports = {
    Validate,
}

