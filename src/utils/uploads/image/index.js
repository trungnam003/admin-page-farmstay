const multer = require("multer");
const mkdirp = require('mkdirp');

// // type là tên body request tải lên
// function uploadImage(type = '', imageName = ''){

//     const made = mkdirp.sync(`./src/public/uploads/${type}`)

//     // const storage = multer.diskStorage({
//     //     destination: function(req, file, cb){
//     //         cb(null, `./src/public/uploads/${type}`)
//     //     },
//     //     filename: function(req, file, cb){
//     //         const uniqueSuffix = Date.now() + '-' + imageName
//     //         const path = uniqueSuffix+'-'+file.fieldname+'.'+file.originalname.split('.').at(-1)
//     //         cb(null,  path)
//     //     }
//     // })

//     // lưu vào memoryStorage
//     const storage = multer.memoryStorage()
    
//     // lọc file ảnh
//     const fileFilter = function(req, file, cb){
//         const extFiles = ['.png', '.jpg']
//         const ext = "."+file.originalname.split('.').at(-1);
        
//         if(extFiles.includes(ext)){
//             cb(null, true)
//         }else{
//             cb(new multer.MulterError(1611, "LỖI FILE KHÔNG HỢP LỆ"))
//         }
//     }
    
//     const upload_Image = multer({storage: storage, fileFilter: fileFilter, limits: {fileSize: 5000000}})
//     // trả về middleware tải ảnh lên
//     return upload_Image.single(type)
// }

/**
 * @param {object} options
 * @param {string} options.type Loại ảnh cần lưu, trùng tên với req.files
 * @param {string|undefined} options.imageName Tên file cần lưu
 * @param {string|undefined} options.path Đường dẫn đến nơi cần lưu
 * @returns Middleware
 */
function handleSingleImage(options){
    let {type, imageName, path} = options;
    let storage;
    if(path){
        mkdirp.sync(path)
        storage = multer.diskStorage({
            destination: function(req, file, cb){
                cb(null, path)
            },
            filename: function(req, file, cb){
                const uniqueSuffix = Date.now() + '-' + imageName
                const path = uniqueSuffix+'-'+file.fieldname+'.'+file.originalname.split('.').at(-1)
                cb(null,  path)
            }
        })
    }else{
        storage = multer.memoryStorage();
    }
    // lọc file ảnh
    const fileFilter = function(req, file, cb){
        const extFiles = ['.png', '.jpg']
        const ext = "."+file.originalname.split('.').at(-1);
        
        if(extFiles.includes(ext)){
            cb(null, true)
        }else{
            cb(new multer.MulterError(1611, "LỖI FILE KHÔNG HỢP LỆ"))
        }
    }
    const upload_Image = multer({storage: storage, fileFilter: fileFilter, limits: {fileSize: 5000000}})
    // trả về middleware tải ảnh lên
    return upload_Image.single(type)
}

/**
 * @param {object} options
 * @param {string} options.type Loại ảnh cần lưu, trùng tên với req.files
 * @param {string} options.imageName Tên các file cần lưu
 * @param {string} options.quantity Số lượng file cần lưu
 * @param {string} options.path Đường dẫn đến nơi cần lưu
 * @returns Middleware
 */
function handleMultiImage({type, imageName, quantity, path}){
    // let {type, imageName, quantity, path} = options;
    let storage
    if(path){
        mkdirp.sync(path)
        storage = multer.diskStorage({
            destination: function(req, file, cb){
                cb(null, path)
            },
            filename: function(req, file, cb){
                //'-'+(Math.random()*10e9).toFixed(0)
                const uniqueSuffix = Date.now() + '-' + imageName 
                const path = uniqueSuffix+'-'+file.fieldname+'.'+file.originalname.split('.').at(-1)
                cb(null,  path)
            }
        })
    }else{
        storage = multer.memoryStorage();
    }

    const fileFilter = function(req, file, cb){
        const extFiles = ['.png', '.jpg']
        const ext = "."+file.originalname.split('.').at(-1);
        
        if(extFiles.includes(ext)){
            cb(null, true)
        }else{
            cb(new multer.MulterError(1611, "LỖI FILE KHÔNG HỢP LỆ"))
        }
    }
    const upload_Image = multer({storage: storage, fileFilter: fileFilter, limits: {fileSize: 5000000}})
    return upload_Image.array(type, quantity)
}

module.exports = {
    handleMultiImage, handleSingleImage
}