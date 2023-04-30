const Router = require("express").Router();
const authRouter = require('./auth_router');
const dashboardRouter = require('./dashboard_router');
const adminRouter = require('./admin_router');
const farmstayRouter = require('./farmstay_router');
const equipmentRouter = require('./equipment_router');
const databaseRouter = require('./database_router');
const rbacbaseRouter = require('./rbac_router');
const employeeRouter = require('./employee_router');


Router.use('/auth', authRouter);
Router.use('/user', adminRouter);
Router.use('/farmstay', farmstayRouter);
Router.use('/equipment', equipmentRouter);
Router.use('/database', databaseRouter);
Router.use('/rbac', rbacbaseRouter);
Router.use('/employee', employeeRouter);



Router.use('/', dashboardRouter);

module.exports = Router;