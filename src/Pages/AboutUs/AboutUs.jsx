import About from "../../components/About/About";
import "./AboutUs.css";
import { IoIosArrowForward } from "react-icons/io";
import Categories from "../../components/Categories/Categories";
import AOS from "aos";
import { useEffect } from "react";

function AboutUs() {
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
            <div
              className="_AboutContainerHeader"
              data-aos="fade-down"
              data-aos-delay="300"
            >
              <div className="_Title">
                <span>About Us</span>
              </div>
              <div className="_Title _titleUinqe">
                <p className="_PageName">
                  Home
                  <IoIosArrowForward /> About
                </p>
              </div>
            </div>
          </div>
        </div>
        <About />
        <Categories />

        <div className="_StatusContainer">
          <div className="container-fluid flex flex-wrap md:flex-nowrap">
            <div className="_TextHero _TextHeroTwo order-2 md:order-none">
              <div className="_DescText" data-aos="fade-right">
                <p className="_TitleAbout">Why Choose Our Dental Care</p>
              </div>
              <div
                className="_TitleText"
                data-aos="fade-right"
                data-aos-delay="500"
              >
                <h2>Exceptional Service With a Personal Touch</h2>
              </div>
              <div
                className="_DescText"
                data-aos="fade-right"
                data-aos-delay="700"
              >
                <p>
                  Choosing the right dental provider matters. We combine expert
                  care, advanced technology, and a warm atmosphere to ensure
                  every visit is comfortable, efficient, and tailored to your
                  unique needs.
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
                      <span className="_statusText">Experienced Dental</span>
                    </div>{" "}
                    <p>
                      Skilled care backed by years of trusted dental experience.
                    </p>
                  </div>
                  <div className="_Owner _OwnerTwo">
                    <div className="_Info">
                      <span className="_statusText">Advanced Technology</span>
                    </div>{" "}
                    <p className="w-full">
                      Modern tools ensure accurate and efficient treatments.
                    </p>
                  </div>
                  <div className="_Owner _OwnerTwo">
                    <div className="_Info">
                      <span className="_statusText">
                        Personalized Treatment
                      </span>
                    </div>{" "}
                    <p>
                      Custom care plans made to fit your smile and lifestyle.
                    </p>
                  </div>
                  <div className="_Owner _OwnerTwo">
                    <div className="_Info">
                      <span className="_statusText">Family-Friendly</span>
                    </div>
                    <p>Welcoming space for kids, teens, adults, and seniors.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="_statusImage order-1 md:order-none">
              <div className="_Image">
                <img
                  src="/src/assets/images/clients/s3.webp"
                  alt="stats-count image"
                  data-aos="zoom-in"
                />
              </div>
              <div className="_Image">
                <img
                  src="/src/assets/images/clients/p3.webp"
                  alt="stats-count image"
                  data-aos="zoom-in"
                  className="_Unique"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
