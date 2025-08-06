/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";

import { usePathname, useRouter } from "next/navigation";
import SearchForm from "./SearchForm";
import { User, LogOut, Plus, Building } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "./ui/button";
import { getSession } from "@/service/session";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasCompany, setHasCompany] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check if user has a company
  useEffect(() => {
    if (user?.role === "employer") {
      checkUserCompany();
    }
  }, [user]);

  const checkUserCompany = async () => {
    try {
      const sessionUser = await getSession();
      if (!sessionUser?.id) {
        console.log("No session user found");
        return;
      }

      const userId = sessionUser.id;
      const response = await fetch(
        `http://localhost:3000/api/user/company/${userId}`
      );
      const responseData = await response.json();

      if (responseData.success) {
        console.log(responseData.hasCompany);

        setHasCompany(responseData.hasCompany);
      } else {
        console.error("API error:", responseData.error);
      }
    } catch (error) {
      console.error("Error checking user company:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setUser({
        id: "",
        email: "",
        role: "",
      });

      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to login page or home page after successful logout
        router.push("/sign-in");
        router.refresh(); // Refresh to update the app state
      } else {
        console.error("Logout failed:", data.error);
        alert("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isAdminRoute = pathname?.startsWith("/employer");
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const showHeader = !isAdminRoute && !isAuthRoute;

  if (!showHeader) {
    return null;
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 40 40"
              className="w-10 h-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" style={{ stopColor: "#4F46E5" }} />
                  <stop offset="100%" style={{ stopColor: "#7C3AED" }} />
                </linearGradient>
                <filter id="logoGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background circle */}
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="url(#logoGradient)"
                filter="url(#logoGlow)"
              />

              {/* Briefcase icon */}
              <rect
                x="12"
                y="14"
                width="16"
                height="12"
                rx="2"
                fill="white"
                opacity="0.9"
              />
              <rect
                x="14"
                y="16"
                width="2"
                height="8"
                fill="url(#logoGradient)"
                opacity="0.7"
              />
              <rect
                x="17"
                y="16"
                width="2"
                height="8"
                fill="url(#logoGradient)"
                opacity="0.7"
              />
              <rect
                x="20"
                y="16"
                width="2"
                height="8"
                fill="url(#logoGradient)"
                opacity="0.7"
              />
              <rect
                x="23"
                y="16"
                width="2"
                height="8"
                fill="url(#logoGradient)"
                opacity="0.7"
              />

              {/* Handle */}
              <rect
                x="17"
                y="11"
                width="6"
                height="3"
                rx="1"
                fill="white"
                opacity="0.9"
              />

              {/* Shine effect */}
              <circle cx="16" cy="16" r="2" fill="white" opacity="0.3">
                <animate
                  attributeName="opacity"
                  values="0.3;0.6;0.3"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>

            {/* Brand name - visible only on big screens */}
            <h1 className="hidden lg:block text-xl font-bold text-white bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
              Job Flow
            </h1>
          </div>

          {/* Search Form using Shadcn */}
          <SearchForm />

          {/* Profile Icon using Shadcn */}
          <div className="flex items-center relative">
            <div
              className="cursor-pointer p-2 rounded-full"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <User className="w-7 h-7 text-muted-foreground" />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 top-12 bg-black border border-gray-200 rounded-lg shadow-lg w-64 z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  {user?.role && (
                    <span className="inline-block px-2 py-1 mt-2 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                      {user.role}
                    </span>
                  )}
                </div>

                <div className="p-2 flex flex-col ">
                  {user?.role === "employer" ? (
                    <>
                      {hasCompany ? (
                        <Button
                          variant="ghost"
                          className="w-[70%] justify-start gap-2 mb-1 bg-blue-400 text-white hover:bg-blue-500"
                          onClick={() => {
                            window.location.href = "/employer/jobs/create";
                            setShowDropdown(false);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          Add Job
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-[70%] justify-start gap-2 mb-1 bg-blue-400 text-white hover:bg-blue-500"
                          onClick={() => {
                            window.location.href = "/employer/company/create";
                            setShowDropdown(false);
                          }}
                        >
                          <Building className="w-4 h-4" />
                          Create Company
                        </Button>
                      )}
                    </>
                  ) : null}

                  <Button
                    variant="ghost"
                    className="w-[70%] justify-start gap-2 bg-red-400 text-white hover:bg-red-500"
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    {isLoggingOut ? "Logging out..." : "Log Out"}
                  </Button>
                </div>
              </div>
            )}

            {/* Overlay to close dropdown when clicking outside */}
            {showDropdown && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
