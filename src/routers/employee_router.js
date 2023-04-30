const Router                                = require("express").Router();
const EmployeeController                   = require('../controllers/employee_controller')
const {HttpError, HttpError404}             = require('../utils/errors')
const {authorization}                       = require('../middlewares/auths/authorization')
const {authenticateJWT}                     = require('../middlewares/auths/authenticate.jwt')
const {Validate, validateParam,
    validateBody, validateQuery}            = require('../middlewares/validates')

const config                                = require('../config')

Router.route('/', ).all(authenticateJWT)
.get(
    EmployeeController.renderListEmployee
)
.post(
    EmployeeController.createEmployee
)
.all((req, res, next)=>{
    
    next(new HttpError(405))
});


module.exports = Router;