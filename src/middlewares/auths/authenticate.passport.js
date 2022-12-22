const passport = require('passport')
const {HttpError, HttpError404} = require('../../utils/errors')

// Xác thực người dùng bằng JWT cookie
module.exports.passportJWT = async (req, res, next)=>{
    passport.authenticate('jwt', {session:false}, (err, user, msg)=>{
        
        if(err || !user){
            
            if(err instanceof HttpError){
                req.flash('error_msg', err.messageResponse)
                return next(err);
            }else{
            
                return next(new HttpError(401));
            }
           
        }else{
            req.user = user;
            return next();
        }
        
    })(req, res, next);
}

// Xác thực người dùng khi login
module.exports.passportLocal = async (req,res,next)=>{
    passport.authenticate('local', {session: false}, (err, user, msg)=>{
        if(err || !user){
            if(err instanceof HttpError){
                req.flash('error_msg', err.messageResponse)
                return next(err);
            }
            return next(new HttpError(401));
        }else{
            req.user = user;
            return next();
        }
    })(req, res, next);
}