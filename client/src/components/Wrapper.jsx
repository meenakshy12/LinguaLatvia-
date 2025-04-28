import React from 'react'
import Navbar from './Navbar'

const Wrapper = ({children}) => {
  return (
    <div className="flex flex-col min-h-[100dvh] relative max-h-full bg-gradient-to-b from-blue-100 to-blue-50 overflow-hidden">
      <Navbar />
      {/* <div className="flex gap-3 relative h-full w-full z-0 "> */}
      {/* <SideBar/> */}
      <div className="content container mx-auto ">{children}</div>
    </div>
    // </div>
  );
}

export default Wrapper