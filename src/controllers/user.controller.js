const {uploadImage} = require('../middlewares/uploads/upload.image')
const multer = require("multer");
const sharp = require('sharp')
const {public_path} = require('../path_file')
const fs = require('node:fs/promises');
const path = require("path");
const {HttpError, HttpError404} = require('../utils/errors')
class UserController{
    /**
     * [GET] render page user detail 
     * @param {*} req Request
     * @param {*} res Response
     * @param {*} next NextFunction
     * 
     */
    getDetail(req, res, next){
        const {email, username, isActive, status, avatar_url,protectedAdmin} = req.user
        const isSuperAdmin = protectedAdmin === null ? false:true;
        res.render('pages/users/me', {email, username, isActive, status, avatar_url, isSuperAdmin})
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
                next(HttpError(500))
            } else if (err) {
                next(HttpError(500))
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
                    next(HttpError(500))
                }
                
            }
        })
    }
}

module.exports = new UserController