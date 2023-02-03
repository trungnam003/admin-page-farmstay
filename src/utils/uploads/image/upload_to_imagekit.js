const ImageKit = require('imagekit')
const imagekit = new ImageKit(
    {
        publicKey : "public_+UfhJ7AhkfE1fRo1u8dfvQVbruE=",
        privateKey : "private_ZRgi2j1DK6a4clSuUB8kNThw7e8=",
        urlEndpoint : "https://ik.imagekit.io/pytuna1611/"
    }
)

module.exports = {
    imagekit, ImageKit
}