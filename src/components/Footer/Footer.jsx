import React from "react";
import ButtonSubmit from "../Buttons/ButtonSubmit";
import { Link } from "react-router";
import "./Footer.css";
import { BsTelephoneFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <>
      <footer className="_FooterContainer">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-4">
          <div className="lg:flex lg:items-start lg:gap-8">
            <div className="mt-8 grid grid-cols-2 gap-10 lg:mt-0 lg:grid-cols-5 lg:gap-y-16 py-10">
              <div className="col-span-2">
                <div>
                  <img src="/src/assets/images/logo/logo-white.webp" />
                  <p className="mt-6 _TextColor">
                    At Dentia, we’re dedicated to providing high-quality,
                    personalized dental care for patients of all ages. Our
                    skilled team uses the latest technology to ensure
                    comfortable, efficient treatments and beautiful, healthy
                    smiles for life.
                  </p>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="font-bold text-white text-2xl">Company</p>
                <ul className="mt-6 space-y-4 text-sm _LinksFooter">
                  <li>
                    <Link
                      to="/"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/services"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      {" "}
                      Our Service{" "}
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/gallary"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      {" "}
                      Gallary
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/aboutus"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      {" "}
                      About Us
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/contactus"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      {" "}
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="font-bold text-white text-2xl">Our Services</p>

                <ul className="mt-6 space-y-4 text-sm _LinksFooter">
                  <li>
                    <Link
                      to="/services"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      {" "}
                      General Dentistry
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/services"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      {" "}
                      Cosmetic Dentistry
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/services"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      {" "}
                      Pediatric Dentistry
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      {" "}
                      Restorative Dentistry
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      {" "}
                      Preventive Dentistry
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      {" "}
                      Orthodontics
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <p className="font-bold text-white text-2xl">Contact Us</p>
                <ul className="mt-6 space-y-4 text-sm _LinksFooter">
                  <li>
                    <h2
                      className="flex items-center gap-1 text-white"
                      style={{ fontSize: "1.2rem" }}
                    >
                      {" "}
                      <FaLocationDot
                        style={{ color: "var(--color-Buttons)" }}
                      />
                      Clinic Location
                    </h2>
                    <Link
                      to="/"
                      className="text-gray-700 transition hover:opacity-75 pl-6"
                    >
                      {" "}
                      Contact{" "}
                    </Link>
                  </li>

                  <li>
                    <h2
                      className="flex items-center gap-1 text-white"
                      style={{ fontSize: "1.2rem" }}
                    >
                      <BsTelephoneFill
                        style={{ color: "var(--color-Buttons)" }}
                      />
                      Call Us
                    </h2>
                    <Link
                      to="/"
                      className="text-gray-700 transition hover:opacity-75 pl-6"
                    >
                      {" "}
                      +1 123 456 789
                    </Link>
                  </li>

                  <li>
                    <h2
                      className="flex items-center gap-1 text-white"
                      style={{ fontSize: "1.2rem" }}
                    >
                      <MdEmail style={{ color: "var(--color-Buttons)" }} />
                      Send a Message
                    </h2>
                    <Link
                      to="/"
                      className="text-gray-700 transition hover:opacity-75 pl-6 "
                    >
                      contact@dentiacare.com
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <div className="sm:flex sm:justify-between">
              <p className="text-xs text-gray-500">
                &copy; 2022. Dentia. All rights reserved.
              </p>

              <ul className="mt-8 flex flex-wrap justify-start gap-4 text-xs sm:mt-0 lg:justify-end">
                <li>
                  <Link
                    to="/"
                    className="text-gray-500 transition hover:opacity-75"
                  >
                    {" "}
                    Terms & Conditions{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/"
                    className="text-gray-500 transition hover:opacity-75"
                  >
                    {" "}
                    Privacy Policy{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    to="/"
                    className="text-gray-500 transition hover:opacity-75"
                  >
                    {" "}
                    Cookies{" "}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
