import Register from "../model/User.js";
import bcrypt from "bcrypt";

export const registerUser = async (req,res) => {
    const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please Enter all the fields" });
  }
  try {
    const newUser = await Register.findOne({ name });
    if (newUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const newEmail = await Register.findOne({ email });
    if (newEmail) {
      return res.status(400).json({ message: "Email Already Exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new Register({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(200).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.log(error);
  }
}