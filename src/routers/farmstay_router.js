const Router                            = require("express").Router();
const editRouter                            = require("express").Router({mergeParams: true});
const FarmstayController                = require('../controllers/farmstay_controller')
const {HttpError, HttpError404}         = require('../utils/errors')
const {authorization}                   = require('../middlewares/auths/authorization')
const {authenticateJWT}                 = require('../middlewares/auths/authenticate.jwt')
const {uploadMultiImage, uploadSingleImage}                = require('../middlewares/uploads/upload.image');
const {validateParam, validateQuery,
     validateBody, Validate, Joi}            = require('../middlewares/validates');
const {pagination} = require('../middlewares/handlebarHelper')

/**
 * 
 */
Router.use('/edit/:id', editRouter);
editRouter.use(validateParam({
    id: Validate.isNumber(),
}));
editRouter.use(authenticateJWT);

editRouter.route('/')
.get(
    FarmstayController.renderEditFarmstay
).all((req, res, next)=>{
    next(new HttpError(405))
});




/**
 * 
 */
editRouter.route('/edit_info')
.put(
    validateBody({
        name: Validate.isString(),
        rent_cost: Validate.isNumber(),
    }),
    FarmstayController.editInfoFarmstay
).all((req, res, next)=>{
    next(new HttpError(405))
});

/**
 * 
 */
editRouter.route('/edit_address')
.put(
    validateBody({
        link_embedded_ggmap: Validate.isString().allow(''),
        link_ggmap: Validate.isString().allow(''),
        address: Validate.isString().allow(''),
        ward_code: Validate.isString(),
        
    }),
    FarmstayController.editAddressFarmstay
).all((req, res, next)=>{
    next(new HttpError(405))
});
/**
 * 
 */
editRouter.route('/edit_images')
.put(
    uploadMultiImage({type:'farmstay', quantity: 10,}),
    validateBody({
        list_img_delete: Validate.isArrayString(),
    }),
    FarmstayController.editImagesFarmstay
).all((req, res, next)=>{
    next(new HttpError(405))
});
/**
 * 
 */
editRouter.route('/edit_equipments')
.put(
    validateBody({
        add_equipments: Validate.isArray().items(Joi.object().keys({
            id: Joi.number().min(1),
            value: Joi.number().min(0),
        })), 
        current_equipments: Validate.isArray().items(Joi.object().keys({
            id: Joi.number().min(1),
            value: Joi.number().min(0),
        })), 
    }),
    FarmstayController.editFarmstayEquipment
).all((req, res, next)=>{
    next(new HttpError(405))
});

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
        equipments: Validate.isArray().items(Joi.object().keys({
            equipment_id: Joi.number().min(1).required(),
            have_data: Joi.boolean().optional(),
            number_of_field: Joi.number().min(1).optional(),
            quantity: Joi.number().min(1).required(),
            area_id: Joi.number().min(1).optional(),
        })), 
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


Router.route('/generate_config')
.post(
    validateBody({
        id: Validate.isNumber()
    }),
    FarmstayController.generateConfigFarmstay
).all((req, res, next)=>{
    next(new HttpError(405))
});
/**
 * 
 */
Router.route('/trash').all(authenticateJWT)
.get(
    validateQuery({
        limit: Validate.isNumber({require: false}),
        page: Validate.isNumber({require: false})
    }),
    pagination,
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
    validateQuery({
        limit: Validate.isNumber({require: false}),
        page: Validate.isNumber({require: false})
    }),
    pagination,
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