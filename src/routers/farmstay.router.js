const Router                        = require("express").Router();
const FarmstayController            = require('../controllers/farmstay.controller')
const {HttpError, HttpError404}     = require('../utils/errors')
const {authorization}               = require('../middlewares/auths/authorization')
const {authenticateJWT}             = require('../middlewares/auths/authenticate.jwt')
const {uploadMultiImage} = require('../middlewares/uploads/upload.image')
Router
.route('/create')
.get(
    authenticateJWT,
    FarmstayController.renderCreateFarmstay
)
.post(
    authenticateJWT,
    FarmstayController.createFarmstay
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


Router
.route('/')
.get(
    FarmstayController.renderFarmstays
)
.all((req, res, next)=>{
    next(new HttpError(405))
});

// Router
// .route('/test')
// .post(
//     uploadMultiImage({
//         type: 'farmstay', quantity: 10
//     }),
//     (req, res)=>{
//         console.log(req.files)
//         res.json(req.body)
//     })
// .all((req, res, next)=>{
//     next(new HttpError(405))
// });

module.exports = Router;