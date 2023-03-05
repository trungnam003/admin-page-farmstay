// const {User, Group}= require('../../models/mysql');

// // async function createGroup(){
// //     const group = await Group.create({
// //         name: 'Nhóm Khách Hàng',
// //         description: "Nhóm này của khách nhé"
// //     })

// //     console.log(group)
// // }

// // async function createUser() { 
// //     const user = await User.create({
// //         username: 'trungnam1',
// //         email: 'thtntrungnsam@gmail.com',
// //         hashed_password: '12222',
// //         phone: '0991919s',
// //         gender: 'male',
// //         user_type: 'customer',
// //         group_id: 1,
// //     })
// // }


// // // createUser().then().catch()

// // Group.findOne({
// //     where:{
// //         id: 1
// //     },
// //     include: [
// //         {
// //             model: User,
// //             as: 'group_has_users'
// //         }
// //     ]
// // })
// // .then(v=>{
// //     console.log(v.toJSON())
// // })

const {ApiMethod, ApiEndpoint, ApiEndpointMethod}= require('../../models/mysql');

async function getApiMethod(){
    const apiMethod = await ApiMethod.findAll({nest: true,raw: true});
    const fullMethod = apiMethod.map(v=>{return {id: v?.id, name: v?.name}});
    const create = {
        id:1,
        api_endpoint: '/abc/test/*',
        description: "API tào lao",
        methods: apiMethod.map(v=>{return {api_method_id: v?.id}}),
    };
    await ApiEndpoint.create(create, {
        include: [
            {
                model: ApiEndpointMethod,
                as: 'methods'
            }
        ]
    })
}
getApiMethod().then()