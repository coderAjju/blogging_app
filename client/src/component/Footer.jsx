import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaFacebookSquare,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";

const FooterCom = () => {
  return (
    <Footer container className="border border-t-8 w-full border-teal-500">
      <div className="w-full flex flex-col gap-5">
        <div className="flex justify-between items-center flex-col sm:flex-row w-full gap-3 sm:gap-0">
          <div className="">
            <Link to="/" className="font-semibold text-xl">
              Blog App
            </Link>
          </div>
          <div className="">
            <Footer.LinkGroup className="flex items-center">
              <Footer.Link href="/">Home</Footer.Link>
              <Footer.Link href="/about">About</Footer.Link>
              <Footer.Link href="#">Blogs</Footer.Link>
              <Footer.Link href="#">Contact Us</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div className="flex gap-4 items-center">
            <FaTwitter className="size-5" />
            <FaFacebookSquare className="size-5" />
            <FaInstagram className="size-5" />
            <FaPinterest className="size-5" />
          </div>
        </div>
        <div className="flex justify-center items-center  gap-3 flex-col-reverse ">
        <Footer.Copyright href="#" by="Coderajju™" year={2024} />
        <Footer.LinkGroup className="flex items-center">
              <Footer.Link href="#">Terms</Footer.Link>
              <Footer.Link href="#">Policy</Footer.Link>
            </Footer.LinkGroup>
        </div>

      </div>
    </Footer>
  );
};

export default FooterCom;
