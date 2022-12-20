(async function(){
    const {sequelize, AdminUser, protectedAdmin} = require('../../models')
    const { Buffer } = require('node:buffer');
    const uuidBuffer = require('uuid-buffer');
    var uuid = require('uuid');
    try {

        const user =await AdminUser.findOne({
        where: {email: 'thtntrungnam@gmail.com'},
        include:[
            {
                model: protectedAdmin,
                as: 'protected',
            }]
        })
        if(user){
            
            return;
        }else{
            const id = Buffer.from(uuid.parse(uuid.v4(), Buffer.alloc(16)), Buffer.alloc(16))
            const superAdmin = {
                userId: id,
                username: 'trungnam1611',
                email:'thtntrungnam@gmail.com',
                hashpassword: '123',
                isActive: true,
                status: 'approved',
                protected: {
                    adminId: id,
                    isSuperAdmin: true,
                }
            }

            await AdminUser.create(superAdmin, {
                include: [
                    {
                        model: protectedAdmin,
                        as: 'protected',
                    }
                ]
            })
        }
        
    } catch (error) {
        console.log(error)
        
    }
    
})();