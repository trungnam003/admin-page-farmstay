const fs                                = require('node:fs/promises');
const config                            = require('../../config')
const path                              = require('path')

async function deleteDiskImage({pathList=[]}){
    if(pathList.length>0){
        for (const iterator of pathList) {
            const diskPath = iterator;
            try {
                await fs.unlink(diskPath);
            } catch (error) {
                console.log(error);
            }
        }        
    }
    
}

module.exports = {
    deleteDiskImage
}