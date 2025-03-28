import { Router } from "express";
import userRouter from "./userRoutes.js";

const apiIndex = "/api/v1";

const router = Router();

router.use(`${apiIndex}/users`, userRouter);
// router.use(`${apiIndex}/users`, userRouter);

export default router;
