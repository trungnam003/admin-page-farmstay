const {User, Employee}                        = require('../models/mysql')
const bcrypt                                = require('bcrypt')
const {arrayToJSON, objectToJSON}               = require('../helpers/sequelize')

class EmployeeController{
    async renderListEmployee(req, res, next){
        try {
            const employees = await Employee.findAll({
                include: [
                    {
                        model: User,
                        as: 'user_employee'
                    }
                ]
            })
            res.render('pages/employee/employees', {employees: arrayToJSON(employees)})
        } catch (error) {
            
        }
    }
    async createEmployee(req, res, next){
        try {
            const {fullname, email, username, password} = req.body;
            const salt = await bcrypt.genSalt(12);
            const hashed_password = await bcrypt.hash(password, salt);
            const userCreate = {username, email, hashed_password, user_employee:{fullname}}
            Object.assign(userCreate, {user_type: 'employee', is_active: true})
            await User.create(userCreate, {
                include: [
                    {
                        model:Employee,
                        as: 'user_employee'
                    }
                ]
            })
            res.redirect('back')
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = new EmployeeController