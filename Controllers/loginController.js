import Register from "../model/User.js";
import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { StreamChat } from 'stream-chat';
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const router = express.Router();
const slugs = ['Python', 'JavaScript', 'Java', 'Rust', 'C', 'Go'];
const serverClient = StreamChat.getInstance(apiKey, apiSecret);
const defaultUserId = "admin"; 
const signInKey = process.env.JWT_SIGN_IN_KEY

function sanitizeChannelId(slug) {
  return slug.replace(/[^a-zA-Z0-9-_!]/g, '_'); 
}

async function createCommunityChannels() {
  for (const slug of slugs) {
    try {
      const sanitizedSlug = sanitizeChannelId(slug);
      const channel = serverClient.channel('messaging', sanitizedSlug, {
        image: 'https://getstream.io/random_png/?name=react',
        name: `${slug} Community`,
        created_by_id: defaultUserId,
        members: [defaultUserId],
      });
      await channel.create();
      await channel.addMembers([defaultUserId]);
    } catch (error) {
      console.error(`Error creating channel ${slug}:`, error);
    }
  }
}

createCommunityChannels();
async function generateToken(id) {
  await serverClient.upsertUser({ id : id ,role: "admin",});
  return serverClient.createToken(id);
}
export const loginUser = async (req,res) => {
    const {name,password} = req.body;
    if(!name || !password){
        return res.status(400).json({message:"Please Enter all the fields"});
    }
    try {
        const findUser = await Register.findOne({ name });
        if (!findUser) {
          return res.status(400).json({ message: "User Does not Exists" });
        }
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid Credentials" });
        }
        const userID = findUser._id.toString();
        const token = await generateToken(userID);
        const jwtToken = jwt.sign({id: userID, token, userName: findUser.name , userEmailId : findUser.email}, signInKey , {expiresIn : '1h'});
        res.status(200).json({ message: "Login Successfull",jwtToken : jwtToken});
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
}