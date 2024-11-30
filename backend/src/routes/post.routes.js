import express from 'express'
import {protectRoute} from '../middleware/protectRoute.js'
import {createPost,getAllPosts,deletePost,updatePost  } from '../controller/post.controller.js'
const router = express.Router();

router.post("/create",protectRoute ,createPost);
router.get("/getposts",protectRoute,getAllPosts)
router.delete("/deletepost/:postId/:userId",protectRoute,deletePost)
router.put("/updatepost/:postId/:userId",protectRoute,updatePost);
export default router;
