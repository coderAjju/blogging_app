import { useEffect, useState } from 'react'
import CallToAction from '../component/CallToAction'
import axiosInstance from '../lib/axios';
import PostCard from '../component/PostCard';
import { Link } from 'react-router-dom';
import useAuthStore from '../zustant/useAuthStore';
const Home = () => {
  
  const {setUser} = useAuthStore();
  
  
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    let tokenExpireTime = parseInt(localStorage.getItem("authUserTokenExpireAt"));
    if(tokenExpireTime && Date.now() < tokenExpireTime){
       setUser(null);
    }
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("/api/post/getposts?limit=9");
        setPosts(res.data.posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  },[])

  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 sm:mx-20 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.</p>
      <Link to={"/search"} className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>View all post</Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction/>
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {
          posts && posts.length > 0 && (
            <div className='flex items-center flex-col'>
              <h2>Recent Posts</h2>
              <div className='flex flex-wrap gap-6 justify-center mt-6'>
                {
                  posts.map(post=>(
                    <PostCard key={post._id} post={post}/>
                  ))
                }
              </div>
              <Link to={'/search'} className='text-lg my-4  text-teal-500 hover:underline text-center'>View all posts</Link>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Home