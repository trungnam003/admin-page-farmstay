const Router                        = require("express").Router();
const EquipmentController            = require('../controllers/equipment.controller')
const {HttpError, HttpError404}     = require('../utils/errors')
const {authorization}               = require('../middlewares/auths/authorization')
const {authenticateJWT}             = require('../middlewares/auths/authenticate.jwt')
const {Validate, validateParam,validateBody, validateQuery} = require('../middlewares/validates')
const multer                                    = require("multer");
const {uploadSingleImage, uploadMultiImage} = require('../middlewares/uploads/upload.image')
const config = require('../config')

// Router.post('/test', 
// uploadMultiImage({type: 'test',quantity:12}),
// uploadMultiImage({type: 'sss', quantity:12})

// , (req, res, next)=>{
//     res.send(req.files)
// })

Router.route('/detail/:id')
.get(
    EquipmentController.renderDetailEquipment
)
.put(
    EquipmentController.changeQuantityEquipment
)
.all((req, res, next)=>{
    next(new HttpError(405))
});
/**
 * 
 */
Router.route('/trash', authenticateJWT)
.get(
    EquipmentController.renderTrashEquipment
)
.put(
    validateBody({
        id: Validate.isNumber()
    }),
    EquipmentController.restoreEquipment
)
.delete(
    validateQuery({
        equipment_id: Validate.isNumber(),
    }),
    EquipmentController.deleteForceEquiment
)
.all((req, res, next)=>{
    next(new HttpError(405))
});

/**
 * 
 */
Router.route('/', ).all(authenticateJWT)
.get(
    validateQuery({
        limit: Validate.isNumber({require: false}),
        page: Validate.isNumber({require: false})
    }),
    EquipmentController.renderEquipmentManager
)
.post(
    uploadSingleImage({type: 'equipment_image'}),
    validateBody({
        name: Validate.isString(),
        rent_cost: Validate.isNumber(),
        quantity: Validate.isNumber(),
        category_id: Validate.isNumber(),
    }),
    // (req, res)=>{
    //     res.json(req.file)
    // },
    EquipmentController.createEquipment
)
.delete(
    
    validateQuery({
        equipment_id: Validate.isNumber(),
    }),
    EquipmentController.deleteEquipmentById
)
.put(
    
    validateBody({
        name: Validate.isString(),
        rent_cost: Validate.isNumber(),
        category_id: Validate.isNumber(),
        id: Validate.isNumber()
    }),
    EquipmentController.editEquipment
)
.all((req, res, next)=>{
    next(new HttpError(405))
});
module.exports = Router;