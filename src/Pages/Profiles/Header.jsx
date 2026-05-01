import React, { useState } from "react";
import { HiOutlineClipboardList, HiOutlineUser } from "react-icons/hi";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router";
import LogOut from "../Auth/LogOut";
import { HiOutlineHome } from "react-icons/hi2";

const Header = ({ onToggleSidebar }) => {
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const toggleProfileMenu = () => setProfileMenuOpen(!isProfileMenuOpen);
  return (
    <header
      className="z-10 py-4 bg-white shadow-md"
      style={{ backgroundColor: "#10244b" }}
    >
      <div className="container flex items-center justify-between h-full px-6 mx-auto ">
        <button
          id="hamburger-btn"
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none "
          onClick={onToggleSidebar}
          aria-label="Menu"
        >
          <FiMenu className="w-6 h-6 text-amber-50" />
        </button>
        <ul className="flex items-center justify-end flex-shrink-0 space-x-6 w-[90%] lg:w-full">
          <li className="relative ">
            <button
              className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={toggleProfileMenu}
              aria-label="Account"
            >
              <img
                className="object-cover w-8 h-8 rounded-full"
                src="/src/assets/images/Doctors/1.webp"
                alt="profile"
              />
            </button>
            {isProfileMenuOpen && (
              <ul
                className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600   rounded-md shadow-md"
                style={{ backgroundColor: "#ffffffe8" }}
              >
                <li className="flex">
                  <Link
                    to={"/profile"}
                    className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold "
                  >
                    <HiOutlineUser className="w-4 h-4 mr-3" />
                    <span>Profile</span>
                  </Link>
                </li>
                <li className="flex">
                  <Link
                    to={"/"}
                    className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold "
                  >
                    <HiOutlineHome className="w-4 h-4 mr-3" />
                    <span>Home</span>
                  </Link>
                </li>
                <li className="flex">
                  <Link
                    className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold"
                    to={"/services"}
                  >
                    <HiOutlineClipboardList className="w-4 h-4 mr-3" />
                    <span>Services</span>
                  </Link>
                </li>
                <li className="flex">
                  <LogOut />
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
