const {uploadImage}                     = require('../middlewares/uploads/upload.image')
const multer                            = require("multer");
const sharp                             = require('sharp')
const {public_path}                     = require('../path_file')
const fs                                = require('node:fs/promises');
const path                              = require("path");
const {HttpError, HttpError404}         = require('../utils/errors')
const {AdminUser, }                     = require('../models/mysql')
const {sendMail}                        = require('../services/nodemailer.service')
const {htmlContentEmail}                = require('../services/email.temp')
const CryptoJS                          = require("crypto-js");
const AES                               = require("crypto-js/aes");
                                        require('dotenv').config();

class UserController{
    /**
     * [GET] render page user detail 
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next NextFunction
     * 
     */
    getDetail(req, res, next){
        const {email, username, is_active, status, avatar_url,protected_admin} = req.user
        const is_super_admin = protected_admin === null ? false:true;
        res.render('pages/users/me', {email, username, is_active, status, avatar_url, is_super_admin})
    }

    /**
     * [GET] render page upload avatar
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    renderUploadAvatar(req, res, next){
        res.render('pages/users/upload_avatar')
    }

    /**
     * [POST] Xử lí form upload avatar xử lí ảnh, lưu ảnh local và database
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async uploadAvatar(req, res, next){
        
        const user = req.user;
        
        const uploadImg = uploadImage('avatar',user.username);
        uploadImg(req, res, async(err)=>{
            // Sau khi gọi middleware của multer mới truy cập đến form kiểu multipart/form-data
            if(!req.file){
                return next(new HttpError(400))
            }
            if (err instanceof multer.MulterError) {
                next(new HttpError(500))
            } else if (err) {
                next(new HttpError(500))
            } else{
                try {
                    const {buffer} = req.file
                    
                    let {x, y, height, width} = req.body;
                    x = parseInt(x)
                    y = parseInt(y)
                    height = parseInt(height)
                    width = parseInt(width)

                    const uniqueSuffix = Date.now() + '-' + user.username
                    const filename = uniqueSuffix+'-'+req.file.fieldname+'.'+req.file.originalname.split('.').at(-1)
                    await sharp(buffer)
                    .extract({ left: x, top: y, width: width, height: height })
                    .resize(500, 500)
                    .toFile('./src/public/uploads/avatar/'+filename)
                    
                    if(user.avatar_url){
                        
                        const filename_avatar = user.avatar_url.split('/').at(-1)
                        const pathImg = path.join(public_path, 'uploads', 'avatar', filename_avatar)
                        try {
                            await fs.unlink(pathImg);
                        } catch (error) {
                            
                        }
                    }
                    user.avatar_url = "/uploads/avatar/"+filename
                    await user.save();
                    res.status(200).redirect('/user/me')
                } catch (error) {
                    next(new HttpError(500))
                }
                
            }
        })
    }

    /**
     * [GET] Controller Active User using email
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    async active(req, res, next){
        // Encrypt
        const {user} = req;
        if(user.is_active){
            return res.status(200).redirect('/')
        }else{
            const {email} = user
            let payload = {
                email: email,
                exp: Date.now()+10*60*1000,
            }
            payload =  JSON.stringify(payload);
            let ciphertext = AES.encrypt(payload, process.env.EMAIL_VERIFY_SECRET_KEY).toString();
            ciphertext = encodeURIComponent(ciphertext);

            let html = htmlContentEmail(`http://192.168.56.101:8888/user/me/active/${ciphertext}?_method=PUT`)
            await sendMail(req.user.email,"Kích hoạt tài khoản AdminFarmstay", html);
            
            res.status(200).render('pages/site/active_user')
        }
        
    }
    /**
     * [PUT] Controller verify mail active
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    async verifyActive(req, res, next){

        try {
            let {token} = req.params
            token = decodeURIComponent(token);
            const bytes  = AES.decrypt(token, process.env.EMAIL_VERIFY_SECRET_KEY);
            
            let payload = bytes.toString(CryptoJS.enc.Utf8);

            if(payload==""){
                return next(new HttpError(400))
            }

            const {email, exp} = JSON.parse(payload)
            if(exp<=Date.now()){
                res.status(410).send('Token đã hết hạn');
            }else{
                const user = await AdminUser.findOne({where: {email}});
                if(user){
                    user.is_active = true;
                    await user.save();
                    res.redirect('/')
                }else{
                    return next(new HttpError(400))
                }
               
            }
            
        } catch (error) {
            next(new HttpError(400))
        }
    }
}

module.exports = new UserController