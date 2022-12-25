
const {connect} = require('../config/mongodb.config')
const DataDHT = require('../models/mongodb/datadht')

connect();

async function test(){
    const data = await DataDHT.create({
        data: 123
    })
    console.log(data)
}
test().then();