const {Farmstay, Equipment, FarmstayEquipment, FarmstayAddress, Ward, District, Province } = require('../../models/mysql')
const {generateBufferUUIDV4, uuidToString} = require('../../helpers/generateUUID')
const slug = require('slug');


// for (let index = 0; index < 1 ;index++) {
    
//     const farmstay = {
//         uuid: generateBufferUUIDV4(),
//         name: 'Farmstay Vĩnh Châu',
//         rent_cost_per_day: 123456,
//         manager_id: 1,
//         description:"Tình thương mến thướng",
//         square_meter: 1234,
//         address: {
//             code_ward: '00766'
//         },
//         list_equipment: [
//             {
//                 equipment_id:1
//             },
//             {
//                 equipment_id:2
//             }
//         ]
//     }
//     Farmstay.create(
//         farmstay, {
//             include: [
//                 {model: FarmstayAddress,
//                 as:'address'
//                 },
//                 {model: FarmstayEquipment,
//                     as:'list_equipment'
//                     }
//             ]
//         }
//     )
//     .then((result) => {
//         console.log(result)
//         //result.destroy({ force: true}).then().catch()
//     }).catch((err) => {
//         console.log(err)
//     });
    
    
// }

// async function abc(){
//     const f = await Farmstay.findAll({
        
//         include: [
//             {
//                 model: FarmstayAddress,
//                 as: 'address',
               
//                 include: [{
//                     model: Ward,
//                     as: 'ward',
//                     include: [{
//                         model: District,
//                         as: 'district',
                        
//                     }]
//                 }]
//             }
//         ]
//     })
    
    
//     console.log(f[0].toJSON())
//     // console.log(f[1].toJSON())
//     // await f.save();

// }
// abc().then(console.log).catch(console.log)

