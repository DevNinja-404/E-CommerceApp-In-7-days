import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("App not able to connect with DB!");
      throw error;
    });

    app.listen(PORT, () => {
      console.log(`App running at URL : http:\\localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`Mongo Connection Faied : ${error}`);
  });
