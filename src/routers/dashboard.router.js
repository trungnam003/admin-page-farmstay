const Router = require("express").Router();
const DashboardController = require('../controllers/dashboard.controller')
const {HttpError, HttpError404} = require('../utils/errors')
const {validateOneParam, validateManyParam, validateOneBody, validateManyBody} = require('../middlewares/validates')

Router
.route('/test')
.put((req, res, next)=>{
    res.json("HEELOOOO")
})
.all((req, res, next)=>{
    next(new HttpError(405))
})

Router
.route('/test/:username')
.get(validateOneParam('username'),(req, res, next)=>{
    res.json(req.params)
})
.post(validateManyBody(['username', 'email']),(req, res, next)=>{
    res.json(req.body)
})
.all((req, res, next)=>{
    next(new HttpError(405))
})

Router
.route('/test2/:username/:email')
.get(validateManyParam(['username', 'email']))
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