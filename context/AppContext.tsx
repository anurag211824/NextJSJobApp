/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";

import { getSession } from "@/service/session";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await getSession();
        const id = user.id;
        console.log(id);
        const response = await fetch(`http://localhost:3000/api/user/${id}`);
        const responseData = await response.json();
        if (responseData.success) {
          setUser(responseData.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};
