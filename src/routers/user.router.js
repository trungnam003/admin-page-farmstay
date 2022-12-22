const Router = require("express").Router();
const UserController = require('../controllers/user.controller')
const {HttpError, HttpError404} = require('../utils/errors')
const {passportJWT, passportLocal} = require('../middlewares/auths/authenticate.passport')
const {authorization} = require('../middlewares/auths/authorization')

Router
.route('/me')
.get(
    passportJWT,
    UserController.getDetail
)
.all((req, res, next)=>{
    next(new HttpError(405))
})

Router
.route('/me/edit/upload-avatar')
.get(
    passportJWT,
    UserController.renderUploadAvatar
)
.post(
    passportJWT,
    UserController.uploadAvatar
)
.all((req, res, next)=>{
    next(new HttpError(405))
})


module.exports = Router;