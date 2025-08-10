import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import register from "./Routes/Register.js";
import login from "./Routes/Login.js"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = ["http://localhost:5173","https://code-connect-beta.vercel.app","https://codeconnect.akhilkompally.app"]
app.use(express.json());
app.options('*', cors());
app.use(cors({
  origin:allowedOrigins,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  credentials: true,
}));
app.use(cors("*"));
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
