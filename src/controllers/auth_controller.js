const {AdminUser, ProtectedAdmin}       = require('../models/mysql')
const {HttpError, HttpError404}         = require('../utils/errors')
const jwt                               = require('jsonwebtoken')
const config                            = require('../config');
const { Buffer }                        = require('node:buffer');
const uuid                              = require('uuid');

class AuthController{
    /* [GET] render login page */
    renderLogin(req, res, next){
        res.locals.noRenderHeader = true
        res.render('pages/site/login', {'error_msg': ""})
    }

    /* [GET] render register page */
    renderRegister(req, res, next){
        res.locals.noRenderHeader = true
        res.render('pages/site/register', {'error_msg': ""})
        
    }

    /* [POST] handle register */
    async registerAdmin(req, res, next){
        try {
            const {email, password, username} = req.body;
            const id = Buffer.from(uuid.parse(uuid.v4(), Buffer.alloc(16)), Buffer.alloc(16))
            await AdminUser.create({
                user_id : id, username, email, hashed_password : password,
            })
            res.redirect('/auth/login')
        } catch (error) {
            next(new HttpError(409, "Username hoặc Email đã tồn tại"))
        }
    }

    /* [POST] tạo JWT sau khi được middleware passport-local xử lí và xác thực thành công */
    async loginAdmin(req, res, next){
        try {
            const {user}=req
            const {user_uuid} =user
            
            const JWT = jwt.sign({
                sub: user_uuid,
            }, config.secret_key.jwt , {expiresIn: config.jwt.exp, issuer: 'farmstay_admin'})

            let REFESH_JWT;

            let error, payload;
            // Xác thực jwt
            jwt.verify(user.refesh_token, config.secret_key.jwt_refesh,{ issuer: config.jwt.issuer }, (err, decode)=>{
                error = err;
                payload = decode
            })
            
            if(user.refesh_token==null || user.refesh_token=="" || error){
                // console.log(error)
                REFESH_JWT = jwt.sign({
                    sub: user_uuid,
                }, config.secret_key.jwt_refesh, {expiresIn: config.jwt.refesh_exp, issuer: 'farmstay_admin'})
                user.refesh_token = REFESH_JWT;
                await user.save();
            }else{
                REFESH_JWT = user.refesh_token;
            }
            
            res.cookie('jwt',JWT);
            res.cookie('jwt_refesh',REFESH_JWT);
            res.status(200).redirect('/')

        } catch (error) {
            console.log(error)
            next(new HttpError(401, "Không thể đăng nhập"))
        }
    }


    /**
     * [GET] Đăng xuất
     */
    async logout(req, res, next){
        
        if (req && req.cookies){
            res.clearCookie("jwt");
            res.clearCookie("jwt_refesh");
        }
        res.status(200).redirect('/auth/login')
    }

}

module.exports = new AuthController()