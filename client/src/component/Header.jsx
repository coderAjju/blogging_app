import { Avatar, Button, Dropdown, DropdownDivider, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import useAuthStore from "../zustant/useAuthStore";
import useThemeStore from "../zustant/useThemeStore";
import { useEffect, useState } from "react";
const Header = () => {
  const { authUser } = useAuthStore();
  const {theme,setTheme} = useThemeStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showInputField, setShowInputField] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  const path = useLocation().pathname;
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if(searchTermFromUrl) setSearchTerm(searchTermFromUrl)
      
    },[location.search])
    
    const handleSubmit = async (e)=>{
      e.preventDefault()
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("searchTerm",searchTerm)
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`)
      setShowInputField(false)
    } 

    
  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        {/* logo */}
        Blog App
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className={`lg:inline absolute lg:relative lg:top-0 top-16 left-5 sm:left-20 md:left-28 ${showInputField ? "block" : "hidden"} transition-all duration-300 ease-in-out `}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </form>
      <Button
        className="w-12 h-10 lg:hidden rounded-full flex justify-center items-center "
        color="gray"
        onClick={()=>setShowInputField(!showInputField)}
      >
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="12 w-12 h-10 rounded-full flex justify-center items-center "
          color="gray"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {
            theme === "dark" ? (
              <FaMoon />
            ) : (
              <FaSun />
            )
          }
        </Button>
      
        {authUser ? (
          <Dropdown
            arrowIcon={false}
                    inline
                    label={
                      <Avatar
                        alt="User settings"
                        img={authUser.profilePicture}
                        rounded={true}
                      />
                    }
          >
            <Dropdown.Header>
              <span className="block text-sm">{authUser.username}</span>
              <span className="block truncate text-sm font-medium">
                {authUser.email}
              </span>
            </Dropdown.Header>
            <DropdownDivider/>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <DropdownDivider/>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button className="" outline>
              Sign in
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/" ? true : false} as={"div"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about" ? true : false} as={"div"} onClick={()=>navigate("/about")}>
          <Link to={"/about"} >About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects" ? true : false} as={"div"} onClick={()=>navigate("/contact")}>
          <Link to={"/contact"}>Contact Us</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
