import { useEffect, useState } from "react";
import "./GallaryCards.css";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "../../api/axiosInstance";

const GallaryCards = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const fetchImages = async () => {
      try {
        const { data } = await axios.get("/gallery");
        const withDelay = data.map((img, i) => ({
          ...img,
          delay: (i % 4) * 100,
        }));
        setImages(withDelay);
      } catch (err) {
        console.error("Failed to fetch gallery images:", err);
      }
    };
    fetchImages();
  }, []);

  return (
    <>
      <div className="gallery-grid" data-aos="fade-up">
        {images.map((img) => (
          <div
            className="gallery-item"
            key={img._id}
            onClick={() => setSelectedImage(img.imageUrl)}
            data-aos="fade-right"
            data-aos-delay={img.delay}
          >
            <img src={img.imageUrl} alt={`Gallery ${img._id}`} />
            <div className="overlay">
              <span>View Image</span>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="popup" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Enlarged" className="popup-img" />
        </div>
      )}
    </>
  );
};

export default GallaryCards;
