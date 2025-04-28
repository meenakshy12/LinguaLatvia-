import React from 'react'
import SideBar from './Sidebar/SideBar'
import Navbar from './Navbar'

const Wrapper = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 bg-white">
                <Navbar />
    {/* <div className="flex gap-3 relative h-full w-full z-0 "> */}
        {/* <SideBar/> */}
      <div className="content container mx-auto ">{children}</div>
    </div>
    // </div>

  )
}

export default Wrapper