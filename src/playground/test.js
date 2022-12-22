
const {sequelize, AdminUser, protectedAdmin, administrative_regions, administrative_units, provinces} = require('../models')

async function  connect(){
    try {
        await sequelize.authenticate();
        console.log("Connect MySql OK ^^");
    } catch (error) {
        console.log("Connect MySql FAIL :(");
    }
}

connect().then().catch()
function hex2bin(hex){
    return (parseInt(hex, 16).toString(16)).padStart(8, '0');
}
async function abc(){
    // const value = await sequelize.fn('uuid')
    // console.log(value)
    const value = await sequelize.query('SELECT uuid() as uuid;', { type: sequelize.QueryTypes.SELECT })
    console.log(value[0]['uuid'])
    const value2 = await sequelize.query(`select unhex(replace(:uuid,'-','')) as uuidBin;`, { 
        replacements: { uuid: 'd64d2688-7c81-11ed-9f6a-080027bed5fa' },
        type: sequelize.QueryTypes.SELECT,
        raw: true,
    },
       
    )
    console.log(hex2bin(`d64d26887c8111ed9f6a080027bed5fa`))
    console.log(value2[0].uuidBin)
}


var ByteBuffer = require("bytebuffer");
const { Buffer } = require('node:buffer');
const uuidBuffer = require('uuid-buffer');
var uuid = require('uuid');


// const a = uuid.v4()
// console.log(a)
// const b = Buffer.from(uuid.parse(a, Buffer.alloc(16)), Buffer.alloc(16))
// console.log(b)
// console.log(uuidBuffer.toString(b))

// AdminUser.findOne({
//     where: {
//         username: 'TrungNam123'
//     }
// }).then(v=>{
//     const zz = v.toJSON().userId
//     console.log(uuidBuffer.toString(zz))
// }).catch()

// AdminUser.findOne({
//     where: {
//         userId: Buffer.from(uuid.parse('1bb14e4e-9fc3-49e5-beb8-c2575c3e2933', Buffer.alloc(16)), Buffer.alloc(16))
//     }
// }).then(v=>{
//     const zz = v.toJSON()
//     console.log(zz)
//     console.log(uuidBuffer.toString(zz.userId))
// }).catch()

//AdminUser.create({userId: Buffer.from(uuid.parse(uuid.v4(), Buffer.alloc(16)), Buffer.alloc(16)),username: 'trungnam123', email:'hehe@gmail.com', hashpassword: '1234'}).then(v=>console.log(v)).catch()
// AdminUser.findOne({
//     where: {email: 'hehe@gmail.com'}
// }).then(v=>{
//     console.log(v.userId)
//     protectedAdmin.create({
//         adminId: v.userId, isSuperAdmin: true
//     }).then(v=>console.log(v)).catch()
// })

// AdminUser.findOne({
//         where: {email: 'hehe@gmail.com'},
//         include:[
//             {
//                 model: protectedAdmin,
//                 as: 'protected',
//             }]
// }).then(v=>{
//         console.log(v.toJSON())
// })


(async function(){
    try {

        const user = await AdminUser.findOne({
        where: {email: 'thtntrungnam@gmail.com'},
        include:[
            {
                model: protectedAdmin,
                as: 'protectedAdmin',
            }]
        })

        console.log(user.toJSON())
        // if(user){
        //     throw new Error('111')
        //     return;
        // }else{
        //     const id = Buffer.from(uuid.parse(uuid.v4(), Buffer.alloc(16)), Buffer.alloc(16))
        //     const superAdmin = {
        //         userId: id,
        //         username: 'trungnam1611',
        //         email:'thtntrungnam@gmail.com',
        //         hashpassword: '123',
        //         protected: {
        //             adminId: id,
        //             isSuperAdmin: true,
        //         }
        //     }

        //     await AdminUser.create(superAdmin, {
        //         include: [
        //             {
        //                 model: protectedAdmin,
        //                 as: 'protected',
        //             }
        //         ]
        //     })
        // }
        
    } catch (error) {
        console.log(error)
        process.exit()
    }
    
})();