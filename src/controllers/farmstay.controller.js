const {HttpError, HttpError404}         = require('../utils/errors')
const { Province, District, Ward, Equipment, sequelize, Farmstay, FarmstayEquipment, FarmstayAddress}       = require('../models/mysql')
const {uploadMultiImage} = require('../middlewares/uploads/upload.image')
const multer                            = require("multer");
const {generateBufferUUIDV4, uuidToString} = require('../helpers/generateUUID');
const { QueryTypes, Op } = require('sequelize');
const sharp                             = require('sharp');
const mkdirp = require('mkdirp');
const slug = require('slug')
const PromiseBlueBird = require('bluebird');
// global.Promise = Promise;

class FarmstayController{
    async renderCreateFarmstay(req, res, next){
        try {

            const data = await Promise.all(
                [
                    Province.findAll({
                        attributes: ['code', 'name']
                    }),
                    Equipment.findAll(
                        {
                            attributes: ['id', 'name', 'quantity']
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
            const fakeManager = [
                {id: 1, 'name': "Trung Nam"},
                {id: 2, 'name': "Nam Anh"},
                {id: 3, 'name': "Hoàng Ca"},
            ]
            res.status(200).render('pages/farmstay/create', {provinces, equipments, managers: fakeManager})

        } catch (error) {
            console.log(error)
            res.status(200).json(error)
        }
        
    }

    async createFarmstay(req, res, next){
        const upload = uploadMultiImage({
            type: 'farmstay',
            quantity: 10,
        });
        upload(req, res, async(err)=>{
            if (err instanceof multer.MulterError) {
                next(new HttpError(400))
            } else if (err) {
                next(new HttpError(400))
            }else{
                let {
                    farmstay_name, //string 'Farmstay ...'
                    rent_cost, // number vd. 1.000.000
                    // equipments_quantity, // array
                    equipments, // array string vd. ["1-2","2-2","3-3","4-2", "5-3"]
                    link_embedded_ggmap, // string
                    link_ggmap, //string
                    address, //string
                    ward_code, //string vd. '09888'
                    district_code, //string vd. '092'
                    province_code, //string vd. '11'
                    description, //string
                    manager_id //number 
                } = req.body;
                rent_cost = parseInt(rent_cost)
                // equipments_quantity = JSON.parse(equipments_quantity)
                // equipments_id = JSON.parse(equipments_id);
                manager_id = parseInt(manager_id);

                // Tách mảng chuỗi  
                equipments = JSON.parse(equipments);
                let [equipments_id, equipments_quantity] = Array.from(equipments).reduce((array, value)=>{
                    const arr = value.split('-');
                    array[0].push(parseInt(arr[0]));
                    array[1].push(parseInt(arr[1]));
                    return array;
                }, [[],[]]);
                
                var transaction;
                try {
                    transaction = await sequelize.transaction();
                    
                    const {files} = req;
                    const images_url = [];
                    const path = './src/public/uploads/farmstay'
                    mkdirp.sync(path)
                    const IMAGES = []
                    for (let index = 0; index < files.length; index++) {
                        const {buffer, originalname, fieldname} = files[index];
                        const uniqueSuffix = Date.now()+ `(${index+1})` + '-' + slug(farmstay_name, '_');
                        const filename = uniqueSuffix+'-'+fieldname+'.'+originalname.split('.').at(-1)
                        images_url.push(`/uploads/farmstay/${filename}`); 
                        // promises.push(sharp(buffer).toFile(`${path}/${filename}`))
                        IMAGES.push([buffer, filename])
                    }
                    
                    await PromiseBlueBird.map(IMAGES, async(image)=>{
                        return sharp(image[0]).toFile(`${path}/${image[1]}`);
                    });
                    
                    
                    const FARMSTAY_ATTRS = {
                        uuid: generateBufferUUIDV4(),
                        name: farmstay_name,
                        rent_cost_per_day: rent_cost,
                        manager_id: manager_id,
                        description: description,
                        square_meter: 1000,
                        address: {
                            code_ward: ward_code,
                            specific_address: address,
                            link: link_ggmap,
                            embedded_link: link_embedded_ggmap
                        },
                        images: images_url
                    }
                    const farmstay = await Farmstay.create(FARMSTAY_ATTRS, {
                        include: [
                            {
                                model: FarmstayAddress,
                                as: 'address'
                            },
                        
                        ],
                        transaction: transaction
                    });

                    const {id:farm_id} = farmstay;

                    // Lấy số lượng còn lại của thiết bị
                    const remain_equipments = await sequelize.query(
                        `SELECT e.id, count(*) AS remain 
                        FROM farmstay_db_dev.equipments AS e 
                        INNER JOIN farmstay_db_dev.farmstay_equipments AS fe
                        ON e.id = fe.equipment_id AND fe.farm_id IS NULL GROUP BY e.id`,
                    { raw: true , type: QueryTypes.SELECT, transaction: transaction}); 
                    
                    //Kiểm tra số lượng thuê có phù hợp với số lượng còn lại hay không
                    for (let index = 0; index < equipments_id.length; index++) {
                        const check = (array, id, rent)=>{
                            const ok = array.findIndex((value)=>{
                                return value['id'] === id && value['remain']>=rent
                            });
                            if(ok>=0)return true;else return false;
                        };
                        if(check(remain_equipments, equipments_id[index], equipments_quantity[index])){
                            await FarmstayEquipment.update(
                                {farm_id},
                                {
                                    where:{
                                        id: {
                                            [Op.in]:  sequelize.literal(`(select t.* from (select t.id from farmstay_equipments as t where t.farm_id is null and t.equipment_id=${equipments_id[index]} order by id limit 0,${equipments_quantity[index]}) as t)`)
                                        }
                                    },
                                    transaction: transaction
                                }
                            )
                        }else{
                            throw new Error("Không đủ số lượng");
                        }
                        
                    }

                    await transaction.commit();

                    res.json('OK');
                } catch (error) {
                    if(transaction) {
                        await transaction.rollback();
                    }
                    console.log(error)
                    res.json('err');
                }

            }
            
        })
        
       
    }


    async getAllProvince(req, res, next){
        const provinces = await Province.findAll();
        res.json(provinces)
    }
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