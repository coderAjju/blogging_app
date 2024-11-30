import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const updateUserInfo = async (req, res, next) => {
  try {
    if (req.userId !== req.params.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.body.username) {
      if (!req.body.username.length > 7 && !req.body.username.length < 20) {
        return next(
          errorHandler(400, "Username must be between 7 and 20 characters")
        );
      }
      if (req.body.username.includes(" ")) {
        return next(errorHandler(400, "Username cannot contain spaces"));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, "Username must be lowercase"));
      }
      if (!req.body.username.match(/^[a-z0-9_]+$/)) {
        return next(
          errorHandler(
            400,
            "Username can only contain letters, numbers, and underscores"
          )
        );
      }
    }
    let UpdatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        username: req.body.username,
        email: req.body.email,
        profilePicture:req.body.profilePicture
      },
      { new: true }
    );
    const { password, ...rest } = UpdatedUser._doc;
    return res
      .status(200)
      .json({ user: rest, message: "updation successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    console.log(req.userId, req.params.userId);
    if (req.userId !== req.params.userId) {
      return next(errorHandler(401, "Unauthorized"));
    }
    await User.findByIdAndDelete(req.params.userId);
    return res
      .cookie("token", null)
      .status(200)
      .json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    return res
      .cookie("token", null)
      .status(200)
      .json({ message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  if (!req.isAdmin) {
    return res
      .status(403)
      .json({ message: "You are not allowed to get all users" });
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    let usersWithoutTheirPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now =new Date();
    
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    }) 

    return res.status(200).json({ users: usersWithoutTheirPassword, totalUsers,lastMonthUsers });

  } catch (error) {
    next(error);
  }
};

export const userDeleteByAdmin = async(req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.userId);
    return res.status(200).json({message:"User deleted successfully"})    
  } catch (error) {
    next(error);
  }
}

export const getSpecificUser = async(req,res,next)=>{
  try {
    const user = await User.findById(req.params.userId);
    const {password,...rest} = user._doc;
    return res.status(200).json({user:rest})
  } catch (error) {
    console.log(error)
    next(error);
  }
}