require("dotenv").config();
const path = require('node:path')
const {dirname} = require('../../nodepath');

const deepFreeze = (obj) => {
    Object.keys(obj).forEach((property) => {
      if (
        typeof obj[property] === "object" &&
        !Object.isFrozen(obj[property])
      )
        deepFreeze(obj[property]);
    });
    return Object.freeze(obj);
};

const test = {
    _this: dirname,
    toString(){
        return this._this;
    }
}
const createPathObject = function({obj, key, name}){
    if(!name){
        name = key;
    }
    obj[key] =  Object.create(
        Object.getPrototypeOf(test),
        Object.getOwnPropertyDescriptors(test)
    )
    obj[key]._this = path.join(obj._this+'', name)

}

const config = {
    server: {
        port: process.env.PORT,
        host: process.env.SV_HOST,
        env: process.env.NODE_ENV
    },
    secret_key:{
        jwt: process.env.JWT_SECRET_KEY,
        jwt_refesh: process.env.JWT_REFESH_SECRET_KEY,
        cookie: process.env.COOKIE_SECRET_KEY,
        verify_email: process.env.EMAIL_VERIFY_SECRET_KEY,

    },
    email_service: {
        password: process.env.MAIL_PASSWORD,
        username : process.env.MAIL_USERNAME,
        mail_mailer : process.env.MAIL_MAILER,
        host : process.env.MAIL_HOST,
        port : process.env.MAIL_PORT,
        encryption : process.env.MAIL_ENCRYPTION,
        from : process.env.MAIL_FROM, 
        from_name : process.env.MAIL_FROM_NAME,
    },
    jwt: {
        exp : parseInt(process.env.JWT_EXP),
        refesh_exp:  parseInt(process.env.JWT_REFESG_EXP),
        issuer: process.env.JWT_ISSUER,
    },
    __path: Object.create(
        Object.getPrototypeOf(test),
        Object.getOwnPropertyDescriptors(test)
    )
}
const {__path} = config
createPathObject({obj: __path, key: 'app', name:'src'})
createPathObject({obj: __path['app'], key: 'public',})
createPathObject({obj: __path['app']['public'], key: 'uploads',})


deepFreeze(config);



module.exports = config;