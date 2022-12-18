// const passports = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const localStrategy = require('passport-local').Strategy
const {ExtractJwt} = require('passport-jwt')
require('dotenv').config();
const {AdminUser} = require('../models')
const { Buffer } = require('node:buffer');
var uuid = require('uuid');
const uuidBuffer = require('uuid-buffer');
const {HttpError, HttpError404} = require('../utils/errors')
const jwt = require('jsonwebtoken')

const cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) token = req.cookies['jwt'];
    return token;
};
async function passportConfig(passport){
    passport.use(new jwtStrategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET_KEY
    }, async (payload, done)=>{
        try {
            const id = Buffer.from(uuid.parse(payload.sub, Buffer.alloc(16)), Buffer.alloc(16))
            const user = await AdminUser.findOne({
                where:{userId: id},
                
            });
            if(user===null){
                done(new HttpError(401), false);
            }else{
                done(null,user);
            }
        } catch (error) {
            done(new HttpError404(), false);
        }
    }
    ));
    passport.use(new localStrategy({
        usernameField: 'email',
    }, async (email, password, done)=>{
        try {
            const user = await AdminUser.findOne({
                where:{email: email},
            });
            if(!user){
                return done(null, false);
            }else{
                const isAuth = await user.validatePassword(password);
                if(isAuth){
                    return done(null, user)
                }else{
                    return done(null, false)
                }
            }
        } catch (error) {
            return done(null, false)
        }
        
    }))
}


module.exports = passportConfig