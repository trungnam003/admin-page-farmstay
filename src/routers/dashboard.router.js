const Router = require("express").Router();
const DashboardController = require('../controllers/dashboard.controller')
const {HttpError, HttpError404} = require('../utils/errors')

Router
.route('/')
.get(DashboardController.renderDashboard)
.all((req, res, next)=>{
    next(new HttpError(405))
})

module.exports = Router;