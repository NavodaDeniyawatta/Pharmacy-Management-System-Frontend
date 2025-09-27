import React from "react";
import { Link, useLocation } from "react-router";

const Sidebar = ({ links }) => {
  const location = useLocation();
  return (
    <div className="fixed top-25 left-0 h-full w-60 bg-blue-200 text-slate-900  p-5 shadow-lg">
      <nav className="space-y-4">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className={`block pl-9 py-2 rounded hover:bg-gray-700 font-semibold hover:text-slate-50 duration-300 transition-all
                ${
                  location.pathname == link.path
                    ? "bg-gray-700 text-white"
                    : null
                }
              `}
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
