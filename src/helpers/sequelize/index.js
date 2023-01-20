
module.exports.arrayToJSON = function (array) { 
    return (array).map(v=>{
       return v.toJSON()
    })
}

module.exports.objectToJSON = function (object) { 
    return object.toJSON();
}