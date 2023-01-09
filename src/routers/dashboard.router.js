const Router = require("express").Router();
const DashboardController = require('../controllers/dashboard.controller')
const {HttpError, HttpError404} = require('../utils/errors')
const {Validate, validateParam} = require('../middlewares/validates')

Router
.route('/test2/:username/:email')
.get(validateParam({
    username: Validate.isUsername(),
    email: Validate.isEmail()
    }), 
    (req, res)=>{
    res.send('Ọ')
})
.all((req, res, next)=>{
    next(new HttpError(405))
})

Router
.route('/')
.get(DashboardController.renderDashboard)
.all((req, res, next)=>{
    next(new HttpError(405))
})


module.exports = Router;