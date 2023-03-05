const {HttpError, HttpError404,HttpError401, HttpError409, HttpError400} = require('../../utils/errors')
const jwt = require('jsonwebtoken')

function handleJWT(err, req, res, next){
  if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.NotBeforeError){
    next(new HttpError401())
  }
  next(err);
}

function handleHttpError400(err, req, res, next){
  if(err instanceof HttpError400 || err.statusCode ==400){
    res.locals.noRenderHeader = true
    res.status(err.statusCode).render(`pages/errors/${err.statusCode+'_'+err.nameError}`,);
    return;
  }
  return next(err);
}

function handleHttpError401(err, req, res, next){
  if(err instanceof HttpError401 || err.statusCode ==401){
    res.status(302).redirect('/auth/login')
    return;
  }
  return next(err);
}

function handleHttpError409(err, req, res, next){
  if(err instanceof HttpError409 || err.statusCode ==409){
    res.status(302).redirect('/auth/register')
    return;
  }
  return next(err);
}
function handleHttpError500(err, req, res, next){
  if(err instanceof HttpError && err.statusCode ==500){
    res.locals.noRenderHeader = true
    res.status(err.statusCode).render(`pages/errors/${err.statusCode+'_'+err.nameError}`,);
    return;
  }
  return next(err);
}

function handleHttpErrorDefault(err, req, res, next){
    if(err instanceof HttpError){
      res.locals.noRenderHeader = true
      res.status(err.statusCode).render(`pages/errors/${err.statusCode+'_'+err.nameError}`,);
    }else{
      res.status(500).json("500 - Lỗi Server")
      
    }
    
}

const listArrayHandleError = [handleJWT, handleHttpError400, handleHttpError401, handleHttpError409,handleHttpError500, handleHttpErrorDefault, ];
module.exports = listArrayHandleError
