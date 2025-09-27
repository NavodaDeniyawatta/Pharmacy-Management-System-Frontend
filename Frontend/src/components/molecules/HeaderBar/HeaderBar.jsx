import React, { useState, useEffect } from "react";
import { NavigationBar } from "../../atoms";
import { Images } from "../../../constants";
import { useLocation, useNavigate } from "react-router";

const HeaderBar = () => {
  const Navigate = useNavigate();
  const Location = useLocation();

  const [userData, setUserData] = useState(null);

  // Check if the user is logged in by retrieving from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  return (
    <div className="px-10 py-5 w-full fixed top-0 z-10 bg-blue-200 flex items-center justify-between">
      <img className="h-[70px] w-[70px]" src={Images.logo} alt="Logo" />

      {/* NavigationBar */}
      <NavigationBar
        navigations={[
          { path: "/", title: "Home" },
          { path: "/contact", title: "Contact" },
          { path: "/about", title: "About" },
        ]}
        userData={userData} // Pass userData to NavigationBar
      />

      {/* Render Login/Logout based on user authentication */}
      {!userData && (
        <>
          <button
            onClick={() => Navigate("/login")}
            className={`${
              Location.pathname === "/login" ? "hidden" : "md:block"
            } px-4 hidden py-2 border-3 border-black font-semibold text-[18px] rounded-full ml-8 cursor-pointer hover:bg-green-200 hover:text-slate-900 transition-all duration-300`}
          >
            Log In
          </button>
          <button
            onClick={() => Navigate("/register")}
            className={`${
              Location.pathname === "/register" ||
              Location.pathname === "/" ||
              Location.pathname === "/about" ||
              Location.pathname === "/contact"
                ? "hidden"
                : "md:block"
            } px-4 hidden py-2 border-3 border-black font-semibold text-[18px] rounded-full ml-8 cursor-pointer hover:bg-green-200 hover:text-slate-900 transition-all duration-300`}
          >
            Register
          </button>
        </>
      )}
    </div>
  );
};

export default HeaderBar;
