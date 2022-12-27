(async function(){
    const {sequelize, AdminUser, ProtectedAdmin} = require('../../models/mysql')
    const { Buffer } = require('node:buffer');
    const uuidBuffer = require('uuid-buffer');
    var uuid = require('uuid');
    try {

        const user =await AdminUser.findOne({
        where: {email: 'thtntrungnam@gmail.com'},
        include:[
            {
                model: ProtectedAdmin,
                as: 'protected_admin',
            }]
        })
        if(user){
            
            return;
        }else{
            const id = Buffer.from(uuid.parse(uuid.v4(), Buffer.alloc(16)), Buffer.alloc(16))
            const superAdmin = {
                user_id: id,
                username: 'trungnam1611',
                email:'thtntrungnam@gmail.com',
                hashed_password: '123',
                is_active: true,
                status: 'approved',
                protected_admin: {
                    admin_id: id,
                    is_super_admin: true,
                }
            }

            await AdminUser.create(superAdmin, {
                include: [
                    {
                        model: ProtectedAdmin,
                        as: 'protected_admin',
                    }
                ]
            })
        }
        
    } catch (error) {
        console.log(error)
        
    }
    
})();