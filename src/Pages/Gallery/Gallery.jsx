import "../AboutUs/AboutUs.css";
import { IoIosArrowForward } from "react-icons/io";
import AOS from "aos";
import { useEffect } from "react";
import GalleryCards from "../../components/GalleryCards/GalleryCards";

const gallery = () => {
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
                <span>gallery</span>
              </div>
              <div
                className="_Title _titleUinqe"
                data-aos="fade-down"
                data-aos-delay="300"
              >
                <p className="_PageName">
                  Home
                  <IoIosArrowForward /> gallery
                </p>
              </div>
            </div>
          </div>
        </div>
        <GalleryCards />
      </div>
    </>
  );
};

export default gallery;
