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

const deleteFileFromGridFS = async (fileId) => {
    try {
        const bucket = getGridFSBucket();

        await bucket.delete(fileId);

        console.log("File deleted from GridFS");

    } catch (error) {
        if (error.message.includes("File not found for id")) {
            console.log("GridFS file already does not exist");
            return;
        }

        throw error;
    }
};
const downloadFileFromGridFS = async (fileId) => {
    const bucket = getGridFSBucket();

    return bucket.openDownloadStream(fileId);
};
module.exports = {
    uploadFileToGridFS,
    deleteFileFromGridFS,
    downloadFileFromGridFS
};