const {connect} = require('../../config/mongodb.config')
const mongoose = require('mongoose')
const FarmstayData = require('../../models/mongodb/FarmstayData')


// connect().then(()=>{
//     const data = new Test({
//         farmstay_id: 2,
//         equipments: [
//             {
//                 name: 'abc',
//                 type: 'sensor',
//                 aria: 'farm'
//             },
//             {
//                 name: 'abc',
//                 type: 'device',
//                 aria: 'farm'
//             },
//             {
//                 name: 'abc',
//                 type: 'sensor',
//                 aria: 'farm'
//             },
//             {
//                 name: 'abc',
//                 type: 'relay',
//                 aria: 'farm'
//             }
//         ]
//     })
//     // data.save().then(()=>{
//     //     console.log('ok')
//     // }).catch((e)=>{console.log(e)})

//     Test.findOne({
//         farmstay_id: 2,
//         'equipments':  {
//             $elemMatch: {
//                 type: 'sensor'
//             }
//         }
//     }, {
//         'equipments.$.type': 1
//     }).then(console.log)
// })

connect().then(()=>{
    // const data = new FarmstayData({
    //     farmstay_id: '123',
    //     sensor: {
    //         "id9888-192": {
    //             name: "Cam bien lua",
    //             aria: "home",
    //             data: [
    //                 {
    //                     value: 1,
    //                     pushedAt: Date.now()
    //                 },
    //                 {
    //                     value: 0,
    //                     pushedAt: Date.now()
    //                 },
    //                 {
    //                     value: 0,
    //                     pushedAt: Date.now()
    //                 },
    //             ]
    //         },
    //         "id92716-9287": {
    //             name: "Cam bien nhiet do",
    //             aria: "farm",
    //             data: [
    //                 {
    //                     value: 33,
    //                     pushedAt: Date.now()
    //                 },
    //                 {
    //                     value: 34,
    //                     pushedAt: Date.now()
    //                 },
    //             ]
    //         }
    //     },
    // })
    // data.save().then(()=>{
    //     console.log('ok')
    // }).catch((e)=>{console.log(e)})

    
    // for(let i=0; i<100; i++){
    //     FarmstayData.updateOne({
    //         farmstay_id: "3c05296a-64e5-41c5-b4a6-eb679d845372",
    //         [`sensor.${'l3n8eq6jh6v7sarg'}`]: {
    //             "$exists": true
    //         }
    //     }, {
    //         "$push": {
    //             [`sensor.${'l3n8eq6jh6v7sarg'}.data`]:  {
    //                                     value: i,
    //                                     pushedAt: Date.now()+i*10000
    //                                 }
    //         }
    //     }).then((data)=>{
            
    //         // console.log(data)
    //     })
    // }
    // console.log('done')


    FarmstayData.aggregate([
        { $match: { farmstay_id: '3c05296a-64e5-41c5-b4a6-eb679d845372' } }, // Lọc ra bài đăng có _id trùng với post._id
        { $unwind: `$sensor.${'l3n8eq6jh6v7sarg'}.data` }, // Tách mỗi phần tử trong mảng 'comments' thành một document riêng
        { $sort: { [`sensor.${'l3n8eq6jh6v7sarg'}.data.pushedAt`]: -1 } }, // Sắp xếp theo thứ tự giảm dần của trường 'createdAt' trong 'comments'
        { $limit: 30 }, // Giới hạn số lượng bình luận lấy ra là 30
        { $group: { _id: null, [`data`]: { $push: `$sensor.${'l3n8eq6jh6v7sarg'}.data` } } } // Gom lại thành một mảng 'comments'
      ])
      .then((result) => {
        
        const data = result[0].data // Lấy mảng 'comments' từ kết quả truy vấn
        console.log("data", data) // In ra 30 bình luận mới nhất
      })

    // FarmstayData.findOne({
    //     farmstay_id: '3c05296a-64e5-41c5-b4a6-eb679d845372',
        
    // },
    // {
    //     [`sensor.${'l3n8eq6jh6v7sarg'}`]:0
    // }
    // )

})
