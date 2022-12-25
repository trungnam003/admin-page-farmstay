const {AdminUser, protectedAdmin}       = require('../../models/mysql')
const {HttpError, HttpError404}         = require('../../utils/errors')
require('dotenv').config();

async function authenticateLocal(req, res, next){
    try {
        const {email, password} = req.body;
        const user = await AdminUser.findOne({
            where:{email: email},
            attributes: ['userId', 'userUUID', 'email', 'username', 'hashpassword'],
        });
        if(!user){
            
            next(new HttpError(401, 'Tài khoản không tồn tại'))
        }else{
            const isAuth = await user.validatePassword(password);
            if(isAuth){
                
                req.user = user
                next()
            }else{
                
                next(new HttpError(401, 'Sai mật khẩu'))
            }
        }
    } catch (error) {
        next(new HttpError(500))
    }
}

module.exports = {
    authenticateLocal,
}