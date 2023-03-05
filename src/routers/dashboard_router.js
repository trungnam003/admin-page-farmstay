const Router                        = require("express").Router({mergeParams:true});
const DashboardController           = require('../controllers/dashboard_controller')
const {HttpError, HttpError404}     = require('../utils/errors')
const {Validate, validateParam}     = require('../middlewares/validates')
const {authenticateJWT,}                     = require('../middlewares/auths/authenticate.jwt')
const Router2=require("express").Router({mergeParams:true});
function abc(req, res, next){
    // req.trungNam = req.baseUrl + req.path;
    console.log({
        path: req.path,
        ori: req.originalUrl, // '/admin/new?a=b' (WARNING: beware query string)
        base: req.baseUrl, // '/admin'
        full: req.baseUrl + req.path,
        params: req.params
    });
    next();
}
Router2.use(abc);
Router2.get('/test/:id', abc,(req,res,next)=>{
    try {
        // console.log(req.route.path)
        res.json({
            path: req.path,
            ori: req.originalUrl, // '/admin/new?a=b' (WARNING: beware query string)
            base: req.baseUrl, // '/admin'
            full: req.baseUrl + req.path,
            
        })
    } catch (error) {
        console.log(error)
    }
    
});

Router.use( '/abc/:k', Router2);


Router
.route('/').all(authenticateJWT)
.get(DashboardController.renderDashboard)
.all((req, res, next)=>{
    next(new HttpError(405))
})


module.exports = Router;