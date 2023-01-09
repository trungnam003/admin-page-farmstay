const {AdminUser, ProtectedAdmin}       = require('../models/mysql')

class DashboardController{
    async renderDashboard(req, res, next){
        res.render('home')
    }
}

module.exports = new DashboardController();