import React from 'react'
import SideBar from './Sidebar/SideBar'

const Wrapper = ({children}) => {
  return (
    <div className="flex gap-3 h-full w-full ">
        {/* <SideBar/> */}
      <div className="content">{children}</div>
    </div>

  )
}

export default Wrapper