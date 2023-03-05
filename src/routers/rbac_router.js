const Router                                = require("express").Router();
const RbacController                        = require('../controllers/rbac_controller')
const {HttpError, HttpError404}             = require('../utils/errors')
const {authorization}                       = require('../middlewares/auths/authorization')
const {Validate, validateParam,
    validateBody, validateQuery}            = require('../middlewares/validates');
const {authenticateJWT}                     = require('../middlewares/auths/authenticate.jwt')

Router.route('/').all(authenticateJWT)
.get(
    RbacController.renderManageRBAC
)
.all((req, res, next)=>{
    next(new HttpError(405))
});

Router.route('/api').all(authenticateJWT)
.post(
    RbacController.createAPI
)
.put(
    RbacController.editAPI
)
.delete(
    RbacController.deleteAPI
)
.all((req, res, next)=>{
    next(new HttpError(405))
});

Router.route('/permission').all(authenticateJWT)
.post(
    RbacController.createPermission
)
.put(
    RbacController.editPermission
)
.delete(
    RbacController.deletePermission
)
.all((req, res, next)=>{
    next(new HttpError(405))
});

Router.route('/role/:id').all(authenticateJWT)
.get(
    RbacController.detailRole
)
.put(
    RbacController.editRole
)
.all((req, res, next)=>{
    next(new HttpError(405))
});

Router.route('/role').all(authenticateJWT)
.post(
    RbacController.createRole
)
.delete(
    RbacController.deleteRole
)
.all((req, res, next)=>{
    next(new HttpError(405))
});


module.exports = Router;