const {AdminUser} = require('../models')
const {HttpError, HttpError404} = require('../utils/errors')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { Buffer } = require('node:buffer');
const uuid = require('uuid');

class AuthController{
    /* [GET] render login page */
    renderLogin(req, res, next){
        res.locals.noRenderHeader = true
        res.render('pages/site/login', {'error_msg': req.flash('error_msg')})
    }

    /* [GET] render register page */
    renderRegister(req, res, next){
        res.locals.noRenderHeader = true
        res.render('pages/site/register')
        
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
            console.log(error)
            next(new HttpError(400))
        }
        
        
    }

    /* [POST] tạo JWT sau khi được middleware passport-local xử lí và xác thực thành công */
    async loginAdmin(req, res, next){
        try {
            const {userUUID} = req.user;
            const JWT = jwt.sign({
                iss: 'farmstay_admin',
                sub: userUUID,
            }, process.env.JWT_SECRET_KEY, {expiresIn: 60*60*24})
            
            res.cookie('jwt', JWT);
            res.status(200).redirect('/')

        } catch (error) {
            next(new HttpError(500))
        }
        
    }

    async logout(req, res, next){
        
        if (req && req.cookies){
            res.clearCookie("jwt");
        }
        res.status(200).redirect('/auth/login')
        
    }

    // async uploadAvatar(req, res, next){
    //     const user = req.user;
        
    //     if(user.avatar_url){
    //         const filename_avatar = user.avatar_url.split('/').at(-1)
    //         const pathImg = path.join(public_path, 'uploads', 'avatar', filename_avatar)
    //         try {
    //             await fs.unlink(pathImg);
    //         } catch (error) {
                
    //         }
    //     }
    //     const uploadImg = uploadImage('avatar',user.username);
    //     uploadImg(req, res, async(err)=>{
                
    //         if (err instanceof multer.MulterError) {
    //             res.status(403).json(err)
    //         } else if (err) {
    //             res.status(400).json(err)
    //         } else{
    //             try {
    //                 const {filename} = req.file
    //                 console.log(req.file)
    //                 user.avatar_url = "/uploads/avatar/"+filename
    //                 await user.save();
    //                 res.status(200).json(user)
    //             } catch (error) {
                    
    //             }
                
    //         }
    //     })
    // }
}

module.exports = new AuthController()