import bcryptjs, { compareSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import mongoose, { Document, Types } from "mongoose";

export interface IUser extends Document {
  id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profilePic: string | null;
  isAdmin: boolean;
  forgetPasswordToken: string | null;
  refreshToken: string | null;
  createdAt: Date;
  updatedAt: Date;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  isPasswordCorrect: (password: string) => Promise<boolean>;
  isForgetPasswordTokenCorrect: (token: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    profilePic: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    forgetPasswordToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("forgetPasswordToken") || !this.forgetPasswordToken)
    return next();
  this.forgetPasswordToken = await bcryptjs.hash(
    this.forgetPasswordToken as string,
    10
  );
  next();
});

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as StringValue }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as StringValue }
  );
};

userSchema.methods.isPasswordCorrect = function (password: string) {
  return bcryptjs.compareSync(password, this.password);
};

userSchema.methods.isForgetPasswordTokenCorrect = function (token: string) {
  if (!this.forgetPasswordToken) return false;
  return bcryptjs.compareSync(token, this.forgetPasswordToken);
};

export const User = mongoose.model<IUser>("User", userSchema);
