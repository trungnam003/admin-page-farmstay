const {AdminUser} = require('../models')
const {HttpError, HttpError404} = require('../utils/errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config();


function generateJWT(...args){
    console.log(args)
}

class AuthController{
    /* [GET] */
    renderLogin(req, res, next){
        res.locals.noRenderHeader = true
        res.render('pages/site/login', {'error_msg': req.flash('error_msg')})
        
    }

    /* [GET] */
    renderRegister(req, res, next){
        res.locals.noRenderHeader = true
        res.render('pages/site/register')
        
    }

    /* [POST] */
    async registerAdmin(req, res, next){
        try {
            const {email, password, username} = req.body;

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const userCreated = await AdminUser.create({
                username, email, hashpassword : hashPassword,
            })
            res.redirect('/auth/login')
        } catch (error) {
            next(new HttpError(400))
        }
        
        
    }

    /* [POST] */
    async loginAdmin(req, res, next){
        try {
            const {email, password} = req.body;
            const user = await AdminUser.findOne({
                where: {email},
                attributes: ['userId', 'userUUID', 'email', 'username','hashpassword']
            })

            if(user === null){
                req.flash('error_msg', 'Tài khoản của bạn không tồn tại')
                res.locals.msg = '123'
                res.status(302).redirect('back')
            }else{
                
                const isAuth = await user.validatePassword(password);
                if(isAuth){
                    const JWT = jwt.sign({
                        iss: 'farmstay_admin',
                        sub: user.userUUID,
                    }, process.env.JWT_SECRET_KEY, {expiresIn: 60*60*24})
                    
                    res.cookie('jwt', JWT);
                    res.status(200).redirect('/')
                }else{
                    req.flash('error_msg', 'Mật khẩu của bạn không đúng')
                    res.status(302).redirect('back')
                }
                
            }

        } catch (error) {
            next(new HttpError(500))
        }
        
    }
    
}

module.exports = new AuthController()