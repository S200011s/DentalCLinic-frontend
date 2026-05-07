import React, { useState, useRef, useEffect } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";

import "./DropdownList.css";
import { Link } from "react-router";

const DropdownList = ({ element, items, user }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLink = (item) => {
    if (item === "Profile") return "/Profile";
    if (item === "My Appoitments") return "/my-appointments";
    if (item === "Dashboard") {
      if (user?.role === "admin") return "/layout";
      if (user?.role === "doctor") return "/doctor/appointments";
    }
    return "/";
  };

  return (
    <div className="relative border-0 flex justify-center mx-2" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-3xl text-gray-700 cursor-pointer"
      >
        {element}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 bg-white z-50 _MenuContainer">
          <ul className="_MenuProfile">
            {items
              .filter((item) => {
                if (item === "Dashboard" && user?.role === "client") return false;
                return true;
              })
              .map((item) => {
                return (
                  <li className="_MenuProfileLink" key={item} onClick={() => setOpen(false)}>
                    <Link to={getLink(item)} className="block px-4 py-2 ">
                      {item === "Profile" ? (
                        <CiUser className="text-2xl" />
                      ) : item === "My Appoitments" ? (
                        <CiCalendar className="text-2xl" />
                      ) : (
                        <MdOutlineDashboard className="text-2xl" />
                      )}
                      <span>{item}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownList;
