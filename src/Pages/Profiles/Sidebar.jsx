import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineWrenchScrewdriver,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import ButtonSubmit from "../../components/Buttons/ButtonSubmit";
import { CiLogout } from "react-icons/ci";

const Sidebar = ({ isSideMenuOpen, closeSideMenu }) => {
  const [isPagesMenuOpen, setPagesMenuOpen] = useState(false);
  const sideMenuRef = useRef();

  const togglePagesMenu = () => setPagesMenuOpen(!isPagesMenuOpen);

  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && closeSideMenu();
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeSideMenu]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickInside =
        sideMenuRef.current && sideMenuRef.current.contains(e.target);
      const isClickOnHamburger = e.target.closest("#hamburger-btn");

      if (!isClickInside && !isClickOnHamburger) {
        closeSideMenu();
      }
    };

    if (isSideMenuOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSideMenuOpen, closeSideMenu]);

  return (
    <>
      <aside
        className="z-20 hidden w-64 overflow-y-auto md:block flex-shrink-0"
        style={{ backgroundColor: "#10244b" }}
      >
        <SidebarContent
          togglePagesMenu={togglePagesMenu}
          isPagesMenuOpen={isPagesMenuOpen}
          closeSideMenu={closeSideMenu}
        />
      </aside>

      {isSideMenuOpen && <div className="fixed inset-0 z-10 bg-opacity-50" />}

      {isSideMenuOpen && (
        <aside
          ref={sideMenuRef}
          className="fixed inset-y-0 z-20 flex-shrink-0 w-90 mt-16 overflow-y-auto md:hidden"
          style={{ backgroundColor: "#10244b" }}
        >
          <SidebarContent
            togglePagesMenu={togglePagesMenu}
            isPagesMenuOpen={isPagesMenuOpen}
            closeSideMenu={closeSideMenu}
          />
        </aside>
      )}
    </>
  );
};

const SidebarContent = ({ closeSideMenu }) => (
  <div className="py-4 text-gray-500 dark:text-gray-400">
    <img
      src="/src/assets/images/logo/logo-white.webp"
      alt=""
      style={{ width: "10rem" }}
      className=" ml-6"
    />
    <ul className="mt-6">
      <SidebarItem
        icon={<HiOutlineHome />}
        label="Profile"
        to="/profile/Information"
        active
        closeSideMenu={closeSideMenu}
      />
    </ul>
    {/* <ul>
      <SidebarItem
        icon={<HiOutlineWrenchScrewdriver />}
        label="Services"
        to="/profile/services"
        closeSideMenu={closeSideMenu}
      />
      <SidebarItem
        icon={<HiOutlineCalendarDays />}
        label="Appointments"
        to="/profile/appointments"
        closeSideMenu={closeSideMenu}
      />{" "}
    </ul> */}
  </div>
);

const SidebarItem = ({ icon, label, to, active = false, closeSideMenu }) => (
  <li className="relative px-6 py-3">
    {active && (
      <span
        className="absolute inset-y-0 left-0 w-1  rounded-tr-lg rounded-br-lg"
        style={{ backgroundColor: "#4a7cd2" }}
      />
    )}
    <Link
      to={to}
      onClick={closeSideMenu}
      className={`inline-flex items-center w-full text-md font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200 ${
        active ? "text-gray-800 dark:text-gray-100" : ""
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="ml-4">{label}</span>
    </Link>
  </li>
);

const SidebarSubItem = ({ label, to, closeSideMenu }) => (
  <li className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
    <Link to={to} onClick={closeSideMenu} className="w-full">
      {label}
    </Link>
  </li>
);

export default Sidebar;
