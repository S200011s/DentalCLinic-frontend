import { useEffect } from "react";
import "../../Pages/Home/Home.css";
import ScrollCounter from "../../components/ScrollCounter/ScrollCounter";
import AOS from "aos";

const Categories = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <>
      <div className="_Categories">
        <div className="container-fluid">
          <div className="_Title">
            <span data-aos="fade-down" data-aos-delay="100">
              Meet Our Dental Team
            </span>
            <h2 data-aos="fade-down" data-aos-delay="200">
              Committed to Your Smile
            </h2>
            <p data-aos="fade-down" data-aos-delay="300">
              Our experienced dental team is here to make every visit positive
              and personalized. With gentle hands and caring hearts.
            </p>
          </div>
          <div className="_OurCategories">
            <div className="_OneCard" data-aos="zoom-in" data-aos-delay="200">
              <img
                src="/src/assets/images/Doctors/1.webp"
                alt="dessert-bloom image"
              />
              <p>
                <span>Dr. Sarah Bennett</span>
                <span className="_Spatial">Lead Dentist</span>
              </p>
            </div>
            <div className="_OneCard" data-aos="zoom-in" data-aos-delay="200">
              <img
                src="/src/assets/images/Doctors/2.webp"
                alt="dessert-bloom image"
              />
              <p>
                <span>Dr. Maya Lin</span>
                <span className="_Spatial">Cosmetic Dentist</span>
              </p>
            </div>
            <div className="_OneCard" data-aos="zoom-in" data-aos-delay="200">
              <img
                src="/src/assets/images/Doctors/3.webp"
                alt="dessert-bloom image"
              />
              <p>
                <span>Dr. Michael Reyes</span>
                <span className="_Spatial">Pediatric Specialist</span>
              </p>
            </div>
            <div className="_OneCard" data-aos="zoom-in" data-aos-delay="200">
              <img
                src="/src/assets/images/Doctors/4.webp"
                alt="dessert-bloom image"
              />
              <p>
                <span>Dr. James Carter</span>
                <span className="_Spatial">Dental Hygienist</span>
              </p>
            </div>
          </div>
          <div className="_CountersContainer">
            <div className="_Counters">
              <ScrollCounter end={10000} label="Happy Patients" />
              <ScrollCounter end={2500} label="Teeth Whitened" />
              <ScrollCounter end={800} label="Dental Implants" />
              <ScrollCounter end={15} label="Years of Exeperience" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
