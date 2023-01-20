const {User, Group}= require('../../models/mysql');

async function createGroup(){
    const group = await Group.create({
        name: 'Nhóm Khách Hàng',
        description: "Nhóm này của khách nhé"
    })

    console.log(group)
}

async function createUser() { 
    const user = await User.create({
        username: 'trungnam1',
        email: 'thtntrungnsam@gmail.com',
        hashed_password: '12222',
        phone: '0991919s',
        gender: 'male',
        user_type: 'customer',
        group_id: 1,
    })
}


// createUser().then().catch()

Group.findOne({
    where:{
        id: 1
    },
    include: [
        {
            model: User,
            as: 'group_has_users'
        }
    ]
})
.then(v=>{
    console.log(v.toJSON())
})