const Router                        = require("express").Router();
const FarmstayController            = require('../controllers/farmstay.controller')
const {HttpError, HttpError404}     = require('../utils/errors')
const {authorization}               = require('../middlewares/auths/authorization')
const {authenticateJWT}             = require('../middlewares/auths/authenticate.jwt')

Router
.route('/create')
.get(
    FarmstayController.renderCreateFarmstay
)
.post(
    FarmstayController.createFarmstay
)
.all((req, res, next)=>{
    next(new HttpError(405))
});

Router
.route('/api/gettest')
.get(
    FarmstayController.getAllProvince
)
.all((req, res, next)=>{
    next(new HttpError(405))
});

Router
.route('/api/get_districts')
.get(
    FarmstayController.getAllDistrictOfProvince
)
.all((req, res, next)=>{
    next(new HttpError(405))
});

Router
.route('/api/get_wards')
.get(
    FarmstayController.getAllWardOfDistrict
)
.all((req, res, next)=>{
    next(new HttpError(405))
});

module.exports = Router;