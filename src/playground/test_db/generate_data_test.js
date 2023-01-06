const {Farmstay, Equipment, FarmstayEquipment, FarmstayAddress, Ward, District, Province } = require('../../models/mysql')
const {generateBufferUUIDV4, uuidToString} = require('../../helpers/generateUUID')
const slug = require('slug');

async function createTestEquipments(){
    const name= ["Cảm biến nhiệt độ & độ ẩm - Grove DHT11 Sensor",
                "Cảm biến độ ẩm đất - Grove Moisture Sensor",
                "Bộ Mạch RFID 13.56Mhz RC522",
                "Thẻ RFID NFC 13.56Mhz S50",
                "Relay 4 kênh Opto cách ly 5/12V DC"];
    try {
        for (let index = 0; index < 5; index++) {
            const quantity = 4+parseInt(Math.random()*10);
            const equipments = [];
            for (let i = 0; i < quantity; i++) {
                equipments.push({
                   
                });
            }
            const equipment = {
                name: name[index],
                rent_cost: 10000*(Math.random()*10),
                quantity: quantity,
                total_rented: 0,
                equipments: equipments
            };
            await Equipment.create(
                equipment,
                {
                    include: [
                        {
                            model: FarmstayEquipment,
                            as: 'equipments'
                        }
                    ]
                }
            )
            
        }
    } catch (error) {
        console.log(error)
    }
    
}

createTestEquipments().then(console.log).catch(console.log)