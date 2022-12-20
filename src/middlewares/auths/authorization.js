const {HttpError, HttpError404} = require('../../utils/errors')

module.exports.authorization = (req, res, next)=>{
    if(req.user.protected && req){
        if (req.user.protected.isSuperAdmin){
            next()
        }
    }else{
        next(new HttpError(401))
    }
}