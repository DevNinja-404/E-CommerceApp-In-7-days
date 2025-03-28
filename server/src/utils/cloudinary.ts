import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) throw new Error("ProfilePic Not Found");

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    if (response) {
      fs.unlinkSync(localFilePath);
    }
    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export const deleteAsset = async (assetPublicId: string) => {
  try {
    const response = await cloudinary.uploader.destroy(assetPublicId);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
