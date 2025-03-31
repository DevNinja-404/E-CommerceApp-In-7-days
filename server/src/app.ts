import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("publc"));
app.use(cookieParser());

// Routes:
import indexRouter from "./routes/index.js";
app.use("/", indexRouter);

// Handling erroe globally:

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  err.message = err ? err.toString() : "Something went wrong";
  res
    .status(500)
    .json({ status: "error", statusCode: 500, message: err.message });
});

export default app;
