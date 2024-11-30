import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if (userId !== req.userId) {
      return res.status(403).json({
        message: "You are not allowed to create this comment",
      });
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }
    let userIndex = comment.likes.indexOf(req.userId);
    console.log(userIndex);
    if (userIndex === -1) {
      comment.numberOfLikes++;
      comment.likes.push(req.userId);
    } else {
      comment.numberOfLikes--;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }
    if (comment.userId !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to edit this comment",
      });
    }

    comment.content = req.body.content;
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }
    if (comment.userId !== req.userId && !req.isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to delete this comment",
      });
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({message:"Comment deleted successfully"});
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({
      message: "You are not allowed to get all comments",
    });
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};
