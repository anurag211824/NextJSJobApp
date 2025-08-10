/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
'use client'
import React from "react";
import JobFilterSidebar from "./JobFilterSidebar";
import { useState } from "react";
import { Filter } from "lucide-react";
const MobileFilterSiderBar = () => {
    const [showsidebar,setshowsidebar] =  useState(false)
    const handleShowSidebar = ()=>{
       setshowsidebar(!showsidebar)
    }
  return (
    <div>
      <button onClick={handleShowSidebar} className="lg:hidden ml-2 mt-2"> <Filter className="w-5 h-5" />
      </button>
      <div className={`${showsidebar === true ? "translate-x-0" : "-translate-x-full"} lg:hidden w-64 fixed z-1000 top-[70px] left-0 bg-black h-screen`}>
        <JobFilterSidebar handleShowSidebar = {handleShowSidebar} />
      </div>
    </div>
  );
};

export default MobileFilterSiderBar;
