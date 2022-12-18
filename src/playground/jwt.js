const jwt = require('jsonwebtoken')
const url = require('url');   
require('dotenv').config();

function generateJWT(argsJWT){
    const payload = {...argsJWT};
    return jwt.sign({
        iss: 'farmstay_admin',
        ...payload,
    }, process.env.JWT_SECRET_KEY, {expiresIn: 60*60*24})

}
console.log(generateJWT({username: "trungnam", userid:'1ahgduh'}))