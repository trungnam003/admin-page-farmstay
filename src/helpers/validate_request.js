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
        /**
         * ==> Tách các key cần validate trong source và gán chúng Schema tương ứng
         * Lấy list keys của target cần validate
         * Sau đó reduce:
         * Lấy các key cần validate trong source bỏ qua các key không cần validate
         * Sau đó gán Schema key validate cho key được bóc ra
         */
        objSource[key] = source[key]
        return {[key]: target[key], ...obj}
    }, {})
    // Tiến hành validate
    const SCHEMA = Joi.object().keys(objs)
    const {error, value} = SCHEMA.validate(objSource);
    return {error, value}
}


Validate.isString = function({require=true}={}){
    let validate = Joi.string();
    if(require){
        
        return validate.required();
    }
    return validate.optional();
}
Validate.isNumber = function({require=true}={}){
    let validate = Joi.number();
    if(require){
        return validate.required();
    }
    return validate.optional();
}
Validate.isEmail = function({require=true}={}){
    
    let validate = Validate.isString(
        {require: require?true:false}
    ).email();

    return validate;
    
}
Validate.isUsername = function({require=true}={}){
    let validate = Validate.isString(
        {require: require?true:false}
    ).regex(/^[A-Za-z][A-Za-z0-9]*(?=[a-zA-Z0-9._]{3,120}$)(?!.*[_.]{2})[^_.].*[^_.]$/);
    
    return validate;
}


// const req = {};
// req.body = {
//     email: 'thtntrungnamgmail.com',
//     username: 'tutunana123',
//     test: '12'
// }
// const a = Validate(req.body, {
//     'email': Validate.isEmail({require: false}),
//     // 'username': Validate.isUsername(),
//     // 'test': Validate.isNumber()
// });
// console.log(a)
module.exports = {
    Validate,
}

