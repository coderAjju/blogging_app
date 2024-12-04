import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowSmRight, HiDocument, HiOutlineUserGroup, HiAnnotation } from "react-icons/hi";
import useAuthStore from "../zustant/useAuthStore";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
const DashSidebar = () => {
  const location = useLocation();
  const {authUser, setUser} = useAuthStore();
  const navigate = useNavigate();
  const [tab, settab] = React.useState("");
  React.useEffect(() => {
    let urlParams = new URLSearchParams(location.search);
    let tabFromUrl = urlParams.get("tab");
    settab(tabFromUrl);
  }, [location]);

  const handleSignOut = async () => {
    try {
      const res = await axiosInstance.get("/api/user/signout");
      toast.success(res.data.message);
      setUser(null);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message || error.message);
      console.log(error.response.data.message || error.message);
    }
  };
  return (
    <Sidebar className="w-full md:h-screen  ">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
        {authUser.isAdmin && (
            <Link to="/dashboard?tab=dashboard">
            <Sidebar.Item
              active={tab === "dashboard"}
              icon={HiDocument}
              labelColor={"dark"}
              as="div"
              >
              Dashboard
            </Sidebar.Item>
          </Link>
            )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"Admin"}
              labelColor={"dark"}
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {authUser.isAdmin && (
            <Link to="/dashboard?tab=posts">
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocument}
              labelColor={"dark"}
              as="div"
              >
              Posts
            </Sidebar.Item>
          </Link>
            )}
             {authUser.isAdmin && (
            <Link to="/dashboard?tab=comments">
            <Sidebar.Item
              active={tab === "comments"}
              icon={HiAnnotation}
              labelColor={"dark"}
              as="div"
              >
              Comments
            </Sidebar.Item>
          </Link>
            )}
            {authUser.isAdmin && (
            <Link to="/dashboard?tab=users">
            <Sidebar.Item
              active={tab === "users"}
              icon={HiOutlineUserGroup}
              labelColor={"dark"}
              as="div"
              >
              Users
            </Sidebar.Item>
          </Link>
            )}
          <Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} className="cursor-pointer">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
