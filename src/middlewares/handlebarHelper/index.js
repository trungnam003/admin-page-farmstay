function pagination(req, res, next){
    res.locals._pagination = {
        limit: 5,
        page: 1
    }
    if(req.query.hasOwnProperty('limit') && req.query.hasOwnProperty('page')){
        const {limit, page} = req.query
        Object.assign(res.locals._pagination, {
            limit,
            page
        });
    }
    next();
}

module.exports = {
    pagination,
}