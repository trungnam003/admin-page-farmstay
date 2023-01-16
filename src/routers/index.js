const Router = require("express").Router();
const authRouter = require('./auth.router');
const dashboardRouter = require('./dashboard.router');
const adminRouter = require('./admin.router');
const farmstayRouter = require('./farmstay.router');
Router.use('/auth', authRouter);
Router.use('/user', adminRouter);
Router.use('/farmstay', farmstayRouter);
Router.use('/', dashboardRouter);

module.exports = Router;