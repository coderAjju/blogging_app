import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../component/CallToAction";
import CommentSection from "../component/CommentSection";
import PostCard from "../component/PostCard";

import 'highlight.js/styles/monokai.css'; // Monokai theme


const PostPage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [recentPost, setRecentPost] = useState([]);
  const [post, setPost] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/post/getposts?slug=${slug}`);
        setPost(res.data.posts[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();

    const fetchRecentPosts = async () => {
      try {
        const res = await axiosInstance.get(`/api/post/getposts?limit=3`);
        setRecentPost(res.data.posts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecentPosts();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto font-bold lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sx">
        <span>Publish date : {post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span>Update at : {post && new Date(post.updatedAt).toLocaleDateString()}</span>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: post && post.content }}

        className="ql-syntax editor-setting p-3 max-w-2xl mx-auto w-full"
      ></div>
      <div className="max-w-4xl mx-auto flex justify-center items-center w-full">
        <CallToAction />
      </div>
      <CommentSection postId={post._id} />
      <div className=" flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {recentPost &&
            recentPost.map((post) => {
              return <PostCard key={post._id} post={post} />;
            })}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
