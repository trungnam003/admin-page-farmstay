const {AdminUser, protectedAdmin}       = require('../../models/mysql')
const {HttpError, HttpError404}         = require('../../utils/errors')
const jwt                               = require('jsonwebtoken')
                                        require('dotenv').config();
const { Buffer }                        = require('node:buffer');
const uuid                              = require('uuid');

const verify = async function(req, res, next){
    let token = null;
    
    if (req && req.cookies){
        token = req.cookies['jwt'];
    }

    if(!token){
        return next(new HttpError(401))
    }

    let error, payload;
    
    jwt.verify(token, process.env.JWT_SECRET_KEY,{ issuer: 'farmstay_admin'}, (err, decode)=>{
        error = err;
        payload = decode
    })
    
    if(error instanceof jwt.TokenExpiredError){
        req.refesh = true
        
        return next()
    }else if(error){
       
        return next(error);
    }
    
    const id = Buffer.from(uuid.parse(payload.sub, Buffer.alloc(16)), Buffer.alloc(16))
    const user = await AdminUser.findOne({
        where:{userId: id},
        attributes: ['userId', 'userUUID', 'email', 'username', 'avatar_url', 'status', 'isActive'],
        include:[
            {
                model: protectedAdmin,
                as: 'protectedAdmin',
                attributes: ['isSuperAdmin'],
            }]
    });
    
    if(!user){
        return next(new HttpError(401, 'Tài khoản không tồn tại'))
    }else{
        req.user = user;
        
        return next();
    }
    
}


const refesh = async function(req, res, next){
    if(req.refesh){
        
        delete req.refesh
        let token_rf = null
        if (req && req.cookies){
            token_rf = req.cookies['jwt_refesh'];
        } 

        if(!token_rf){
            return next(HttpError(401));
        }

        let err_rf, payload_rf;
        
        jwt.verify(token_rf, process.env.JWT_REFESH_SECRET_KEY,{ issuer: 'farmstay_admin'}, (err, decode)=>{
            err_rf = err;
            payload_rf = decode
        });
        
        if(err_rf){
            return next(new HttpError(401, "HET HAN DANG NHAP"))
        }else{
            const {sub} = payload_rf
            const id = Buffer.from(uuid.parse(sub, Buffer.alloc(16)), Buffer.alloc(16))
            
            const user = await AdminUser.findOne({
                where:{userId: id},
                attributes: ['userId', 'userUUID', 'email', 'username', 'avatar_url', 'status', 'isActive', 'refeshToken'],
                include:[
                    {
                        model: protectedAdmin,
                        as: 'protectedAdmin',
                        attributes: ['isSuperAdmin'],
                    }]
            });
            
            if(user.refeshToken == token_rf){
                
                req.user = user;
                const JWT = jwt.sign({
                    sub: user.userUUID,
                }, process.env.JWT_SECRET_KEY, {expiresIn: 60*30, issuer: 'farmstay_admin'})
                res.clearCookie("jwt");
                res.cookie('jwt',JWT);
                return next();
            }else{
                return next(new HttpError(401))
            }
        }
        
    }else{
       return next();
    }
}

module.exports.authenticateJWT = [verify, refesh]