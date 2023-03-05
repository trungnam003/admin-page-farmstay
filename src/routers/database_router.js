const Router                                = require("express").Router();
const DatabaseController                   = require('../controllers/database_controller')
const {HttpError, HttpError404}             = require('../utils/errors')
const {authorization}                       = require('../middlewares/auths/authorization')
const {Validate, validateParam,
    validateBody, validateQuery}            = require('../middlewares/validates');
const {authenticateJWT}                     = require('../middlewares/auths/authenticate.jwt')


Router.route('/mysql', ).all(authenticateJWT)
.get(
    DatabaseController.renderMysql
)
.all((req, res, next)=>{
    next(new HttpError(405))
});


module.exports = Router;


