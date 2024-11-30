import { useEffect, useState } from "react";
import useAuthStore from "../zustant/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Button, Textarea } from "flowbite-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [comment, setComment] = useState("");
  const [commentCharCount, setCommentCharCount] = useState(200);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLength, setcommentsLength] = useState();

   const handleCommentChar = (e) => {
    setComment(e.target.value);
    setCommentCharCount(200 - (comment.length + 1));
  };

  // this function will handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (comment.length > 200) {
      return toast.error("comment should be 200 characters");
    }
    try {
      await axiosInstance.post("/api/comment/create", {
        content: comment,
        postId,
        userId: authUser._id,
      });

      toast.success("Comment created successfully");


      setComment("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/comment/getPostComments/${postId}`
        );
        setComments(res.data);
        setcommentsLength(res.data.length);
      } catch (error) {
        console.log(error);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId)=>{
    if(!authUser){
      navigate("/signin")
      return ;
    }
    try {
      console.log(commentId);
      const res = await axiosInstance.put(`/api/comment/likedComment/${commentId}`)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = async (comment,editComment) =>{
    setComments(
      comments.map((c)=>{
        return c._id === comment._id ? {...c,content:editComment} : c
      })
    )
  }

  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/api/comment/deleteComment/${commentId}`);
      setComments(
        comments.filter((c) => {
          return c._id !== commentId;
        })
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {authUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="size-5 object-cover rounded-full"
            src={authUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tag=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{authUser.username}
          </Link>
        </div>
      ) : (
        <div>
          You must be signed in to comment.
          <Link to={"/signin"}>Sign In</Link>
        </div>
      )}
      {authUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength="200"
            value={comment}
            onChange={handleCommentChar}
          />
          <div className="flex justify-between items-center mt-3">
            <p>{commentCharCount} characters remaining</p>
            <Button
              disabled={loading ? true : false}
              type="submit"
              outline
              gradientDuoTone="purpleToBlue"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      )}
      {commentsLength === 0 ? (
        <div className="my-5 text-sm">No comments yet</div>
      ) : (
        <>
          <div className="my-5 flex items-center gap-2">
            <p>Comments</p>
            <div className="border border-gray-400 py-0 px-2  rounded-sm">
              <p>{commentsLength}</p>
            </div>
          </div>
          {comments.map((comment) => {
            return <Comment comment={comment} onDelete={handleDelete} key={comment._id} onEdit={handleEdit} onLike={handleLike}/>;
          })}
        </>
      )}
    </div>
  );
};

export default CommentSection;
