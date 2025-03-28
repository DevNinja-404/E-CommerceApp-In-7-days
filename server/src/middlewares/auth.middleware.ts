import { asyncHandler } from "../utils/asyncHandler.js";
import { IUser, User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { Request } from "express";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");

  if (!token) throw new Error("Unauthorized Request");

  const decodedToken = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as jwt.JwtPayload;

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken "
  );
  if (!user) throw new Error("Invalid Access Token");

  req.user = user;
  next();
});

export const authorizedAdmin = asyncHandler(async (req, res, next) => {
  const { user } = req;
  if (!user) throw new Error("User not found ");

  if (user.isAdmin) {
    next();
  } else {
    throw new Error("Admin Access Denied...");
  }
});
