const { Buffer } = require('node:buffer');
var uuid = require('uuid');
const uuidBuffer = require('uuid-buffer');

function generateBufferUUIDV4(){
    return Buffer.from(uuid.parse(uuid.v4(), Buffer.alloc(16)), Buffer.alloc(16))
}

function uuidToString(uuid){
    return uuidBuffer.toString(uuid)
}

module.exports = {
    generateBufferUUIDV4, uuidToString
}