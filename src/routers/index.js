const Router = require("express").Router();
const authRouter = require('./auth.router');
const dashboardRouter = require('./dashboard.router');

Router.use('/auth', authRouter);
Router.use('/', dashboardRouter);

module.exports = Router;