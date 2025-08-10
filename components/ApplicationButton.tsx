/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useState } from "react";
import { Button } from "./ui/button";
import { getSession } from "@/service/session";

const ApplicationButton = ({ jobData, hasApplied }) => {
  const [userApplied, setuserApplied] = useState(hasApplied);
  console.log(jobData);

  const handleSubmitApplication = async () => {
    const user = await getSession();
    const userId = user.id;
    const jobId = jobData.id;
    try {
      const response = await fetch("/api/application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          job_id: jobId,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        console.log(responseData.message);
        setuserApplied(true);
      } else {
        setuserApplied(true);
        console.log("Error:", responseData.error);
      }
    } catch (error) {
      console.error("Application error:", error);
    }
  };

  const handleApplicationDelete = async () => {
    const user = await getSession();
    const userId = user.id;
    const jobId = jobData.id;
    
    try {
      const response = await fetch("/api/application", { 
        method: "DELETE", 
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: jobId,
          userId: userId,
        }),
      });

      const responseData = await response.json(); 
      
      if (responseData.success) {
        setuserApplied(false);
      } else {
        console.log("Delete Error:", responseData.error);
      }
    } catch (error) { 
      console.error("Delete error:", error);
    }
  };

  return (
    <>
      {userApplied ? (
        <Button onClick={handleApplicationDelete} className="w-full bg-red-500" variant="outline">
          Delete Application
        </Button>
      ) : (
        <Button onClick={handleSubmitApplication} className="w-full bg-green-500" variant="outline">
          Apply Now
        </Button>
      )}
    </>
  );
};

export default ApplicationButton;