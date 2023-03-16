const {Category, Equipment,FarmstayEquipment,
    Farmstay, sequelize}                        = require('../models/mysql')
const {HttpError, HttpError404, HttpError400}   = require('../utils/errors')
const sharp                                     = require('sharp');
const slug                                      = require('slug')
const mkdirp                                    = require('mkdirp');
const { Op, fn }                                = require("sequelize");
const {arrayToJSON, objectToJSON}               = require('../helpers/sequelize')
const {imagekit, ImageKit}                      = require('../utils/uploads/image/upload_to_imagekit')

class EquipmentController{
    /**
     * [GET] Render page equipment
     *  
     */
    async renderEquipmentManager(req, res, next){
        try {
            
            const [category, equipments, countDeleted] = await Promise.all([
                Category.findAll({
                    attributes: ['id', 'name']
                }),
                Equipment.findAll({
                    attributes: ['id', 'name', 'total_used', 'quantity', 'rent_cost','updatedAt', 'name_en' ],
                    include: [
                        {
                            model: Category,
                            as: 'belong_to_category',
                            attributes: ['id','name']
                        }
                    ],
                }),
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
                total_equipment_deleted: countDeleted, // số lượng thiết bị đã xóaS
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
        try {
            transaction = await sequelize.transaction();
            
            let {file} = req;
            let {name, name_en, rent_cost, quantity, category_id} = req.body;
            if(category_id==0){
                category_id=null;
            }
            if(file){
                const {buffer, originalname, fieldname} = file;
                const uniqueSuffix = Date.now() + '-' + slug(name, '_');
                const filename = uniqueSuffix+'-'+fieldname+'.'+originalname.split('.').at(-1)
                const {url, fileId, } = await imagekit.upload({
                    file : buffer, //required
                    fileName : filename,   //required
                    folder: 'Equipment',
                    useUniqueFileName: true,
                });
                images = {url, fileId};
            }
            
            await Equipment.create({
                name, rent_cost, category_id, quantity,images, name_en, slug_en: slug(name_en, '_')
            },{transaction});
            await transaction.commit();
            res.redirect('back')
        } catch (error) {
            if(transaction) {
                const lst = [transaction.rollback(), ];
                if(images){
                    const {fileId} = images
                    lst.push(imagekit.deleteFile(fileId))
                }
                await Promise.all(lst);
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
            const {id, name, rent_cost, category_id, name_en} = req.body
            
            await Equipment.update({
                name, rent_cost, category_id, name_en, slug_en: slug(name_en, '_')
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
                attributes: ['id', 'name', 'total_used', 'quantity', 'rent_cost', 'deletedAt'],
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
                paranoid: false,
                
            })
            
            res.render('pages/equipments/trash', {
                equipments: arrayToJSON(equipments),
            })
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
            if(images){
                await imagekit.bulkDeleteFiles([images.fileId]);
                // await imagekit.deleteFile(images);
            }

            await Equipment.destroy({
                where: {
                    id
                },
                force: true,
            })

            res.redirect('/equipment/trash') 
        } catch (error) {
            console.log(error)
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    /**
     * [GET] render giao diện chi tiết thiết bị
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
                    // attributes: ['id'],
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
            console.log(error)

            next(new HttpError(500, "Có lỗi xảy ra"));

        }
    }

    /**
     * [PUT] 
     */
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
            const {total_used, } = equipment;
            if(quantityChange >= total_used){
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