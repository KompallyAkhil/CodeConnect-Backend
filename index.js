import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import register from "./Routes/Register.js";
import login from "./Routes/Login.js"
const app = express();
app.use(express.json());
app.use(cors("*"));
dotenv.config();
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
    console.log("Database Connected !!");
  } catch (error) {
    console.error("Database Connection Error:", error);
  }
})();

app.use("/login", login);
app.use("/signup", register);


app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
