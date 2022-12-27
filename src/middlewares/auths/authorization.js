const {HttpError, HttpError404} = require('../../utils/errors')

// Phân quyền cho super admin
module.exports.authorization = (req, res, next)=>{
    if(req.user.protected_admin && req){
        if (req.user.protected_admin.is_super_admin){
            next()
        }
    }else{
        next(new HttpError(401))
    }
}