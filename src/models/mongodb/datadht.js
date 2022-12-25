const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DataDHT =  new Schema({
    data: {type: String}
});

module.exports = mongoose.model('DataDHT', DataDHT);