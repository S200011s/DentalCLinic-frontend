import { useEffect } from "react";
import "../../Pages/Home/Home.css";
import ButtonSubmit from "../Buttons/ButtonSubmit";
import AOS from "aos";
import { Link } from "react-router";

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <>
      <div className="_StatusContainer">
        <div className="container-fluid">
          <div className="_statusImage">
            <div className="_Image">
              <img
                src="/src/assets/images/clients/p1.webp"
                alt="stats-count image"
                data-aos="zoom-in"
              />
            </div>
            <div className="_Image">
              <img
                src="/src/assets/images/clients/p2.webp"
                alt="stats-count image"
                data-aos="zoom-in"
                className="_Unique"
              />
            </div>
          </div>
          <div className="_TextHero _TextHeroTwo">
            <div className="_DescText" data-aos="fade-left">
              <p className="_TitleAbout">About Us</p>
            </div>
            <div
              className="_TitleText"
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <h2>Professionals and Personalized Dental Excellence</h2>
            </div>
            <div
              className="_DescText"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <p>
                We offer high-quality dental care tailored for the whole family.
                From routine checkups to advanced treatments, our compassionate
                team ensures your smile stays healthy and confident.
              </p>
            </div>
            <div className="_Status" data-aos="fade-left" data-aos-delay="300">
              <div className="_allStatus">
                <div className="_Owner">
                  <div className="_Image">
                    <span
                      style={{
                        color: "#4a7cd2",
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                      }}
                    >
                      ✔
                    </span>
                  </div>
                  <div className="_Info">
                    <span className="_statusText">
                      Personalized Treatment Plans
                    </span>
                  </div>
                </div>
                <div className="_Owner">
                  <div className="_Image">
                    <span
                      style={{
                        color: "#4a7cd2",
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                      }}
                    >
                      ✔
                    </span>{" "}
                  </div>
                  <div className="_Info">
                    <span className="_statusText">
                      State-of-the-Art Technology
                    </span>
                  </div>
                </div>
                <div className="_Owner">
                  <div className="_Image">
                    <span
                      style={{
                        color: "#4a7cd2",
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                      }}
                    >
                      ✔
                    </span>{" "}
                  </div>
                  <div className="_Info">
                    <span className="_statusText">
                      Gentle Care for Kids and Adults
                    </span>
                  </div>
                </div>
                <div className="_Owner">
                  <div className="_Image">
                    <span
                      style={{
                        color: "#4a7cd2",
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                      }}
                    >
                      ✔
                    </span>{" "}
                  </div>
                  <div className="_Info">
                    <span className="_statusText">
                      Flexible Appointment Scheduling{" "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="_BtnShop">
              <Link
                to={"/services"}
                className="_BtnStatus"
                data-aos="fade-left"
                data-aos-delay="400"
              >
                <ButtonSubmit name={"Book Appointment"} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
