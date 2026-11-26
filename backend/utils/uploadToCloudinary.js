
const cloudinary = require("./cloudinaryConfig");

const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    console.log("[Cloudinary] Upload started:", {
      time: new Date().toISOString(),
      epoch: Math.floor(Date.now() / 1000),
      folder,
      bufferSize: buffer?.length,
    });

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder },
      (error, result) => {
        if (error) {
          console.error("[Cloudinary] Upload failed:", {
            time: new Date().toISOString(),
            epoch: Math.floor(Date.now() / 1000),
            message: error.message,
            http_code: error.http_code,
          });

          return reject(error);
        }

        console.log("[Cloudinary] Upload successful:", {
          time: new Date().toISOString(),
          public_id: result?.public_id,
        });

        resolve(result);
      },
    );

    stream.end(buffer);
  });

module.exports = uploadToCloudinary;
