
const {sequelize, AdminUser, protectedAdmin, AdministrativeRegion, AdministrativeUnit, Province, District, Ward} = require('../models/mysql')

Province.findOne({
    where: {code_name:'soc_trang'},
    include: [
        {
            model: AdministrativeRegion,
            as: 'administrative_region',
            attributes: ['name']
        },
        {
            model: AdministrativeUnit,
            as: 'administrative_unit',
            attributes: ['full_name']
        },
        {
            model: District,
            as: 'districts',
            attributes: ['name'],
            include: [
                {
                    model: Ward,
                    as: 'wards',
                    attributes: ['name'],
                }
            ]
        }
    ]
}).then(
    v=>{
        console.log(v.toJSON())
        v.districts[9].wards.forEach(element => {
            console.log(element.toJSON())
        });
    }
)

// administrative_units.findOne({
//     where: {
//         id: 2
//     },
//     include:[
//         {
//             model: provinces,
//             as: 'provinces'
//         }
//     ]
// }).then(
// v=>{
//     console.log(v.toJSON())
// }
// )