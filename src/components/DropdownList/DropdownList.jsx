import React, { useState, useRef, useEffect } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";

import "./DropdownList.css";
import { Link } from "react-router";
const DropdownList = ({ element, items }) => {
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
            {items.map((item) => {
              return (
                <li className="_MenuProfileLink" key={item}>
                  <Link
                    to={
                      item == "Profile"
                        ? "/Profile"
                        : item == "My Appoitments"
                        ? "/my-appointments"
                        : "/layout"
                    }
                    className="block px-4 py-2 "
                  >
                    {item == "Profile" ? (
                      <CiUser className="text-2xl" />
                    ) : item == "My Appoitments" ? (
                      <CiCalendar className="text-2xl" />
                    ) : (
                      <MdOutlineDashboard className="text-2xl" />
                    )}
                    <span>{item}</span>
                  </Link>
                </li>
              );
            })}

            {/* <li className="_MenuProfileLink">
              <a href="#" className="block px-4 py-2 ">
                <CiCalendar className="text-2xl" />
                <span>Apportment</span>
              </a>
            </li>
            <li className="_MenuProfileLink">
              <a href="#" className="block px-4 py-2 ">
                <CiLogout className="text-2xl" />
                <span>Logout</span>
              </a>
            </li> */}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownList;
