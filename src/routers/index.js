const Router = require("express").Router();
const authRouter = require('./auth.router');
const dashboardRouter = require('./dashboard.router');
const userRouter = require('./user.router');
const farmstayRouter = require('./farmstay.router');
Router.use('/auth', authRouter);
Router.use('/user', userRouter);
Router.use('/farmstay', farmstayRouter);
Router.use('/', dashboardRouter);

module.exports = Router;