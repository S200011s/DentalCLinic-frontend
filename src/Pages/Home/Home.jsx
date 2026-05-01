import React, { useEffect } from "react";
import "./Home.css";
import ButtonSubmit from "../../components/Buttons/ButtonSubmit";
import AOS from "aos";
import "aos/dist/aos.css";
import About from "../../components/About/About";
import Categories from "../../components/Categories/Categories";
import { Link } from "react-router";
const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <>
      <div>
        <div className="_HeroContainer ">
          <div className="container-fluid">
            <div className="_TextHero">
              <div
                className="_TextContainer"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <div className="_WellcomeText">
                  <p>Welcome to Dentia</p>
                </div>
                <div className="_MainText">
                  <h2>
                    Exceptional<span> Dental </span>Care
                  </h2>
                </div>
                <div className="_DiscHero">
                  <p>
                    We offer high-quality dental care tailored for the whole
                    family. From routine checkups to advanced treatments, our
                    compassionate team ensures your smile stays healthy and
                    confident.
                  </p>
                </div>
                <div className="_BtnShop">
                  <Link className="_Btn" to={"/services"}>
                    <ButtonSubmit name={"Get Started Now"} />
                  </Link>
                  <div className="_Clients">
                    <div className="_Images">
                      <img
                        src="/src/assets/images/users/1.webp"
                        alt="user one"
                      />
                      <img
                        src="/src/assets/images/users/2.webp"
                        alt="user two"
                      />
                      <img
                        src="/src/assets/images/users/3.webp"
                        alt="user three"
                      />
                    </div>
                    <div className="_Status">
                      <span>23k</span>
                      <span>happy customers</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="_ImageHero">
                <img src="/src/assets/images/c2.webp" alt="teeth image" />
              </div>
            </div>
          </div>
        </div>
        <About />
        <Categories />
        <div className="_LifeShoping">
          <div className="container-fluid">
            <div
              className="_OneCard"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <div className="_Image">
                <div className="_ImageContainer">
                  <img
                    src="/src/assets/images/Icons/tooth-1.png"
                    alt="General Dentistry image"
                  />
                </div>
              </div>
              <div className="_TextCard">
                <div className="_Title">
                  <span>General Dentistry</span>
                </div>
                <div className="_Disc">
                  <span>
                    Complete oral care for every smile with cleanings, exams,
                    and more.
                  </span>
                </div>
                <div className="_hover-btn">
                  <button className="hover-btn">
                    <span className="icon">+</span>
                    <span className="text">Read More</span>
                  </button>
                </div>
              </div>
            </div>
            <div
              className="_OneCard"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <div className="_Image">
                <div className="_ImageContainer">
                  <img
                    src="/src/assets/images/Icons/tooth-2.png"
                    alt="Cosmetic Dentistry image"
                  />
                </div>
              </div>
              <div className="_TextCard">
                <div className="_Title">
                  <span>Cosmetic Dentistry</span>
                </div>
                <div className="_Disc">
                  <span>
                    Enhance your smile’s beauty with whitening, veneers, and
                    more.
                  </span>
                </div>
                <div className="_hover-btn">
                  <button className="hover-btn">
                    <span className="icon">+</span>
                    <span className="text">Read More</span>
                  </button>
                </div>
              </div>
            </div>
            <div
              className="_OneCard"
              data-aos="fade-right"
              data-aos-delay="300"
            >
              <div className="_Image">
                <div className="_ImageContainer">
                  <img
                    src="/src/assets/images/Icons/tooth-3.png"
                    alt="Pediatric Dentistry image"
                  />
                </div>
              </div>
              <div className="_TextCard">
                <div className="_Title">
                  <span>Pediatric Dentistry</span>
                </div>
                <div className="_Disc">
                  <span>
                    Gentle and fun dental care for kids to grow healthy, happy
                    smiles.
                  </span>
                </div>
                <div className="_hover-btn">
                  <button className="hover-btn">
                    <span className="icon">+</span>
                    <span className="text">Read More</span>
                  </button>
                </div>
              </div>
            </div>
            <div
              className="_OneCard"
              data-aos="fade-right"
              data-aos-delay="400"
            >
              <div className="_Image">
                <div className="_ImageContainer">
                  <img
                    src="/src/assets/images/Icons/tooth-4.png"
                    alt="Restorative Dentistry image"
                  />
                </div>
              </div>
              <div className="_TextCard">
                <div className="_Title">
                  <span>Restorative Dentistry</span>
                </div>
                <div className="_Disc">
                  <span>
                    Repair and restore your teeth for lasting comfort and
                    function.
                  </span>
                </div>
                <div className="_hover-btn">
                  <button className="hover-btn">
                    <span className="icon">+</span>
                    <span className="text">Read More</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="_SaleComponent _Ready">
          <div className="container-fluid">
            <div className="_Title">
              <span>Ready to Find your Perfect Experiance?</span>
            </div>
            <div className="_Disc">
              <span>
                Book now from our website or visit us in person to see all the
                beauty.
              </span>
            </div>
            <div className="_BtnShop">
              <Link className="_BtnReady" to={"/services"}>
                <ButtonSubmit name={"Book Appointment"} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
