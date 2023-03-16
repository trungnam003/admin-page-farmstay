const {ApiEndpoint, Permission, Role, RoleHasPermission, sequelize}       = require('../models/mysql')
const {arrayToJSON, objectToJSON}                       = require('../helpers/sequelize')
const {HttpError, HttpError404}         = require('../utils/errors')
const PromiseBlueBird                                   = require('bluebird');
const {Op} =  require('sequelize');

class RbacController{
    async renderManageRBAC(req, res, next){
        try {
            const APIs = await ApiEndpoint.findAll(
                {
                    include: [
                        {
                            model: Permission,
                            attributes:['id'],
                            as: 'endpoint_permissions'
                        }
                    ],
        
                }
            );
            const Permissions = await Permission.findAll(
                {
                    include: [
                        {
                            model: ApiEndpoint,
                            as: 'api_endpoint'
                        }
                    ]
                }
            );
            const Roles = await Role.findAll(
                {
                    include: [
                        {
                            model: RoleHasPermission,
                            as: 'role_has_permissions',
                            
                        }
                    ],
        
                }
            );
            
            res.render('pages/rbac_manages/index', {
                APIs: arrayToJSON(APIs),
                Permissions: arrayToJSON(Permissions),
                Roles: arrayToJSON(Roles)
            })
        } catch (error) {
            console.log(error)
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async createAPI(req, res, next){
        try {
            const {api_endpoint, api_description,api_method} = req.body;
            await ApiEndpoint.create({
                api_endpoint, method: api_method, description: api_description
            })
            res.redirect('back')
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async editAPI(req, res, next){
        try {
            const { id, api_endpoint, api_description,api_method} = req.body;

            const [permissions, api] = await Promise.all(
                [
                    Permission.findAll({
                        where: {api_endpoint_id: id} 
                    }),
                    ApiEndpoint.findOne({where: {id}}) 
                ]
            )
            
            // Duyệt qua từng permissions
            for (const permission of permissions) {
                let {method} = permission; // lấy ra method của permission hiện tại
                let permissionMethod = method.toString(2).split("").reverse(); // Chuyển method của permission hiện tại sang mảng np
                let apiMethod = (+api_method).toString(2).split("").reverse();// Mảng np của method api cần sửa
                let currentApiMethod = api['method'].toString(2).split("").reverse();// Mảng np của method api cần sửa hiện tại
                
                // Duyệt qua mảng np của permission hiện tại
                for (let index = 0; index < permissionMethod.length; index++) {
                    
                    let isChangedApiMethod  = (currentApiMethod[index] !== apiMethod[index]);
                    let isChangedPermissionMethod = apiMethod[index] !== '1';
                    // Nếu có sự thay đổi và thay đổi là 0
                    if(isChangedApiMethod && isChangedPermissionMethod){
                        // Nếu method của permission hiện tại trùng với api cần sửa thì thực hiện sửa luôn  method của permission hiện tại
                        if(currentApiMethod[index] === permissionMethod[index]){
                            permissionMethod[index] = apiMethod[index] ?? '0';
                        }
                    }
                }
                // Chuyển mảng np sang số
                permission['method'] = permissionMethod.reduce((prev, curr, index)=>{
                    return (+curr)>0 ? prev+Math.pow((+curr)*2, index): (+prev)
                }, 0);
            }
            
            await PromiseBlueBird.map(permissions, (item, index)=>{
                return permissions[index].save();
            })
            await ApiEndpoint.update({
                api_endpoint, method: api_method, description: api_description
            },
            {
                where: {id} 
            });
            res.redirect('back')
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async deleteAPI(req, res, next){
        try {
            const {api_id:id} = req.query;
            await ApiEndpoint.destroy({
                where: {
                    id
                },
                force: true,
            })
            res.redirect('back');
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async createPermission(req, res, next){
        try {
            const { 
                description_permission:description,
                api_method_permission:method,
                api_permission_id: api_endpoint_id
            } = req.body
            const checkPermissionExist = await Permission.findOne({
                where: {
                    api_endpoint_id, method
                }
            })
            if(checkPermissionExist){
                return next(new HttpError(400, "Permission này đã tồn tại"));
            }
            await Permission.create({
                description, method, api_endpoint_id
            })
            res.redirect('back');
        } catch (error) {
            console.log(error);
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async editPermission(req, res, next){
        try {
            const { 
                id,
                description_permission:description,
                api_method_permission:method,
                api_permission_id: api_endpoint_id
            } = req.body
            const checkPermissionExist = await Permission.findOne({
                where: {
                    api_endpoint_id, method, 
                    id: {
                        [Op.not]: id
                    }
                }
            })
            if(checkPermissionExist){
                return next(new HttpError(400, "Permission này đã tồn tại"));
            }
            await Permission.update({
                description, method, api_endpoint_id
            },
            {
                where: {id} 
            });
            res.redirect('back')
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async deletePermission(req, res, next){
        try {
            const {permission_id:id} = req.query;
            await Permission.destroy({
                where: {
                    id
                },
                force: true,
            })
            res.redirect('back');
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async createRole(req, res, next){
        try {
            const {name_role:name, role_has_permission, desc_role: description} = req.body;
            const listPermissionId = JSON.parse(role_has_permission);
            const role_has_permissions = listPermissionId.map((id)=>{
                return {permission_id: id}
            })
            try {
                await Role.create({
                    name,description,
                    role_has_permissions
                },
                {
                    include: {
                        model: RoleHasPermission,
                        as: 'role_has_permissions'
                    }
                }
                )
            } catch (error) {
                return next(new HttpError(400, "Tên Role bị trùng"));
            }
            
            res.redirect('back');
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }
    
    async editRole(req, res, next){
        try {
            const {id} = req.params
            const {edit} = req.query;
            if(edit==='info'){
                try {
                    const {name_role:name, desc_role: description} = req.body;
                    await Role.update({name, description}, {
                        where: {id}
                    })
                    res.redirect('back')
                } catch (error) {
                    next(new HttpError(400, "Có lỗi"));
                }
            }
            
            
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async detailRole(req, res, next){
        try {
            const {id} = req.params;
            const role = await Role.findOne({
                where: {id},
                include: [
                    {
                        model: RoleHasPermission,
                        as: 'role_has_permissions',
                        include:[
                            {
                                model: Permission,
                                as: 'belong_to_permission',
                                include: [
                                    {
                                        model: ApiEndpoint,
                                        as: 'api_endpoint'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })
            const {role_has_permissions} = role;
            const listIdPermission = role_has_permissions.map(role_has_permission=>{
                const {permission_id} = role_has_permission
                return permission_id;
            })
            
            const Permissions = await Permission.findAll(
                {
                    where: {
                        id: {
                            [Op.notIn]: listIdPermission
                        }
                    },
                    include: [
                        {
                            model: ApiEndpoint,
                            as: 'api_endpoint'
                        }
                    ]
                }
            );
            
            res.render('pages/rbac_manages/role',{
                role: objectToJSON(role),
                Permissions: arrayToJSON(Permissions),
            })
        } catch (error) {
            console.log(error)
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }

    async deleteRole(req, res, next){
        try {
            const {role_id:id} = req.query;
            await Role.destroy({
                where: {
                    id
                },
                force: true,
            })
            res.redirect('back');
            
        } catch (error) {
            next(new HttpError(500, "Có lỗi xảy ra"));
        }
    }
}

module.exports = new RbacController();