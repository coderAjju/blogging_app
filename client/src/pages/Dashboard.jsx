import React from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../component/DashSidebar'
import DashProfile from '../component/DashProfile'
import DashPost from '../component/DashPost'
import DashUsers from '../component/DashUsers'
import DashComment from '../component/DashComment'
import DashboardCom from '../component/DashboardCom'
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi'
import useMenuStore from '../zustant/useMenuStore'
const Dashboard = () => {
  const location = useLocation();
  const {openMenu,menuOpen,closeMenu} = useMenuStore();
  const [tab, settab] = React.useState("")
  React.useEffect(() => {
    let urlParams = new URLSearchParams(location.search);
    let tabFromUrl = urlParams.get("tab");
    settab(tabFromUrl)

  },[location])
  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      <div className="lg:w-56 ">
        {/*  sidebar */}
        <DashSidebar />
        </div>

        {/* profile */}
        {tab === "profile" && <DashProfile/>}

        {/* posts */}
        {tab === "posts" && <DashPost/>}

        {/* users */}
        {tab === "users" && <DashUsers/>}

        {/* comment */}
        {tab === "comments" && <DashComment/>}

        {/* dashboard */}
        { tab === "dashboard" && <DashboardCom/>}
    </div>
  )
}

export default Dashboard