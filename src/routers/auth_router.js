const Router                        = require("express").Router();
const AuthController                = require('../controllers/auth_controller')
const {HttpError, HttpError404}     = require('../utils/errors')
const {authenticateLocal}           = require('../middlewares/auths/authenticate.local')
const {validateBody, validateParam,
     validateQuery, Validate, Joi}  = require('../middlewares/validates')

Router
.route('/login')
.get(
    AuthController.renderLogin)
.post(
    validateBody({
        email: Validate.isEmail(),
        password: Validate.isString().min(3)
    }),
    authenticateLocal,
    AuthController.loginAdmin
)
.all((req, res, next)=>{
    next(new HttpError(405))
})

Router
.route('/register')
.get(AuthController.renderRegister)
.post(
    validateBody({
        email: Validate.isEmail(),
        password: Validate.isString().min(3),
        username: Validate.isUsername()
    }),
    AuthController.registerAdmin
)
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