const Router                            = require("express").Router();
const FarmstayController                = require('../controllers/farmstay.controller')
const {HttpError, HttpError404}         = require('../utils/errors')
const {authorization}                   = require('../middlewares/auths/authorization')
const {authenticateJWT}                 = require('../middlewares/auths/authenticate.jwt')
const {uploadMultiImage}                = require('../middlewares/uploads/upload.image');
const {validateParam, validateQuery,
     validateBody, Validate}            = require('../middlewares/validates')

/**
 * 
 */
Router.route('/create').all(authenticateJWT)
.get(
    
    FarmstayController.renderCreateFarmstay
)
.post(
    uploadMultiImage({type:'farmstay', quantity: 10,}),
    validateBody({
        farmstay_name: Validate.isString(),
        rent_cost: Validate.isNumber(),
        equipments: Validate.isString(),
        link_embedded_ggmap: Validate.isString({require: false}).allow(''),
        link_ggmap: Validate.isString({require: false}).allow(''),
        ward_code: Validate.isString(),
        description: Validate.isString({require: false}).allow(''),
        manager_id: Validate.isNumber(),
    }),
    FarmstayController.createFarmstay
)
.all((req, res, next)=>{
    next(new HttpError(405))
});

/**
 * 
 */
Router.route('/trash').all(authenticateJWT)
.get(
    FarmstayController.renderTrashFarmstay
)
.put(
    validateBody({
        id: Validate.isNumber()
    }),
    FarmstayController.restoreFarmstay
)
.delete(
    validateQuery({
        farmstay_id: Validate.isNumber().min(1),
    }),
    FarmstayController.deleteForceFarmstay
)
.all((req, res, next)=>{
    next(new HttpError(405))
});
/**
 * 
 */
Router.route('/api/get_districts')
.get(
    FarmstayController.getAllDistrictOfProvince
)
.all((req, res, next)=>{
    next(new HttpError(405))
});
/**
 * 
 */
Router.route('/api/get_wards')
.get(
    FarmstayController.getAllWardOfDistrict
)
.all((req, res, next)=>{
    next(new HttpError(405))
});

/**
 * 
 */
Router.route('/').all(authenticateJWT)
.get(
    FarmstayController.renderFarmstays
)
.delete(
    validateQuery({farmstay_id: Validate.isNumber().min(1)}),
    
    FarmstayController.deleteFarmstayById
)
.all((req, res, next)=>{
    next(new HttpError(405))
});


module.exports = Router;