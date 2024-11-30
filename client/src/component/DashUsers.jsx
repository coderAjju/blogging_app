import { useEffect, useState } from "react";
import useAuthStore from "../zustant/useAuthStore";
import axiosInstance from "../lib/axios";
import { Table } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import toast from "react-hot-toast";
import {FaCheck, FaTimes} from 'react-icons/fa'

const DashUsers = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [loading, setLoading] = useState("");
    
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          `/api/user/getusers`
        );

        setUsers(res.data.users);
        console.log(res.data.users);
        if (res.data.users.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.error(error);
      }finally{
        setLoading(false);
      }
    };
    if (authUser.isAdmin) {
      fetchUsers();
    }
  }, [authUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length
    try {
      const res = await axiosInstance.get(
        `/api/user/getusers?startIndex=${startIndex}`
      );
      setUsers((prev) => [...prev, ...res.data.users]);
      console.log("incoming data after clicking on show more ",res.data.users)
      if (res.data.users.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
    console.log(users)
  };
 
 const handleDeleteUser = async () => {
  try {
    const res = await axiosInstance.delete(
      `/api/user/deleteUser/${userIdToDelete}`
    );
    toast.success(res.data.message);
    navigate("/");
    setShowModal(false);
    setUserIdToDelete("");
    setUsers((prev) =>  
      prev.filter((user) => user._id !== userIdToDelete)
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
      {authUser.isAdmin && users.length>0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>username</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 rounded-lg  object-cover bg-gray-500"
                      />
                  </Table.Cell>
                  <Table.Cell>
                      {user.username}
                  </Table.Cell>
                  <Table.Cell>
                      {user.email}
                  </Table.Cell>
                  <Table.Cell className="dark:text-white">
                    {user.isAdmin ? <FaCheck  className="text-green-500"/> : <FaTimes className="text-red-500"/>}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                          setShowModal(true);
                          setUserIdToDelete(user._id);
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
          handleDeleteUser={handleDeleteUser}
          setShowModel={setShowModal}
          message="user"
        />
      )}
    </div>
  );
};

export default DashUsers;
