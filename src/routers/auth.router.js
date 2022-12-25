const Router                        = require("express").Router();
const AuthController                = require('../controllers/auth.controller')
const {HttpError, HttpError404}     = require('../utils/errors')
const {authenticateLocal} = require('../middlewares/auths/authenticate.local')

Router
.route('/login')
.get(AuthController.renderLogin)
.post(
    authenticateLocal,
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




module.exports = Router