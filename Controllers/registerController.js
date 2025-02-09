import Register from "../model/User.js";
import bcrypt from "bcrypt";

function validateEmail(email) {
  const keys =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (email && email.match(keys)) {
    return true;
  } else {
    return false;
  }
}

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please Enter all the fields" });
  }
  try {
    const newUser = await Register.findOne({ name });
    if (newUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    const emailValidation = validateEmail(email);
    if(!emailValidation){
      return res.status(400).json({ message: "Enter a Valid email address" });
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
};
