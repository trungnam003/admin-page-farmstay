
const {sequelize, AdminUser, protectedAdmin, administrative_regions, administrative_units, provinces, districts, wards} = require('../models')

provinces.findOne({
    where: {code_name:'soc_trang'},
    include: [
        {
            model: administrative_regions,
            as: 'administrative_region',
            attributes: ['name']
        },
        {
            model: administrative_units,
            as: 'administrative_unit',
            attributes: ['full_name']
        },
        {
            model: districts,
            as: 'districts',
            attributes: ['name'],
            include: [
                {
                    model: wards,
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