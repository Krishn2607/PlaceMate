const getGridFSBucket = require("../config/gridfs");

const uploadFileToGridFS = (file) => {
    return new Promise((resolve, reject) => {
        try {
            const bucket = getGridFSBucket();

            const uploadStream = bucket.openUploadStream(
                file.originalname,
                {
                    contentType: file.mimetype
                }
            );

            uploadStream.on("finish", () => {
                resolve({
                    fileId: uploadStream.id,
                    filename: file.originalname
                });
            });

            uploadStream.on("error", (error) => {
                reject(error);
            });

            uploadStream.end(file.buffer);

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    uploadFileToGridFS
};