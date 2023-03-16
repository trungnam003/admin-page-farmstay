const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uuid = require('uuid')
const {customAlphabet} = require('nanoid')
const nanoid = customAlphabet('1234567890qwertyuiopasdfghjkllzxcvbnm')


const Test =  new Schema({
    farmstay_id: {type: Number, index: { unique: true } },
    
    equipments: [
        {
            name: {type: String, required: true, default: ""},
            type: {type: String, required: true, default: ""},
            aria: {type: String, required: true, default: "farm"},
            mqtt_topic: {type: String, required: false, default: ""},
            hardware_id: {type: String, required: true, default: function genUUID() {
                return nanoid(16)
            }},
        }
    ],
});

module.exports = mongoose.model('Test', Test);