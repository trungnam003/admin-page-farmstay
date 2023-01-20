const {Category, Equipment,FarmstayEquipment, sequelize} = require('../models/mysql')
const {HttpError, HttpError404, HttpError400}                 = require('../utils/errors')

const { Op, fn } = require("sequelize");

function arrayToJSON(array) { 
    return (array).map(v=>{
       return v.toJSON()
    })
}

class EquipmentController{
    async renderEquipmentManager(req, res, next){
        try {
            let {limit, page} = req.query
            limit = limit ? parseInt(limit):5;
            page  = page ? parseInt(page):1;
            const category = await Category.findAll({
                attributes: ['id', 'name']
            })
            const equipments = await Equipment.findAll({
                attributes: ['id', 'name', 'total_rented', 'quantity', 'rent_cost', ],
                include: [
                    {
                        model: Category,
                        as: 'belong_to_category',
                        attributes: ['id','name']
                    }
                ],
                limit: limit,
                offset: limit*(page-1)
            })
            
            const count = await Equipment.count();
            res.render('pages/equipments/equipments', {
                category: arrayToJSON(category),
                equipments: arrayToJSON(equipments),
                total_equipment: count,
                limit: limit,
                page: page,
                total: equipments.length
            })
        } catch (error) {
            console.log("here", error)
            next(new HttpError(500, "Có lỗi xảy ra"));
            
        }
    }

    async createEquipment(req, res, next){
        try {
            let {name, rent_cost, quantity, category_id} = req.body;
            if(category_id==0){
                category_id=null;
            }
            const equipments = [];
            for (let i = 0; i < quantity; i++) {
                equipments.push({});
            }
            await Equipment.create({
                name, rent_cost, category_id, quantity, farmstay_equipments: equipments
            }, {
                include: [
                    {
                        model: FarmstayEquipment,
                        as: 'farmstay_equipments'
                    }
                ]
            })
            res.redirect('back')
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
            
        }
    }

    async deleteEquipmentById(req, res, next){
        try {
            const {equipment_id} = req.query;
            await Equipment.destroy({
                where: {
                    id: equipment_id
                }
            })
            
            res.redirect('/equipment') 
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
            
        }
    }

    async editEquipment(req, res, next){
        try {
            const {id, name, rent_cost, category_id} = req.body
            
            await Equipment.update({
                name, rent_cost, category_id
            }, {
                where: {
                  id: id
                }
            });
            
            res.redirect('/equipment') 
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));

        }
    }

    async renderTrashEquipment(req, res, next){
        
        try {
            const equipments = await Equipment.findAll({
                attributes: ['id', 'name', 'total_rented', 'quantity', 'rent_cost', ],
                include: [
                    {
                        model: Category,
                        as: 'belong_to_category',
                        attributes: ['id','name']
                    }
                ],
                where: {
                    deletedAt: {
                        [Op.not]: null
                    }
                },
                paranoid: false
            })
            
            res.render('pages/equipments/trash', {equipments: arrayToJSON(equipments)})
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async restoreEquipment(req, res, next){
        try {
            const {id} = req.body
            await Equipment.restore({
                where:{
                    id: id
                }
            })
            res.redirect('/equipment/trash')
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async deleteForceEquiment(req, res, next){
        try {
            const {equipment_id:id} = req.query;
            await Equipment.destroy({
                where: {
                    id
                },
                force: true,
            })
            res.redirect('/equipment/trash') 
        } catch (error) {
            
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
        
        
        
    }
}

module.exports = new EquipmentController();