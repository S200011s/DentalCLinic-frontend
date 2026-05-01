import "../AboutUs/AboutUs.css";
import { IoIosArrowForward } from "react-icons/io";
import AOS from "aos";
import { useEffect } from "react";
import GallaryCards from "../../components/GallaryCards/GallaryCards";

const Gallary = () => {
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
                <span>Gallary</span>
              </div>
              <div
                className="_Title _titleUinqe"
                data-aos="fade-down"
                data-aos-delay="300"
              >
                <p className="_PageName">
                  Home
                  <IoIosArrowForward /> Gallary
                </p>
              </div>
            </div>
          </div>
        </div>
        <GallaryCards />
      </div>
    </>
  );
};

export default Gallary;
