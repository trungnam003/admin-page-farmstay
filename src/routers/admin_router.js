const Router                        = require("express").Router();
const AdminController                = require('../controllers/admin_controller')
const {HttpError, HttpError404}     = require('../utils/errors')
const {authorization}               = require('../middlewares/auths/authorization')
const {authenticateJWT}             = require('../middlewares/auths/authenticate.jwt')

Router
.route('/me')
.get(
    authenticateJWT,
    AdminController.getDetail
)
.all((req, res, next)=>{
    next(new HttpError(405))
});


Router
.route('/me/edit/upload-avatar')
.get(
    authenticateJWT,
    AdminController.renderUploadAvatar
)
.post(
    authenticateJWT,
    AdminController.uploadAvatar
)
.all((req, res, next)=>{
    next(new HttpError(405))
}
);

Router
.route('/me/active/:token')
.put(
    AdminController.verifyActive
)
.all((req, res, next)=>{
    next(new HttpError(405))
}
);

Router
.route('/me/active')
.get(
    authenticateJWT,
    AdminController.active
)
.all((req, res, next)=>{
    next(new HttpError(405))
}
);


module.exports = Router;