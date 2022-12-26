const Router                        = require("express").Router();
const UserController                = require('../controllers/user.controller')
const {HttpError, HttpError404}     = require('../utils/errors')
const {authorization}               = require('../middlewares/auths/authorization')
const {authenticateJWT}             = require('../middlewares/auths/authenticate.jwt')

Router
.route('/me')
.get(
    authenticateJWT,
    UserController.getDetail
)
.all((req, res, next)=>{
    next(new HttpError(405))
});


Router
.route('/me/edit/upload-avatar')
.get(
    authenticateJWT,
    UserController.renderUploadAvatar
)
.post(
    authenticateJWT,
    UserController.uploadAvatar
)
.all((req, res, next)=>{
    next(new HttpError(405))
}
);

Router
.route('/me/active/:token')
.put(
    UserController.verifyActive
)
.all((req, res, next)=>{
    next(new HttpError(405))
}
);

Router
.route('/me/active')
.get(
    authenticateJWT,
    UserController.active
)
.all((req, res, next)=>{
    next(new HttpError(405))
}
);


module.exports = Router;