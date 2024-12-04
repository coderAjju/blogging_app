import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import 'highlight.js/styles/github.css'; // For syntax highlighting
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { modules,formats } from "../constant";
const CreatePostPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const handleUploadPost = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    // this is hold the blog image only
    const blogImage = new FormData();
    blogImage.append("file", file);

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
      setFormData({ ...formData, image: response.data.url });
      setUploadedUrl(response.data.url);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed w-screen h-screen backdrop-blur-sm flex justify-center items-center">
        <div>uploading....</div>
      </div>
    );
  }
  const handlePublishPost = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.content) {
      return alert("Please provide all required fields");
    }

    // this code will check the blog image is uploaded or not
    if (!uploadedUrl) {
      return alert("Please upload an image first");
    }

    try {
      const res = await axiosInstance.post("/api/post/create", formData);

      toast.success(res.data.message);
      setFormData({});
      navigate("/post/" + res.data.post.slug);
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form action="" className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            placeholder="Title"
            className="flex-1"
            required
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
          value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">ReactJs</option>
            <option value="nextjs">NextJs</option>
            <option value="dotnet">DotNet</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            size="sm"
            gradientDuoTone="purpleToBlue"
            onClick={handleUploadPost}
          >
            Upload Image
          </Button>
        </div>
        {uploadedUrl && (
          <div className="w-full h-52">
            <img
              src={uploadedUrl}
              className=" w-full h-full object-cover"
              alt=""
            />
          </div>
        )}
        <ReactQuill
          theme="snow"
          className="h-80 mb-12"
          required
          modules={modules}
          formats={formats}
          placeholder="Write your blog here"
          value={formData.content}
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button
          type="button"
          gradientDuoTone="purpleToPink"
          onClick={handlePublishPost}
        >
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePostPage;
