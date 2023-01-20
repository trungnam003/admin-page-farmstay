const {Category, Equipment,FarmstayEquipment, sequelize}    = require('../models/mysql')
const {HttpError, HttpError404, HttpError400}               = require('../utils/errors')

const { Op, fn }                                            = require("sequelize");
const {arrayToJSON}                                         = require('../helpers/sequelize')


class EquipmentController{
    /**
     * [GET] Render page equipment
     *  
     */
    async renderEquipmentManager(req, res, next){
        try {
            let {limit, page} = req.query
            limit = limit ? parseInt(limit):5;
            page  = page ? parseInt(page):1;
            
            const [category, equipments, count, countDeleted] = await Promise.all([
                Category.findAll({
                    attributes: ['id', 'name']
                }),
                Equipment.findAll({
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
                }),
                Equipment.count(),
                Equipment.count({
                    where: {
                        deletedAt: {
                            [Op.not]: null
                        }
                    },
                    paranoid: false
                })
            ]);
            
            res.render('pages/equipments/equipments', {
                category: arrayToJSON(category),
                equipments: arrayToJSON(equipments),
                total_equipment: count,
                total_equipment_deleted: countDeleted,
                limit: limit,
                page: page,
                total: equipments.length
            })
        } catch (error) {
            
            next(new HttpError(500, "Có lỗi xảy ra"));
            
        }
    }
    /**
     * [POST] Tạo equipment mới
     */
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
    /**
     * [DELETE] Xóa mềm Equipment sủ dụng id
     */
    async deleteEquipmentById(req, res, next){
        try {
            const {equipment_id} = req.query;
            await Equipment.destroy({
                where: {
                    id: equipment_id
                }
            })
            
            res.redirect('back') 
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
            
        }
    }

    /**
     * [PUT] Chỉnh sửa equipment sử dụng id
     */
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
            
            res.redirect('back') 
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));

        }
    }
    /**
     * [GET] Render page thùng rác equipment
     */
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
    /**
     * [PUT] Khôi phục xóa mềm equipment
     */
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
    /**
     * [DELETE] Xóa vĩnh viễn equipment sử dụng id
     */
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