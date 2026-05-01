import { useEffect } from "react";
import "../../Pages/Home/Home.css";
import { FaPhoneAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import ButtonSubmit from "../../components/Buttons/ButtonSubmit";
import AOS from "aos";
import "../../Pages/AboutUs/AboutUs.css";
import { IoIosArrowForward } from "react-icons/io";
const ContactUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <>
      <div className="_AboutUsContainer">
        <div className="_List-Header">
          <div className="_About-Header">
            <div className="_AboutContainerHeader">
              <div className="_Title" data-aos="fade-down" data-aos-delay="200">
                <span>Contact Us</span>
              </div>
              <div
                className="_Title _titleUinqe"
                data-aos="fade-down"
                data-aos-delay="300"
              >
                <p className="_PageName">
                  Home
                  <IoIosArrowForward /> Contact Us
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="_StatusContainer" style={{ margin: "5rem 0rem" }}>
          <div
            className="container-fluid flex flex-wrap md:flex-nowrap "
            style={{ padding: "2rem" }}
          >
            <div className="_TextHero _TextHeroTwo order-2 md:order-none">
              <div className="_DescText" data-aos="fade-right">
                <p className="_TitleAbout">Get In Touch</p>
              </div>
              <div
                className="_TitleText"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                <h2>
                  We are always ready to help you and answer your questions
                </h2>
              </div>
              <div
                className="_DescText"
                data-aos="fade-right"
                data-aos-delay="700"
              >
                <p>
                  Whether you have a question, a suggestion, or just want to say
                  hello, this is the place to do it. Please fill out the form
                  below with your details and message, and we'll get back to you
                  as soon as possible.
                </p>
              </div>
              <div
                className="_Status"
                data-aos="fade-right"
                data-aos-delay="800"
              >
                <div className="_allStatus border-t-1 border-gray-400 py-5">
                  <div className="_Owner _OwnerTwo">
                    <div className="_Info">
                      <span className="_statusText flex gap-1 items-center">
                        <IoTimeOutline className="text-xl" />
                        We're Open
                      </span>
                    </div>{" "}
                    <p>Monday - Friday 08.00 - 18.00</p>
                  </div>
                  <div className="_Owner _OwnerTwo">
                    <div className="_Info">
                      <span className="_statusText flex gap-1 items-center">
                        <IoLocationSharp className="text-xl" />
                        Clinic Location
                      </span>
                    </div>{" "}
                    <p className="w-full">100 S Main St, New York, NY</p>
                  </div>
                  <div className="_Owner _OwnerTwo">
                    <div className="_Info">
                      <span className="_statusText flex gap-1 items-center">
                        <FaPhoneAlt className="text-xl" />
                        Call Us Directly
                      </span>
                    </div>{" "}
                    <p>+1 123 456 789</p>
                  </div>
                  <div className="_Owner _OwnerTwo">
                    <div className="_Info">
                      <span className="_statusText flex gap-1 items-center">
                        <MdEmail className="text-xl" />
                        Send a Message
                      </span>
                    </div>
                    <p>contact@dentiacare.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-none w-full md:w-1/2">
              <form
                data-aos="fade-left"
                className="bg-white p-6 rounded-lg shadow-md w-full"
                style={{ backgroundColor: "var(--color-Secound)" }}
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  Send Us a Message
                </h3>
                <div className="mb-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 p-3 rounded focus:border-1 focus:border-blue-500 focus:outline-0"
                    required
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 p-3 rounded focus:border-1 focus:border-blue-500 focus:outline-0"
                    required
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    className="w-full border border-gray-300 p-3 rounded focus:border-1 focus:border-blue-500 focus:outline-0"
                  />
                </div>

                <div className="mb-4">
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Write your message"
                    className="w-full border border-gray-300 p-3 rounded focus:border-1 focus:border-blue-500 focus:outline-0"
                    required
                  ></textarea>
                </div>
                <ButtonSubmit />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
