import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import Header from "./component/Header";
import { Toaster } from "react-hot-toast";
import FooterCom from "./component/Footer";
import useAuthStore from "./zustant/useAuthStore";
import CreatePostPage from "./pages/CreatePostPage";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./component/ScrollToTop";
import Search from "./pages/Search";
import ContactUs from "./pages/ContactUs";
const App = () => {
  const { authUser } = useAuthStore();
  return (
    <div>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/signin"} />}
        />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/signup" element={authUser ? <Home /> : <Signup />} />
        <Route path="/signin" element={authUser ? <Home /> : <SignIn />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/dashboard"
          element={authUser ? <Dashboard /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/createPost"
          element={
            authUser && authUser.isAdmin ? (
              <CreatePostPage />
            ) : (
              <Navigate to={"/"} />
            )
          }
        />
        <Route
          path="/update-post/:postId"
          element={
            authUser && authUser.isAdmin ? (
              <UpdatePost />
            ) : (
              <Navigate to={"/"} />
            )
          }
        />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <FooterCom />
      <Toaster />
    </div>
  );
};

export default App;
