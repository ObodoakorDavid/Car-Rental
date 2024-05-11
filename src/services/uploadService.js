import cloudinary from "../utils/cloudinaryConfig.js";

const uploadImageToCloudinary = async (tempFilePath) => {
  try {
    const { secure_url } = await cloudinary.v2.uploader.upload(tempFilePath, {
      use_filename: true,
      folder: "Car-Rental",
    });

    return secure_url;
  } catch (error) {
    throw error;
  }
};

export default { uploadImageToCloudinary };
