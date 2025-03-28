import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/userModel.js";

interface CustomRequest extends Request {
  user?: IUser;
}

export const asyncHandler = (
  requestHandler: (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};
