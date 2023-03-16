const {AdminUser, ProtectedAdmin}       = require('../../models/mysql')
const {HttpError, HttpError404}         = require('../../utils/errors')
const jwt                               = require('jsonwebtoken')
const config                            = require('../../config');
const { Buffer }                        = require('node:buffer');
const uuid                              = require('uuid');


const verify = async function(req, res, next){
    try {
        let token = null;
        // Kiểm tra cookie có jwt hay không
        if (req && req.cookies){
            token = req.cookies['jwt'];
        }
        // Không có jwt next lỗi
        if(!token){
            return next(new HttpError(401))
        }
    
        let error, payload;
        // Xác thực jwt
        jwt.verify(token, config.secret_key.jwt,{ issuer: config.jwt.issuer }, (err, decode)=>{
            error = err;
            payload = decode
        })
        
        
        if(error instanceof jwt.TokenExpiredError){
            // Kiểm tra nếu mã jwt hết hạn thì next qua middleware xác thực jwt refesh
            req.refesh = true
            return next()
        }else if(error){
            // Nếu có lỗi khác thì next cho các middleware xử lí lỗi
            return next(error);
        }
        // Lấy user từ jwt payload
        const id = Buffer.from(uuid.parse(payload.sub, Buffer.alloc(16)), Buffer.alloc(16))
        const user = await AdminUser.findOne({
            where:{user_id: id},
            attributes: ['user_id', 'user_uuid', 'email', 'username', 'avatar_url', 'status', 'is_active'],
            include:[
                {
                    model: ProtectedAdmin,
                    as: 'protected_admin',
                    attributes: ['is_super_admin'],
                }]
        });
        
        if(!user){
            return next(new HttpError(401, 'Tài khoản không tồn tại'))
        }else{
            req.user = user;
            const {avatar_url, username} = user
            res.locals.user = {avatar_url, username};
            return next();
        }
    } catch (error) {
        return next(new HttpError(500, 'Có lỗi xảy ra'))
    }
    
}


const refesh = async function(req, res, next){
    // Kiểm tra nếu có yêu cầu refesh
    try {
        if(req.refesh){
            
            delete req.refesh
            // Lấy jwt refesh từ cookie
            let token_rf = null
            if (req && req.cookies){
                token_rf = req.cookies['jwt_refesh'];
            } 
            if(!token_rf){
                return next(new HttpError(401));
            }
            
            let err_rf, payload_rf;
            // Xác thực jwt refesh
            jwt.verify(token_rf, config.secret_key.jwt_refesh,{ issuer: config.jwt.issuer}, (err, decode)=>{
                err_rf = err;
                payload_rf = decode
            });
            
            if(err_rf){
                // Nếu có lỗi thì yêu cầu đăng nhập lại
                return next(new HttpError(401, "Hết hạn đăng nhập"))
            }else{
                
                // Lấy user từ payload của jwt refesh
                const {sub} = payload_rf
                const id = Buffer.from(uuid.parse(sub, Buffer.alloc(16)), Buffer.alloc(16))
                
                const user = await AdminUser.findOne({
                    where:{user_id: id},
                    attributes: ['user_id', 'user_uuid', 'email', 'username', 'avatar_url', 'status', 'is_active', 'refesh_token'],
                    include:[
                        {
                            model: ProtectedAdmin,
                            as: 'protected_admin',
                            attributes: ['is_super_admin'],
                        }]
                });
                
    
                // kiểm tra user có lưu refesh token giống với token trên cookie không
                if(user.refesh_token == token_rf){
                    // Nếu hợp lệ tạo jwt mới và tiếp tục đăng nhập
    
                    req.user = user;
                    const {avatar_url, username} = user
                    res.locals.user = {avatar_url, username};
                    const JWT = jwt.sign({
                        sub: user.user_uuid,
                    }, config.secret_key.jwt , {expiresIn: config.jwt.exp, issuer:config.jwt.issuer})
                    res.clearCookie("jwt");
                    res.cookie('jwt',JWT);
                    return next();
                }else{
                    
                    return next(new HttpError(401, "Có lỗi xảy ra"))
                }
            }
            
        }else{
           return next();
        }
    } catch (error) {
        return next(new HttpError(500, 'Có lỗi xảy ra'))
    }
}


module.exports.authenticateJWT = [verify, refesh]