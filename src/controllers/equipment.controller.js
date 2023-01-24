const {Category, Equipment,FarmstayEquipment,
    Farmstay, sequelize}  = require('../models/mysql')
const {HttpError, HttpError404, HttpError400}               = require('../utils/errors')
const sharp                                     = require('sharp');
const slug                                      = require('slug')
const mkdirp                                    = require('mkdirp');

const { Op, fn }                                            = require("sequelize");
const {arrayToJSON, objectToJSON}                                         = require('../helpers/sequelize')
const fs                                = require('node:fs/promises');
const config = require('../config')
const path = require('path')
const {deleteDiskImage, }  =require('../utils/image')


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
                total_equipment: count, // số lượng của toàn bộ thiết bị
                total_equipment_deleted: countDeleted, // số lượng thiết bị đã xóa
                limit: limit,
                page: page,
                total: equipments.length // số lượng thiết bị được lấy ra
            })
        } catch (error) {
            
            next(new HttpError(500, "Có lỗi xảy ra"));
            
        }
    }
    /**
     * [POST] Tạo equipment mới
     */
    async createEquipment(req, res, next){
        
        let transaction;
        let images = null;
        let diskPath = null;
        try {
            transaction = await sequelize.transaction();
            
            let {file} = req;
            let {name, rent_cost, quantity, category_id} = req.body;
            if(category_id==0){
                category_id=null;
            }
            if(file){
                const {buffer, originalname, fieldname} = file;
                diskPath = path.join(config.__path.app.public.uploads+'', 'equipment');
                mkdirp.sync(diskPath) 
                const uniqueSuffix = Date.now() + '-' + slug(name, '_');
                const filename = uniqueSuffix+'-'+fieldname+'.'+originalname.split('.').at(-1)
                images = `/uploads/equipment/${filename}`;
                diskPath = path.join(diskPath, filename)
                await sharp(buffer).toFile(diskPath);
            }
            
            await Equipment.create({
                name, rent_cost, category_id, quantity,images, 
            },{transaction});
            
            await transaction.commit();
            res.redirect('back')
        } catch (error) {
            console.log(error)
            if(transaction) {
                await transaction.rollback();
                await deleteDiskImage({pathList:[diskPath]});
            }
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
            const equipment = await Equipment.findOne({
                where:{
                    id
                },
                paranoid: false
            })
            const {images} = equipment;
            const filename = images.split('/').at(-1)
            let diskPath = config.__path.app.public.uploads+''
            diskPath = path.join(diskPath,  'equipment', filename)
            await deleteDiskImage({pathList: [diskPath]});

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

    /**
     * [GET] 
     */
    async renderDetailEquipment(req, res, next){
        try {
            const {id} = req.params;
            const equipment = await Equipment.findOne({
                where: {
                    id
                },
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [
                    {
                        model: Category,
                        as: 'belong_to_category',
                        attributes: ['id','name'],

                    },
                    
                ]
            })
            const farmstayEquipment = await FarmstayEquipment.findAll(
                {
                    where: {equipment_id: id},
                    attributes: ['id'],
                    include: [
                        {
                            model: Farmstay,
                            as: 'used_by',
                            attributes: ['id', 'name', 'deletedAt'],
                            paranoid: false
                        }
                    ],
                    
                }
            )
            // console.log()
            res.render('pages/equipments/detail_equipment',
                {
                    equipment: objectToJSON(equipment),
                    farmstayEquipment: arrayToJSON(farmstayEquipment)
                }
            );
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));

        }
    }

    async changeQuantityEquipment(req, res, next){
        try {
            const {id} = req.params;
            const {quantity: quantityChange} = req.body;

            const equipment = await Equipment.findOne({
                where: {
                    id
                },
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            })
            const {total_rented, } = equipment;
            if(quantityChange >= total_rented){
                // if(quantityChange > quantity){
                //     const createList = [];
                //     for (let index = 0; index < quantityChange-quantity; index++) {
                //         createList.push({equipment_id: id})
                //     }
                //     await FarmstayEquipment.bulkCreate(createList);
                //     equipment.quantity = quantityChange
                //     await equipment.save();
                // }else if(quantityChange < quantity){
                //     const farmstay_equipments = await FarmstayEquipment.findAll({
                //         where: {
                //             equipment_id: id,
                //             farm_id: {
                //                 [Op.is]: null
                //             }
                //         },
                //         limit: quantity-quantityChange,
                //         order: [
                //             ['id', 'DESC']
                //         ]
                //     })
                //     const deleteList = farmstay_equipments.map(v=>v.id)
                //     await FarmstayEquipment.destroy({
                //         where: {
                //             id: deleteList
                //         }
                //     })
                //     equipment.quantity = quantityChange
                //     await equipment.save();
                // }
                equipment.quantity = quantityChange
                await equipment.save();
            }

            res.redirect('back');
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
            
        }
    }
}

module.exports = new EquipmentController();