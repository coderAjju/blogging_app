import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from '../component/PostCard'

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    order: "desc",
    category: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const orderFromUrl = urlParams.get("order");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || orderFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        order: orderFromUrl,
        category: categoryFromUrl,
      });
    }


    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await axiosInstance.get(
          `/api/post/getposts?${searchQuery}`
        );
        setPosts(res.data.posts);
        if (res.data.posts.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "order") {
      const order = e.target.value || "desc";
      setSidebarData({
        ...sidebarData,
        order: order,
      });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({
        ...sidebarData,
        category: category,
      }); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchQuery = new URLSearchParams(sidebarData).toString();
    (async()=>{
      try {
        setLoading(true);
        let urlParams = new URLSearchParams(location.search);
        const searchQuery = urlParams.toString();
        const res = await axiosInstance.get(
          `/api/post/getposts?${searchQuery}`
        );
        setPosts(res.data.posts);
        if (res.data.posts.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    })()
    navigate(`/search?${searchQuery}`);
  };

 
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label>Search Term:</label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              value={sidebarData.searchTerm}
              type="text"
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="" className="font-semibold">
              order:
            </label>
            <Select onChange={handleChange} value={sidebarData.order} id="order">
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="" className="font-semibold">
              Category:
            </label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">Javascript</option>
            </Select>
          </div>
          <Button outline gradientDuoTone="purpleToBlue" className="w-full mt-4" type="submit">Apply filter</Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">Post results:</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {
            !loading && posts.length === 0 && <p className="text-xl text-gray-500">No post found</p>
          }
          {
            loading && <p className="text-xl text-gray-500">Loading...</p> 
          }
          {
            !loading && posts && posts.map((post)=>(
              <PostCard key={post._id} post={post} />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Search;
