const Router = require("express").Router();
const AuthController = require('../controllers/auth.controller')
const {HttpError, HttpError404} = require('../utils/errors')
const passport = require('passport')
const {passportJWT, passportLocal} = require('../middlewares/auths/authenticate.passport')

Router
.route('/login')
.get(AuthController.renderLogin)
.post(passportLocal,
    (req,res,next)=>{
        res.json(req.user)
    }
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


Router.route('/test')
.get(
    passportJWT,
    async (req, res, next)=>{
        res.json(req.user)
    }
)


module.exports = Router