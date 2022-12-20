const passport = require('passport')
const {HttpError, HttpError404} = require('../../utils/errors')

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