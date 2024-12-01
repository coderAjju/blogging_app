import { useEffect, useState } from "react";
import useAuthStore from "../zustant/useAuthStore";
import axiosInstance from "../lib/axios";
import { Table } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import toast from "react-hot-toast";

const DashPost = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get(
          `/api/post/getposts`
        );
        // /api/post/getposts?userId=${authUser._id} pass this in get request to get specific admin blog 

        setUserPosts(res.data.posts);

        if (res.data.posts.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.error(error);
      }finally{
        setLoading(false)
      }
    };
    if (authUser.isAdmin) {
      fetchPosts();
    }
  }, [authUser._id]);

  const handleShowMore = async () => {
    const startIndex = 9;
    try {
      const res = await axiosInstance.get(
        `/api/post/getposts?startIndex=${startIndex}`
      );
      setUserPosts((prev) => [...prev, ...res.data.posts]);
      console.log("incoming data after clicking on show more ",res.data)
      if (res.data.posts.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDeletePost = async () => {
    try {
      const res = await axiosInstance.delete(`/api/post/deletepost/${postIdToDelete}/${authUser._id}`);
      toast.success(res.data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response.data.message || error.message);
      console.log(error.response.data.message || error.message);
    }
  };
  if(loading){
    return <div>
      loading...
    </div>
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {authUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell> Post title </Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body key={post._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="dark:text-white">
                    {post.category}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
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
        <p>You have no post</p>
      )}
      {showModal && (
        <Modal
          handleDeleteUser={handleDeletePost}
          setShowModel={setShowModal}
          message="post"
        />
      )}
    </div>
  );
};

export default DashPost;
