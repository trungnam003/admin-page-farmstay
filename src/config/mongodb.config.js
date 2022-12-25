const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
function connect(){
    return new Promise((resolve, reject)=>{
        mongoose.connect('mongodb://localhost:27017/farmstay_dev_mongo',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // authSource: "admin",
            // user: "trungnam1611",
            // pass: "Trungnam.123",
        }, (err)=>{
            if(err){
                reject(err)
            }else{
                resolve(true)
            }
        }
        );
            
    })
}


module.exports.connect = connect;