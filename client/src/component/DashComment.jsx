import { useEffect, useState } from "react";
import useAuthStore from "../zustant/useAuthStore";
import axiosInstance from "../lib/axios";
import { Table } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import toast from "react-hot-toast";
import {FaCheck, FaTimes} from 'react-icons/fa'

const DashComment
 = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [loading, setLoading] = useState("");
    
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/api/comment/getAllComments`
        );

        setComments(res.data.comments);
        console.log(res.data.comments);
        if (res.data.comments.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.error(error);
      }finally{
        setLoading(false);
      }
    };
    if (authUser.isAdmin) {
      fetchComments();
    }
  }, [authUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await axiosInstance.get(
        `/api/post/getposts?userId=${authUser._id}&startIndex=${startIndex}`
      );
      setComments((prev) => [...prev, ...res.data.comments]);
      if (res.data.comments.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
 
 const handleDeleteComment = async () => {
  try {
    const res = await axiosInstance.delete(
      `/api/comment/deleteComment/${commentIdToDelete}`
    );
    toast.success(res.data.message);
    setShowModal(false);
    setCommentIdToDelete("");
    setComments((prev) =>  
      prev.filter((comment) => comment._id !== commentIdToDelete)
    )
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message || error.message);
  }
 }

 if(loading){
  return <div>
    loading ...
  </div>
 }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {authUser.isAdmin && comments.length>0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>postid</Table.HeadCell>
              <Table.HeadCell>userid</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                      {comment.cotent}
                  </Table.Cell>
                  <Table.Cell>
                      {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>
                    {comment.postId }
                  </Table.Cell>
                  <Table.Cell className="dark:text-white">
                     {comment.userid}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No user found</p>
      )}
      {showModal && (
        <Modal
          handleDeleteUser={handleDeleteComment}
          setShowModel={setShowModal}
          message="user"
        />
      )}
    </div>
  );
};

export default DashComment
;
