

class DashboardController{
    renderDashboard(req, res, next){
        res.render('home')
    }
}

module.exports = new DashboardController();