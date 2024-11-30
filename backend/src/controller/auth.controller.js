import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import { generateTokenAndSetCookie } from "../helper/generateToken.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      next(errorHandler(400, "All fields are required"));
    }

    let existingEmail = await User.findOne({ email });
    if (existingEmail) {
      next(errorHandler(400, "Email already exists"));
    }
    let existingUsername = await User.findOne({ username });
    if (existingUsername) {
      next(errorHandler(400, "Username already exists"));
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let newUser = await User({
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      await newUser.save();
    }

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      next(errorHandler(400, "All fields are required"));
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await generateTokenAndSetCookie(user._id, user.isAdmin, res);
    return res
      .status(200)
      .json({ message: "User logged in successfully", user });
  } catch (error) {
    console.log("error occured in signin controller ", error.message);
    next(error);
  }
};

export const dataComingFromGoogle = async (req, res, next) => {
  try {
    const { name, email, profilePic } = req.body;
    console.log(profilePic);
    const user = await User.findOne({ email });
    if (user) {
      await generateTokenAndSetCookie(user._id, res);
      let { password, ...rest } = user._doc;
      return res.status(200).json({ user: rest });
    } else {
      let generatePassword =
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2);

      let hashedPassword = await bcrypt.hash(generatePassword, 10);

      const newUser = await User.create({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: profilePic,
      });
      await newUser.save();
      await generateTokenAndSetCookie(newUser._id, res, "access_token");
      let { password, ...rest } = newUser._doc;
      return res.status(200).json({ user: rest });
    }
  } catch (error) {
    next(error);
  }
};

// controller for profile pic upload 👇
export const uploadProfilePic = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload file to Cloudinary using a stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.log("upload failed error: ", error);
          return res.status(500).json({ error: "Upload failed" });
        }
        res.status(200).json({ url: result.secure_url });
      }
    );

    // Convert the buffer to a readable stream and pipe it to the upload stream
    const bufferStream = Readable.from(file.buffer);
    bufferStream.pipe(uploadStream);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
