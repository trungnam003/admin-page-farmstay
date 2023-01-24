const {HttpError, HttpError404, HttpError400}                 = require('../utils/errors')
const { Province, District, Ward, 
    Equipment, sequelize, Farmstay, Employee,
    FarmstayEquipment, FarmstayAddress}         = require('../models/mysql')
const {generateBufferUUIDV4, uuidToString}      = require('../helpers/generateUUID');
const { QueryTypes, Op }                        = require('sequelize');
const sharp                                     = require('sharp');
const mkdirp                                    = require('mkdirp');
const slug                                      = require('slug')
const PromiseBlueBird                           = require('bluebird');
const {arrayToJSON, objectToJSON}                             = require('../helpers/sequelize')
const {deleteDiskImage, }  =require('../utils/image')
const config = require('../config')
const path = require('path')

class FarmstayController{

    async renderFarmstays(req, res, next){
        try {
            let {limit, page} = req.query
            limit = limit ? parseInt(limit):5;
            page  = page ? parseInt(page):1;

            const [farmstays,total_farmstay, total_farmstay_deleted ] = await Promise.all([
                Farmstay.findAll({
                    attributes: ['id', 'name', 'uuid', 'rent_cost_per_day'],
                    include: [
                        {
                            model: Employee,
                            as: 'management_staff'
                        }
                    ],
                    limit: limit,
                    offset: limit*(page-1)
                }),
                Farmstay.count(),
                Farmstay.count({
                    where: {
                        deletedAt: {
                            [Op.not]: null
                        }
                    },
                    paranoid: false
                })
            ])
            
            res.render('pages/farmstay/farmstays', {
                farmstays: arrayToJSON(farmstays),
                total_farmstay,
                total_farmstay_deleted,
                limit,
                page,
                total: farmstays.length
            })
            
        } catch (error) {
            console.log(error)
            next(new HttpError(500, "Có lỗi xảy ra"));

        }
    }

    async renderCreateFarmstay(req, res, next){
        try {

            const data = await Promise.all(
                [
                    Province.findAll({
                        attributes: ['code', 'name']
                    }),
                    Equipment.findAll(
                        {
                            attributes: ['id', 'name', 'quantity', [sequelize.literal('`quantity`-`total_rented`'), 'remain']]
                        }
                    ),
                ]
            )
            let [provinces, equipments] = data
            provinces = provinces.map(v=>{
                return v.toJSON() 
            })
            equipments = equipments.map(v=>{
                return v.toJSON() 
            })
            // console.log(equipments)
            const fakeManager = [
                {id: 1, 'name': "Trung Nam"},
                {id: 2, 'name': "Nam Anh"},
                {id: 3, 'name': "Hoàng Ca"},
            ]
            res.status(200).render('pages/farmstay/create', {provinces, equipments, managers: fakeManager})

        } catch (error) {
            console.log(error)
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
        
    }
    /**
     * [POST] Tạo farmstay
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async createFarmstay(req, res, next){
        
        let transaction;
        const diskPathList = [];
        try { 
            // Lấy các thông tin client gửi lên
            let {
                farmstay_name, //string 'Farmstay ...'
                rent_cost, // number vd. 1.000.000
                equipments:equipmentsStr, // array string vd. ["1-2","2-2","3-3","4-2", "5-3"]
                link_embedded_ggmap, // string
                link_ggmap, //string
                address, //string
                ward_code, //string vd. '09888'
                description, //string
                manager_id //number S
            } = req.body;
            rent_cost = parseInt(rent_cost)
            manager_id = parseInt(manager_id);

            transaction = await sequelize.transaction();
            // Lấy toàn bộ file ảnh được gửi lên và lưu vào thư mục uploads
            const {files} = req;
            const images_url = [];
            const pathDisk = path.join(config.__path.app.public.uploads+'', 'farmstay')
            mkdirp.sync(pathDisk) // Tạo thư mục đường dẫn nếu không tồn tại
            const IMAGES = [] // mảng chứa buffer và đường dẫn file
            for (let index = 0; index < files.length; index++) {
                const {buffer, originalname, fieldname} = files[index];
                const uniqueSuffix = Date.now()+ `(${index+1})` + '-' + slug(farmstay_name, '_');
                const filename = uniqueSuffix+'-'+fieldname+'.'+originalname.split('.').at(-1)
                images_url.push(`/uploads/farmstay/${filename}`); 
                IMAGES.push([buffer, filename])
                diskPathList.push(path.join(pathDisk, filename));
            }
            // Lưu các file ảnh
            await PromiseBlueBird.map(IMAGES, async(image)=>{
                return sharp(image[0]).toFile(`${pathDisk}/${image[1]}`);
            });
            
            // Tách mảng chuỗi equipments là id và số lượng ['1-2', '2-3', ...]
            equipmentsStr = JSON.parse(equipmentsStr);
            let [equipments_id, equipments_quantity] = Array.from(equipmentsStr).reduce((array, value)=>{
                const arr = value.split('-');
                array[0].push(parseInt(arr[0])); // Mảng chứa id
                array[1].push(parseInt(arr[1])); // Mảng chứa số lượng của id
                return array;
            }, [[],[]]);

            const equipments = await Equipment.findAll({
                attributes: ['id', 'quantity', 'total_rented'],
                where:{
                    id: equipments_id
                },
                transaction: transaction
            })

            const farmstay_equipments = [];
            equipments.forEach((element, index) => {
                const {quantity, total_rented, id}= element;
                const index_equip = equipments_id.findIndex((value)=>{
                    return value==id
                })
                if(equipments_quantity[index_equip]>quantity-total_rented){
                    throw new HttpError400('Không đủ số lượng')
                }else{
                    for(let i=0; i<equipments_quantity[index_equip]; i++){
                        farmstay_equipments.push({
                            equipment_id: id
                        })
                    }
                    equipments[index].total_rented = total_rented+equipments_quantity[index_equip];
                }
            });
            
            // Obj farmstay cần tạo
            const FARMSTAY_ATTRS = {
                uuid: generateBufferUUIDV4(),
                name: farmstay_name,
                rent_cost_per_day: rent_cost,
                manager_id: manager_id===0?null:manager_id,
                description: description,
                square_meter: 1000,
                address_of_farmstay: {
                    code_ward: ward_code,
                    specific_address: address,
                    link: link_ggmap,
                    embedded_link: link_embedded_ggmap
                },
                list_equipment: farmstay_equipments,
                images: images_url
            }
            await Promise.all(
                equipments.map(equipment=>equipment.save({transaction: transaction}))
            )
            //Tạo farmstay
            await Farmstay.create(FARMSTAY_ATTRS, {
                include: [
                    {
                        model: FarmstayAddress,
                        as: 'address_of_farmstay'
                    },
                    {
                        model: FarmstayEquipment,
                        as: 'list_equipment'
                    }
                
                ],
                transaction: transaction
            });
            
            await transaction.commit();

            res.redirect('/farmstay');
        } catch (error) {
            if(transaction) {
                await transaction.rollback();
                deleteDiskImage({pathList: diskPathList});
            }
            
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async renderTrashFarmstay(req, res, next){
        try {
            const farmstays = await Farmstay.findAll({
                attributes: ['id', 'name', 'uuid', 'rent_cost_per_day'],
                include: [
                    {
                        model: Employee,
                        as: 'management_staff'
                    }
                ],
                where: {
                    deletedAt: {
                        [Op.not]: null
                    }
                },
                paranoid: false
            })
            res.status(200).render('pages/farmstay/trash', {
                farmstays: arrayToJSON(farmstays)
            })
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }
    /**
     * [DELETE] Xóa mềm Farmstay sủ dụng id
     */
    async deleteFarmstayById(req, res, next){
        try {
            const {farmstay_id} = req.query;
            await Farmstay.destroy({
                where: {
                    id: farmstay_id
                }
            })
            
            res.redirect('back') 
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
            
        }
    }

    async restoreFarmstay(req, res, next){
        try {
            const {id} = req.body
            await Farmstay.restore({
                where:{
                    id: id
                }
            })
            res.redirect('/farmstay/trash')
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async deleteForceFarmstay(req, res, next){
        try {
            const {farmstay_id:id} = req.query;
            const farmstay = await Farmstay.findOne({
                where:{
                    id
                },
                include: [
                    {
                        model: FarmstayEquipment,
                        as: 'list_equipment'
                    }
                ],
                paranoid: false
            })
            const {images} = farmstay;
            const imagePaths = []
            const diskPath = config.__path.app.public.uploads+''
            images.forEach(image=>{
                const filename = image.split('/').at(-1);
                
                imagePaths.push(path.join(diskPath,  'farmstay', filename))
            })
            
            await deleteDiskImage({pathList: imagePaths});

            await Farmstay.destroy({
                where: {
                    id
                },
                force: true,
            })
            let {list_equipment} = objectToJSON(farmstay)
            const data = list_equipment.reduce((prev, curr)=>{
                const {equipment_id} = curr;
                if(equipment_id){
                    if(prev.hasOwnProperty(equipment_id)){
                        prev[equipment_id] +=1;
                    }else{
                        prev[equipment_id] = 1;
                    }
                    return prev;
                }
            }, {})
            
            await Promise.all(
                Object.keys(data).map(v=>{
                    const total = data[v];
                    return Equipment.update({
                        total_rented: sequelize.literal(`total_rented-${total}`)
                    },{
                        where: {
                            id: parseInt(v)
                        }
                    })
                })
            )
            
            res.redirect('/farmstay/trash')
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
            
        }
    }

    /**
     * [API-GET] Lấy toàn bộ tỉnh
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getAllProvince(req, res, next){
        const provinces = await Province.findAll();
        res.json(provinces)
    }

    /**
     * [API-GET] Lấy toàn bộ huyện thuộc tỉnh
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getAllDistrictOfProvince(req, res, next){
        const {province_code} = req.query;

        let districts = await District.findAll({
            where: {
                province_code: province_code
            },
            attributes: ['code', 'name']
        });
        districts = districts.map(v=>{
            return v.toJSON() 
        })
        res.json({districts})
    }

    /**
     * [API-GET] Lấy toàn bộ xã thuộc huyện
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getAllWardOfDistrict(req, res, next){
        const {district_code} = req.query;

        let wards = await Ward.findAll({
            where: {
                district_code: district_code
            },
            attributes: ['code', 'name']
        });
        wards = wards.map(v=>{
            return v.toJSON() 
        })
        res.json({wards})
    }


}

module.exports = new FarmstayController()