import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, Power } from "lucide-react";
import { Images } from "../../../constants";

const NavigationBar = ({ navigations, userData }) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const Navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  console.log("userData", userData);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    // Add event listener for clicks outside the menu
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const LogOut = () => {
    const confirm = window.confirm("Are you sure to log out?");

    if (confirm) {
      Navigate("/");
      localStorage.removeItem("userData");
    }
  };

  return (
    <div className="flex items-center" ref={menuRef}>
      {/* Desktop View Navigation */}
      <div className="hidden md:flex md:justify-center md:items-center">
        {navigations.length > 0 &&
          navigations.map((nav) => (
            <Link
              key={nav.path}
              className={`text-[17px] font-semibold mr-1 hover:bg-slate-800 rounded-lg px-4 py-1 hover:text-white transition-all
                ${
                  location.pathname == nav.path
                    ? "bg-slate-800 text-white"
                    : null
                }
                `}
              to={nav.path}
            >
              {nav.title}
            </Link>
          ))}
        {userData && (
          <div className="flex">
            <div className="w-[50px] h-[50px] rounded-full ml-4 cursor-pointer overflow-hidden border-2 border-gray-300">
              <img
                onClick={() => toggleMenu()}
                src={
                  userData.image !== "" || userData.image == null
                    ? userData.image
                    : Images.unknownUser
                }
                alt="Profile"
                style={{ maxWidth: "100%" }}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <button
              onClick={LogOut}
              className="hover:text-red-500 duration-300 ml-15 cursor-pointer"
            >
              <Power />
            </button>
          </div>
        )}
      </div>

      {/* Mobile View Button */}
      <button
        className="md:hidden p-2 text-gray-700"
        onClick={() => setIsMobileView(!isMobileView)}
      >
        {isMobileView ? "" : <Menu size={28} />}
      </button>

      {/* Mobile View Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-1/2 bg-white z-50 shadow-lg transform ${
          isMobileView ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:hidden`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMobileView(false)}
        >
          <X size={28} />
        </button>
        {/* Mobile Profile */}
        {userData && (
          <div className="w-full flex mt-10 items-center justify-center mb-10">
            <img
              src={
                userData.image !== "" || userData.image == null
                  ? userData.image
                  : Images.unknownUser
              }
              alt="Profile"
              style={{ maxWidth: "40%" }}
            />
          </div>
        )}
        <nav className="mt-12 flex flex-col px-6 max-h-[345px] overflow-y-auto">
          {navigations.map((nav, index) => (
            <Link
              key={index}
              className={`text-[17px] font-semibold mt-1 hover:bg-slate-800 rounded-lg px-4 py-1 hover:text-white transition-all
                ${
                  location.pathname == nav.path
                    ? "bg-slate-800 text-white"
                    : null
                }
                `}
              to={nav.path}
              onClick={() => setIsMobileView(false)}
            >
              {nav.title}
            </Link>
          ))}
          {userData && (
            <div className="flex flex-col">
              <Link
                to={"/search"}
                className={`text-[17px] font-semibold mt-1 hover:bg-slate-800 rounded-lg px-4 py-1 hover:text-white transition-all
                  ${
                    location.pathname == "/search"
                      ? "bg-slate-800 text-white"
                      : null
                  }
                  `}
              >
                Search
              </Link>

              {userData && userData.userType == "Admin" && (
                <div className="flex flex-col">
                  <Link
                    to={"/stock"}
                    className={`text-[17px] font-semibold mt-1 hover:bg-slate-800 rounded-lg px-4 py-1 hover:text-white transition-all
                      ${
                        location.pathname == "/stock"
                          ? "bg-slate-800 text-white"
                          : null
                      }
                      `}
                  >
                    Stock
                  </Link>
                  <Link
                    to={"/users"}
                    className={`text-[17px] font-semibold mt-1 hover:bg-slate-800 rounded-lg px-4 py-1 hover:text-white transition-all
                      ${
                        location.pathname == "/users"
                          ? "bg-slate-800 text-white"
                          : null
                      }
                      `}
                  >
                    Users
                  </Link>
                </div>
              )}
              <Link
                to={"/orders"}
                className={`text-[17px] font-semibold mt-1 hover:bg-slate-800 rounded-lg px-4 py-1 hover:text-white transition-all
                  ${
                    location.pathname == "/orders"
                      ? "bg-slate-800 text-white"
                      : null
                  }
                  `}
              >
                Orders
              </Link>
              <Link
                to={"/view-profile"}
                className={`text-[17px] font-semibold mt-1 hover:bg-slate-800 rounded-lg px-4 py-1 hover:text-white transition-all
                  ${
                    location.pathname == "/view-profile"
                      ? "bg-slate-800 text-white"
                      : null
                  }
                  `}
              >
                View Profile
              </Link>
              <Link
                to={"/edit-profile"}
                className={`text-[17px] font-semibold mt-1 hover:bg-slate-800 rounded-lg px-4 py-1 hover:text-white transition-all
                  ${
                    location.pathname == "/edit-profile"
                      ? "bg-slate-800 text-white"
                      : null
                  }
                  `}
              >
                Edit Profile
              </Link>
            </div>
          )}
          {!userData && (
            <button
              onClick={() => Navigate("/login")}
              className="fixed bottom-10 text-white text-center w-[80%] rounded-lg bg-red-500 px-4 py-3  text-[17px] font-semibold hover:text-slate-800 transition-all"
            >
              Log In
            </button>
          )}
          {userData && (
            <button
              onClick={LogOut}
              className="fixed bottom-10 text-white text-center w-[80%] rounded-lg bg-red-500 px-3 py-1  text-[17px] font-semibold hover:text-slate-800 transition-all"
            >
              Log Out
            </button>
          )}
        </nav>
      </div>

      {showMenu && (
        <div className="ml-3 flex flex-col bg-gray-100 min-w-[150px] rounded-lg items-center z-50 justify-start fixed top-20 right-5 ">
          <Link
            onClick={() => toggleMenu()}
            to={"/view-profile"}
            className="text-left hover:bg-gray-200 px-3 rounded-lg w-full py-2"
          >
            View Profile
          </Link>
          <Link
            to={"/edit-profile"}
            onClick={() => toggleMenu()}
            className="text-left hover:bg-gray-200 px-3 w-full rounded-lg py-2"
          >
            Edit Profile
          </Link>
        </div>
      )}

      {isMobileView && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-0 md:hidden"
          onClick={() => setIsMobileView(false)}
        />
      )}
    </div>
  );
};

export default NavigationBar;
