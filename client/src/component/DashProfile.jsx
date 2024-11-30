import React from "react";
import useAuthStore from "../zustant/useAuthStore";
import { Button, TextInput } from "flowbite-react";
import axiosInstance from "../lib/axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";

const DashProfile = () => {
  const navigate = useNavigate();
  const filePickerRef = React.useRef();
  const { authUser, setUser } = useAuthStore();
  const [imageFile, setImageFile] = React.useState(null);
  const [imageFileUrl, setImageFileUrl] = React.useState(null);
  const [blobImage, setBlobImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [showModel, setShowModel] = React.useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file)
    if(file){
      setBlobImage(URL.createObjectURL(file))
    }
  };
  
  const handleUploadImage = async () => {
    if (!imageFile) {
      alert("Please select a file first.");
      return;
    }

    // this is hold the blog image only
    const blogImage = new FormData();
    blogImage.append("file", imageFile);

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/api/auth/upload",
        blogImage,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImageFile({ image: response.data.url });
      setImageFileUrl(response.data.url);
      setUser({ ...authUser, profilePic: response.data.url });
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: authUser.name,
      email: authUser.email,
      profilePicture: authUser.profilePic
    },
  });

  const updateUserInfo = async (data) => {
    if (authUser.username === data.username && authUser.email === data.email && authUser.profilePic === imageFileUrl) {
      return toast.error("No changes made");
    }

    await handleUploadImage();

    try {
      const res = await axiosInstance.post(
        `/api/user/update/${authUser._id}`,
        data
      );
      toast.success(res.data.message);
      setUser(res.data.user);
    } catch (error) {
      toast.error(error.response.data.message || error.message);
      console.log(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }

    
  };

  const handleDeleteUser = async () => {
    try {
      console.log(authUser._id);
      const res = await axiosInstance.delete(
        `/api/user/delete/${authUser._id}`
      );
      toast.success(res.data.message);
      setUser(null);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message || error.message);
      console.log(error.response.data.message || error.message);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <div
          className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg flex flex-col  items-center w-full mx-auto">
      <h1 className="my-7 font-semibold text-center text-3xl">Proflie</h1>
      <input type="file" ref={filePickerRef} onChange={handleImage} className="hidden" />
      <form
        onSubmit={handleSubmit(updateUserInfo)}
        className="w-full flex items-center flex-col gap-4"
      >
        <div
          className="size-32 shadow-md rounded-full cursor-pointer overflow-hidden"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={authUser.profilePic || blobImage}
            alt="user"
            className=" rounded-full w-full h-full border-8 borer-[lightgray] object-cover"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={authUser.username}
          className="w-full "
          {...register("username", {
            minLength: {
              value: 4,
              message: "Username must be at least 8 characters long",
            },
          })}
        />
        {errors.username && (
          <span className="text-red-500">{errors.username.message}</span>
        )}
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={authUser.email}
          className="w-full "
          {...register("email", {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
        <Button className="w-full" type="submit">
          Update
        </Button>
        {
        authUser && authUser.isAdmin &&
        <Link to={`/createPost`} className='w-full'>
        <Button className='w-full' gradientDuoTone="purpleToBlue">Create Post</Button>
        </Link>
      }
      </form>
      <div className="text-red-500 items-start flex justify-between w-full mt-2">
        <button
          onClick={() => setShowModel(true)}
          data-modal-target="popup-modal"
          data-modal-toggle="popup-modal"
          className="block border-2 border-red-500 p-2 rounded-md hover:bg-red-500 hover:text-white ring-0 bg-transparent"
          type="button"
        >
          Delete Account
        </button>
        <span
          className=" cursor-pointer block border-2 border-red-500 p-2 rounded-md hover:bg-red-500 hover:text-white ring-0 bg-transparent"
          onClick={handleSignOut}
        >
          Sign Out
        </span>
      </div>

      {showModel && (
        <Modal
          handleDeleteUser={handleDeleteUser}
          setShowModel={setShowModel}
          message="account"
        />
      )}
    </div>
  );
};

export default DashProfile;
