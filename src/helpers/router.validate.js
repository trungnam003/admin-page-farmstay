const Joi = require('@hapi/joi');

const validateParam = (schema, obj, cb)=>{
    const result = schema.validate(obj);
    const {error, value} = result;
    if(error) return cb(error, undefined);
    return cb(undefined, value);
}

const regex = {};
regex.username = /^[A-Za-z][A-Za-z0-9]*(?=[a-zA-Z0-9._]{3,120}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

const validates = {};
validates.uuid = Joi.string().guid({version: ['uuidv4','uuidv5','uuidv3',]}).required();
validates.email = Joi.string().email().required();
validates.username = Joi.string().regex(regex['username']).required();

const schemaValidates = {};
schemaValidates.uuid = Joi.object().keys({
    uuid: validates['uuid']
});

schemaValidates.email = Joi.object().keys({
    email: validates['email']
});

schemaValidates.username = Joi.object().keys({
    username: validates['username']
});

module.exports = {
    validateParam, schemaValidates, validates
}