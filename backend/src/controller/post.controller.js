import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req,res,next)=> {
    
    if(!req.isAdmin){
        return next(errorHandler(403,"You are not allowed to create post"))
    };
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400,"Please provide all required fields"))
    }
    const slug = req.body.title.trim().split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "-");
    const newPost = new Post({
        ...req.body,slug,userId:req.userId
        })

    try {
        const savedPost = await newPost.save();
        return res.status(201).json({post:savedPost,message:"Post created successfully"})
    } catch (error) {
        if (error.code === 11000) {

            // Handle MongoDB duplicate key error
            return res.status(400).json({ 
              message: `title already exists. Please use a different title.`
            });
        next(error)
    }
}
}

export const getAllPosts = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      
      const limit = parseInt(req.query.limit) || 9;
      
      const sortDirection = req.query.order === 'asc' ? 1 : -1;

      const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { content: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      })
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
  
      const totalPosts = await Post.countDocuments();
  
      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
  
      const lastMonthPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({  
        posts,
        totalPosts,
        lastMonthPosts,
      });
    } catch (error) {
      next(error);
    }
  };


export const deletePost =async (req,res,next)=>{
    if(!req.isAdmin || req.userId !== req.params.userId){
        return next(errorHandler(403,"You are not allowed to delete post"))
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        return res.status(200).json({message:"Post deleted successfully"})
    } catch (error) {
        next(error)
    }
}

export const updatePost = async (req,res,next) => {
    
    if(!req.isAdmin || req.userId !== req.params.userId){
        return next(errorHandler(403,"You are not allowed to update post"))
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId,req.body,{new:true});
        return res.status(200).json({post:updatedPost,message:"Post updated successfully"})
    } catch (error) {
        next(error)
    }
}