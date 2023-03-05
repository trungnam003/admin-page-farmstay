
class DatabaseController{
    renderMysql(req, res, next){
        try {
            console.log(res.locals)
            res.render('pages/databases/mysql')
        } catch (error) {
            
        }
    }
}

module.exports = new DatabaseController();