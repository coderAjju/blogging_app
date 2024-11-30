import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import useAuthStore from "../zustant/useAuthStore";
import { Button, Textarea } from "flowbite-react";
import toast from "react-hot-toast";
const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);

  const { authUser } = useAuthStore();
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosInstance.get(`/api/user/${comment.userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment.userId]);

  const handleEdit = async () => {
    if (authUser._id !== comment.userId) {
      toast.error("You are not authorized to edit this comment");
      return;
    }
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const newComment = await axiosInstance.put(
        `/api/comment/editcomment/${comment._id}`,
        { content: editedComment }
      );
      setEditing(false);
      onEdit(newComment, editedComment);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if(authUser._id !== comment.userId){
      toast.error("You are not authorized to delete this comment");
      return
    }
    onDelete(comment._id);
  }

  return (
    <div className="flex gap-2 items-center border-b p-4 dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3 ">
        {user && (
          <img
            className="size-10 rounded-full bg-gray-200"
            src={user.profilePicture || ""}
            alt={user.username}
          />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {editing ? (
          <>
            <Textarea
              className="w-full p-2 text-gray-700 bg-gray-200 rounded-md resize-none focus:outline-none focus:bg-gray-100"
              rows={3}
              onChange={(e) => setEditedComment(e.target.value)}
              value={editedComment}
            />
            <div className="w-full flex justify-end">
              <div className="flex gap-2 mt-2">
                <Button onClick={handleSave}>Save</Button>
                <Button
                  onClick={() => {
                    setEditedComment(comment.content);
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                className={`text-gray-400 hover:text-blue-500 ${
                  authUser &&
                  comment.likes.includes(authUser._id) &&
                  "!text-blue-500"
                }`}
                type="button"
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes > 1 ? "likes" : "like")}
              </p>
              {authUser &&
                (authUser._id === comment.userId || authUser.isAdmin) && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-red-500"
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-gray-400 hover:text-red-500"
                      type="button"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
