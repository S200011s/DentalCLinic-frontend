import React, { useState, useEffect } from "react";
import "./NavBar.css";
import { FaRegCircleUser } from "react-icons/fa6";
import DropdownList from "../dropdownlist/DropdownList";
import ButtonSubmit from "../Buttons/ButtonSubmit";
import { Link } from "react-router";
import LogOut from "../../Pages/Auth/LogOut";
import isAuth from "../../guards/isAuth";
const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [icon, setIcon] = useState(false);
  const afterClicked = () => setIsOpen(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIcon(window.innerWidth < 1023);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMobileMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 _Navbar
    ${isScrolled ? "bg-white shadow-md" : "lg:bg-transparent bg-white"}`}
      >
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto py-5 ">
          <Link to={"/"} className="flex items-center border-0">
            {icon ? (
              <img
                src="/src/assets/images/logo/logo-white.webp"
                className="h-6 mr-3 sm:h-9"
                alt="Logo"
              />
            ) : (
              <img
                src="/src/assets/images/logo/logo-black.webp"
                className="h-6 mr-3 sm:h-9"
                alt="Logo"
              />
            )}
          </Link>

          <div className="flex items-center lg:order-2">
            {icon ? (
              <></>
            ) : (
              <div className="flex gap-3 mr-3" style={{ width: "12rem" }}>
                <Link
                  to="/login"
                  className="flex gap-3"
                  style={{ width: "100%" }}
                >
                  {isAuth() ? <LogOut /> : <ButtonSubmit name={"Log In"} />}
                </Link>
              </div>
            )}
            <button
              onClick={toggleMobileMenu}
              type="button"
              className=" inline-flex items-center p-2 ml-2 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none  focus:ring-gray-200 border-0"
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
            {isAuth() ? (
              <DropdownList
                element={<FaRegCircleUser />}
                items={["Profile", "My Appoitments", "Dashboard"]}
              />
            ) : (
              false
            )}
          </div>
          <div
            className={`${
              isOpen ? "block" : "hidden"
            } items-center justify-between w-full lg:flex lg:w-auto lg:order-1 rounded-2xl mt-2  `}
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 _Links">
              <li onClick={afterClicked}>
                <Link to="/" className="block py-2 pl-3 pr-4 ">
                  Home
                </Link>
              </li>
              <li onClick={afterClicked}>
                <Link to="/aboutus" className="block py-2 pl-3 pr-4 ">
                  About
                </Link>
              </li>
              <li onClick={afterClicked}>
                <Link to="/services" className="block py-2 pl-3 pr-4 ">
                  Services
                </Link>
              </li>
              <li onClick={afterClicked}>
                <Link to="/doctor" href="#" className="block py-2 pl-3 pr-4 ">
                  Doctors
                </Link>
              </li>
              <li onClick={afterClicked}>
                <Link to="/gallary" className="block py-2 pl-3 pr-4 ">
                  Gallary
                </Link>
              </li>
              <li onClick={afterClicked}>
                <Link to="/contactus" className="block py-2 pl-3 pr-4 ">
                  Contact Us
                </Link>
              </li>
              {icon ? (
                <li onClick={afterClicked}>
                  <div className="flex gap-3 mt-2" style={{ width: "100%" }}>
                    <Link
                      to="/login"
                      className="flex gap-3"
                      style={{ width: "100%" }}
                    >
                      {isAuth() ? <LogOut /> : <ButtonSubmit name={"Log In"} />}
                    </Link>
                  </div>
                </li>
              ) : (
                <></>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
