import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose, { Types } from "mongoose";
import { deleteAsset, uploadOnCloudinary } from "../utils/cloudinary.js";
import { mailer } from "../services/mailer.js";

const generateAccessAndRefreshToken = async (userId: Types.ObjectId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found!!!");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error("Error while generating access and refresh tokens");
  }
};

const generateForgetPasswordToken = () =>
  Math.floor(Math.random() * 1000000 + 1);

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (
    [username, email, password].some((eachField) => eachField?.trim() === "")
  ) {
    throw new Error("username,email or password cannot be empty");
  }

  const existingUser = await User.findOne({
    email,
  });
  if (existingUser) throw new Error("User already exists with provided email");

  const profilePicLocalPath = req.file?.path;
  let profilePic;
  if (profilePicLocalPath) {
    profilePic = await uploadOnCloudinary(profilePicLocalPath);
    // console.log(profilePic);
    if (!profilePic) throw new Error("Error while uploading profilePic");
  }

  const user = await User.create({
    username,
    email,
    password,
    profilePic: profilePic?.url || null,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -isAdmin"
  );
  if (!createdUser) throw new Error("Error while creating the user");

  res
    .status(200)
    .json({ data: createdUser, msg: "User registeres successfully" });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error("Email and Password are needed");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not Found");

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new Error("Incorrect Password");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id as Types.ObjectId
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -isAdmin"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict" as "strict",
    maxAge: 10 * 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({ data: loggedInUser, msg: "User Logged In Successfully" });
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log(req);

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ data: {}, msg: "User Loggedout successfully" });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user?._id).select(
    "-password -refreshToken -isAdmin"
  );
  if (!currentUser) throw new Error("User not found");
  res
    .status(200)
    .json({ data: currentUser, msg: "Current User found successfully" });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  if (!username && !email) throw new Error("Nothing to Update with");

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username,
        email,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    data: {
      _id: updatedUser?._id,
      username: updatedUser?.username,
      email: updatedUser?.email,
    },
    msg: "userProfile successfully updated",
  });
});

const updateProfilePic = asyncHandler(async (req, res) => {
  const profilePicLocalPath = req.file?.path;
  if (!profilePicLocalPath) throw new Error("ProfilePic to update not found");

  const profilePic = await uploadOnCloudinary(profilePicLocalPath);
  if (!profilePic) throw new Error("Error while uploading the profilePic");

  if (req.user?.profilePic) {
    const assetId = req.user?.profilePic.split("/").pop()?.split(".")[0];

    if (!assetId) throw new Error("Invalid profilePic URL format");

    const { result } = await deleteAsset(assetId);
    if (result !== "ok") throw new Error("Previous profilePic not deleted");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profilePic: profilePic.url,
      },
    },
    { new: true }
  );

  res.status(200).json({
    data: {
      _id: updatedUser?._id,
      username: updatedUser?.username,
      email: updatedUser?.email,
      profilePic: updatedUser?.profilePic,
    },
    msg: "user profilePic successfully updated",
  });
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new Error("Old or New Password cannnot be empty");

  const currentUser = await User.findById(req.user?._id);
  if (!currentUser) throw new Error("User not found");

  const isPasswordCorrect = await currentUser.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) throw new Error("Wrong Old Password,Try Again");

  currentUser.password = newPassword;
  await currentUser.save({ validateBeforeSave: false });

  res.status(200).json({ data: {}, msg: "Password successfully changed" });
});

const getForgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Email not found");

  const user = await User.findOne({
    email,
  });
  if (!user) throw new Error("User not found.");

  const randomToken = generateForgetPasswordToken().toString();
  user.forgetPasswordToken = randomToken;

  await user.save({
    validateBeforeSave: false,
  });

  const isEmailSent = await mailer(
    user.email,
    "Account Recovery",
    `Your Token is ${randomToken}`
  );
  if (!isEmailSent) throw new Error("Error while sending email");

  res
    .status(200)
    .json({ data: {}, msg: "Account Recovery Token sent to email..." });
});

const verifyForgetPasswordToken = asyncHandler(async (req, res) => {
  const { token, email } = req.body;
  if (!token || !email) throw new Error("Token and Email are required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isTokenCorrect = await user.isForgetPasswordTokenCorrect(token);
  if (!isTokenCorrect) throw new Error("Incorrect Forget-Password Token");

  res.status(200).json({ data: {}, msg: "Forget Password Token Verified" });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  console.log(token);

  if (!token) throw new Error("Unauthorized access to reset-password");

  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    throw new Error("Email and NewPassword are required");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (!user.forgetPasswordToken)
    throw new Error("Cannot reset the user password");

  const isTokenCorrect = await user.isForgetPasswordTokenCorrect(token);
  if (!isTokenCorrect) throw new Error("Incorrect Forget Password Token");

  user.password = newPassword;
  user.forgetPasswordToken = null;
  const updatedUser = await user.save({ validateBeforeSave: false });
  if (!updatedUser) throw new Error("Error while setting the new Password");

  res.status(200).json({ data: {}, msg: "User password updated successfully" });
});

// Admin:
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json({ data: users, msg: "Got all the users" });
});

const getAUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) throw new Error("User with specified id not found");

  res.status(200).json({
    data: user,
    msg: "Got the user successfully",
  });
});

const updateProfileById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, isAdmin } = req.body;
  if (!username && !email && !req.file)
    throw new Error(
      "username or email or profilePic is required to update the user"
    );

  const user = await User.findById(id);
  if (!user) throw new Error("User with specified id was not found");

  const profilePicLocalPath = req.file?.path;
  let profilePic;
  if (profilePicLocalPath) {
    profilePic = await uploadOnCloudinary(profilePicLocalPath);
    if (!profilePic)
      throw new Error("Something went wrong while uploading the profilePic");
    // Delete the previous profilePic of the user from the cloud
    if (user?.profilePic) {
      const assetId = user?.profilePic.split("/").pop()?.split(".")[0];
      if (!assetId) throw new Error("Invalid profilePic URL format");
      const { result } = await deleteAsset(assetId);
      if (result !== "ok") throw new Error("Previous profilePic not deleted");
    }
  }

  user.username = username || user.username;
  user.email = email || user.email;
  user.isAdmin = isAdmin || user.isAdmin;
  user.profilePic = profilePic?.url || user.profilePic;

  const updatedUser = await user.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    data: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      isAdmin: updatedUser.isAdmin,
    },
    msg: "User profile updated successfully",
  });
});

const deleteAUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) throw new Error("User with specified id not found");
  if (user.isAdmin) throw new Error("Admin cannot be deleted");

  const response = await User.deleteOne({ _id: user._id });

  if (!response.acknowledged)
    throw new Error("Something went wrong while deleting the user");

  res
    .status(200)
    .json({ data: { response }, msg: "User deleted successfully" });
});

export const userController = {
  // Both Admin and User
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
  updateProfilePic,
  changeCurrentPassword,
  getForgetPasswordToken,
  verifyForgetPasswordToken,
  resetPassword,

  //   Only Admin:
  getAllUsers,
  getAUserById,
  updateProfileById,
  deleteAUserById,
};
