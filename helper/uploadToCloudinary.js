const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

//Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})
// End Cloudinary 

let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );

        streamifier.createReadStream(bufferr).pipe(stream);
    });
};

module.exports= async (buffer) => {
    let result = await streamUpload(buffer);
    return result.secure_rul;
}
