const multer = require("multer");
const mkdirp = require('mkdirp');
const {handleMultiImage,handleSingleImage} = require('../../utils/uploads/image')
const {HttpError, HttpError404}         = require('../../utils/errors')

module.exports.uploadSingleImage = function({type, imageName=undefined, path=undefined}){
    
    const upload = handleSingleImage({type, imageName, path})
    return function(req, res, next){
        upload(req, res, (err)=>{
            if (err instanceof multer.MulterError) {
                next(new HttpError(400))
            } else if (err) {

                next(new HttpError(400))
            }else{
                next()
            }
        })
    }
}

module.exports.uploadMultiImage = function({type, quantity, imageName=undefined, path=undefined}){
    
    const upload = handleMultiImage({type, quantity, imageName, path})
    return function(req, res, next){
        upload(req, res, (err)=>{
            if (err instanceof multer.MulterError) {
                console.log(err)
                next(new HttpError(400))
            } else if (err) {
                next(new HttpError(400))
            }else{
                next()
            }
            // next();
        })
    }
}