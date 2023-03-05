const {AdminUser, protectedAdmin}       = require('../../models/mysql')
const {HttpError, HttpError404}         = require('../../utils/errors')


async function authenticateLocal(req, res, next){
    try {
        const {email, password} = req.body;
        const user = await AdminUser.findOne({
            where:{email: email},
            attributes: ['user_id', 'user_uuid', 'email', 'username', 'hashed_password', 'refesh_token'],
        });
        if(!user){
            
            next(new HttpError(401, 'Tài khoản không tồn tại'))
        }else{
            const isAuth = await user.validatePassword(password);
            if(isAuth){
                
                req.user = user
                const {avatar_url, username} = user
                res.locals.user = {avatar_url, username};
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