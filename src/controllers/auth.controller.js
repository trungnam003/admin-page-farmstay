const {AdminUser, protectedAdmin}       = require('../models/mysql')
const {HttpError, HttpError404}         = require('../utils/errors')
const jwt                               = require('jsonwebtoken')
                                        require('dotenv').config();
const { Buffer }                        = require('node:buffer');
const uuid                              = require('uuid');

class AuthController{
    /* [GET] render login page */
    renderLogin(req, res, next){
        res.locals.noRenderHeader = true
        res.render('pages/site/login', {'error_msg': req.flash('error_msg')})
    }

    /* [GET] render register page */
    renderRegister(req, res, next){
        res.locals.noRenderHeader = true
        res.render('pages/site/register', {'error_msg': req.flash('error_msg')})
        
    }

    /* [POST] handle register */
    async registerAdmin(req, res, next){
        try {
            const {email, password, username} = req.body;
            const id = Buffer.from(uuid.parse(uuid.v4(), Buffer.alloc(16)), Buffer.alloc(16))
            const userCreated = await AdminUser.create({
                userId : id, username, email, hashpassword : password,
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
            const {userUUID} =user
            
            const JWT = jwt.sign({
                sub: userUUID,
            }, process.env.JWT_SECRET_KEY, {expiresIn: 60*30, issuer: 'farmstay_admin'})

            let REFESH_JWT;
            if(user.refeshToken){
                REFESH_JWT = jwt.sign({
                    sub: userUUID,
                }, process.env.JWT_REFESH_SECRET_KEY, {expiresIn: 60*60*24, issuer: 'farmstay_admin'})
                user.refeshToken = REFESH_JWT;
                await user.save();
            }else{
                REFESH_JWT = user.refeshToken;
            }
            
            res.cookie('jwt',JWT);
            res.cookie('jwt_refesh',REFESH_JWT);
            res.status(200).redirect('/')

        } catch (error) {
            console.log(error)
            next(new HttpError(400))
        }
    }



    async logout(req, res, next){
        
        if (req && req.cookies){
            res.clearCookie("jwt");
        }
        res.status(200).redirect('/auth/login')
        
    }

}

module.exports = new AuthController()