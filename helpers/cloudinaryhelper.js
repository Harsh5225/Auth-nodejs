import cloudinaryfile from "../config/cloudinary.js";

const uploadToCloudinary = async (filepath) => {
  try {
    const result = await cloudinaryfile.uploader.upload(filepath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Error while uploading to cloudinary", error);
    throw error("Error while uploading to cloudinary");
  }
};

export default uploadToCloudinary;
