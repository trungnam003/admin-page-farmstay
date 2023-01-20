const Router = require("express").Router();
const authRouter = require('./auth.router');
const dashboardRouter = require('./dashboard.router');
const adminRouter = require('./admin.router');
const farmstayRouter = require('./farmstay.router');
const equipmentRouter = require('./equipment.route');

Router.use('/auth', authRouter);
Router.use('/user', adminRouter);
Router.use('/farmstay', farmstayRouter);
Router.use('/equipment', equipmentRouter);

Router.use('/', dashboardRouter);

module.exports = Router;