import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useUser } from "../UserContext";

function Navbar() {
  const { user } = useUser(); // Access user state using useUser hook

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      {/* Left side: Blog Viewer */}
      <div className="text-white text-lg font-semibold">BlogViewer</div>

      {/* Right side: User Info and Login/Logout */}
      <div className="flex items-center text-white space-x-4">
        {/* Show user name if logged in, otherwise show "Guest" */}
        <span
          className={`text-${user?.role === "admin" ? "yellow-500" : "white"} flex space-x-2`}
        >
          {user ? user.name : "Guest"}
          <p className="text-yellow-500"> {user?.role === "admin" && " (Admin)"}</p>
        </span>

        {/* User icon linking to profile page if logged in */}
        {user && (
          <Link to={`/profile/${user._id}`} className="hover:text-gray-300">
            <FaUserCircle size={24} />
          </Link>
        )}

        {/* Show logout button if logged in, otherwise show login button */}
        {user ? (
          <Link to="/login" className="hover:text-gray-300">
            Logout
          </Link>
        ) : (
          <Link to="/login" className="hover:text-gray-300">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
