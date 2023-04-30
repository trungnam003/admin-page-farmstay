const mongoose = require('mongoose')
require('dotenv').config()
mongoose.set("strictQuery", false);
function connect(){
    return new Promise((resolve, reject)=>{
        mongoose.connect(process.env.MONGO_STR,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.MONGO_DB
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