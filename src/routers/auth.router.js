const Router = require("express").Router();
const AuthController = require('../controllers/auth.controller')
const {HttpError, HttpError404} = require('../utils/errors')
const {passportJWT, passportLocal} = require('../middlewares/auths/authenticate.passport')
const {authorization} = require('../middlewares/auths/authorization')

Router
.route('/login')
.get(AuthController.renderLogin)
.post(
    passportLocal,
    AuthController.loginAdmin
)
.all((req, res, next)=>{
    next(new HttpError(405))
})

Router
.route('/register')
.get(AuthController.renderRegister)
.post(AuthController.registerAdmin)
.all((req, res, next)=>{
    next(new HttpError(405))
})

Router
.route('/logout')
.get(AuthController.logout)
.all((req, res, next)=>{
    next(new HttpError(405))
})

// Router.route('/test')
// .get(
//     passportJWT, authorization,
//     async (req, res, next)=>{
        
//         res.json(req.user)
//     }
// )
// Router.route('/up')
// .post(
//     passportJWT,
//     AuthController.uploadAvatar
// )


module.exports = Router