import { Image } from "../models/image.js";
import uploadToCloudinary from "../helpers/cloudinaryhelper.js";

import fs from "fs";
import cloudinaryfile from "../config/cloudinary.js";
export const uploadImage = async (req, res) => {
  try {
    // if file is missing
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required,plz upload an image..",
      });
    }

    // upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    //store the image url and public id along with uploaded user id in the db

    const newlyUploadeimg = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userID,
    });
    await newlyUploadeimg.save();

    // delete the file from local storage
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image: newlyUploadeimg,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

export const fetchuploadeImage = async (req, res) => {
  try {
    // aap kaunse page  number par ho
    // aapki image limit per page kitni hai
    // skip will tell about how many images have to skip.
    const page = req.params.page || 1;
    const limit = req.params.limit || 2;
    const skip = (page - 1) * limit;

    const sortBy = req.params.sortBy || "createdAt";

    const sortOrder = req.params.sortBy === "asc" ? 1 : -1;

    // sorting object creation
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    // fetches images with sorting and pagination

    const images= await (await Image.find())
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    // if (imageData) {
    //   return res.status(200).json({
    //     success: true,
    //     data: imageData,
    //     message: "Successfully fetched.",
    //   });
    // }

    res.status(200).json({
      success: true,
      page,
      limit,
      totalPages,
      totalImages,
      images,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error,
      message: "Something went wrong!",
    });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const imageid = req.params.id;

    const ImageData = await Image.findById(imageid);
    if (!ImageData) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const uploadedUser = ImageData.uploadedBy.toString();

    if (req.userInfo.userID !== uploadedUser) {
      return res.status(403).json({
        success: false,
        message:
          "You dont have an access to delete this image as you have not uploaded this image",
      });
    }

    const cloudinaryResponse = await cloudinaryfile.uploader.destroy(
      ImageData.publicId
    );
    if (cloudinaryResponse.result !== "ok") {
      return res.status(500).json({
        success: false,
        message: "Failed to delete image from Cloudinary",
      });
    }

    await Image.findByIdAndDelete(imageid);
    return res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error,
      message: "Something went wrong!",
    });
  }
};
