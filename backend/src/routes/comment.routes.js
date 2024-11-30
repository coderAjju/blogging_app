import express from 'express'
import {protectRoute} from '../middleware/protectRoute.js'
import { createComment,getPostComments,getAllComments ,likeComment,editComment,deleteComment} from '../controller/comment.controller.js';
const router = express.Router();

router.post("/create",protectRoute,createComment)
router.get("/getPostComments/:postId",protectRoute,getPostComments)
router.put("/likedComment/:commentId",protectRoute,likeComment)
router.put("/editComment/:commentId",protectRoute,editComment)
router.delete("/deleteComment/:commentId",protectRoute,deleteComment)
router.get("/getAllComments",protectRoute,getAllComments)
export default router;