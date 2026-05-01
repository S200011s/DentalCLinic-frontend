import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AOS from "aos";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axiosInstance.get(`/doctor/${id}`);
        setDoctor(res.data.doctor);
        setReviews(res.data.reviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: "#64748b" }}>Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div
        className="flex items-center justify-center py-20"
        style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}
      >
        <div className="text-center">
          <div
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#fee2e2" }}
          >
            <svg
              className="w-12 h-12"
              style={{ color: "#dc2626" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium" style={{ color: "#dc2626" }}>
            Doctor not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* 💠 Hero Section - Styled Header */}
      <div
        className="relative py-16 md:py-16 px-6 md:px-12 lg:px-24 min-h-[500px] md:min-h-[500px] lg:min-h-[500px] flex items-center"
        style={{
          background: "var(--color-Secound)",
        }}
      >
        <div className="w-full mx-auto text-center flex flex-col items-center justify-center">
          <span
            className="flex items-center justify-center gap-0.5 text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold"
            style={{ color: "var(--color-headline)" }}
            data-aos="fade-down"
            data-aos-delay="200"
          >
            {doctor.fullName}
          </span>

          {/* 🔷 Breadcrumb */}
          <div
            className="flex flex-wrap items-center justify-center gap-x-2 text-sm sm:text-base md:text-lg border-t py-5 my-5 w-full"
            data-aos="fade-down"
            data-aos-delay="300"
          >
            <span
              className="hover:text-blue-600 cursor-pointer transition-colors font-medium"
              style={{ color: "var(--color-headline)" }}
              onClick={() => navigate("/")}
            >
              Home
            </span>
            <span
              className="hover:text-blue-600 cursor-pointer transition-colors font-medium"
              style={{ color: "var(--color-headline)" }}
            >
              ›
            </span>
            <span
              className="hover:text-blue-600 cursor-pointer transition-colors font-medium"
              style={{ color: "var(--color-headline)" }}
              onClick={() => navigate("/doctors")}
            >
              Dentists
            </span>
            <span
              className="hover:text-blue-600 cursor-pointer transition-colors font-medium"
              style={{ color: "var(--color-headline)" }}
            >
              ›
            </span>
            <span
              className="hover:text-blue-600 cursor-pointer transition-colors font-medium"
              style={{ color: "var(--color-headline)" }}
            >
              {doctor.fullName}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-8">
        {/* Doctor Profile Header */}
        <motion.div
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Doctor Image */}
            <div className="relative">
              <img
                src={doctor.profileImage}
                alt={doctor.fullName}
                className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-full border-4 border-blue-100"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                {doctor.fullName}
              </h2>

              {/* Specialization */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {doctor.specialization.map((spec, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    <svg
                      className="w-3 h-3 text-blue-600 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs font-semibold text-gray-700">
                      Experience
                    </span>
                  </div>
                  <p className="text-base font-bold text-blue-600">
                    {doctor.experience} years
                  </p>
                </div>

                <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-1">
                    <svg
                      className="w-3 h-3 text-yellow-500 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-700">
                      Rating
                    </span>
                  </div>
                  <p className="text-base font-bold text-yellow-500">
                    {doctor.averageRating?.toFixed(1) || "N/A"}
                  </p>
                </div>
              </div>

              {/* Certifications */}
              {doctor.certifications && doctor.certifications.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">
                    Certifications
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {doctor.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded-full text-xs font-medium"
                      >
                        {cert}
                      </span>
                    ))}
                    {doctor.certifications.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{doctor.certifications.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bio Section */}
        {doctor.bio && (
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
              About Dr. {doctor.fullName.split(" ").pop()}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {doctor.bio}
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Work Gallery */}
          {doctor.workImages?.length > 0 && (
            <motion.div
              className="bg-white rounded-xl shadow-sm p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                Work Gallery
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {doctor.workImages.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={img}
                      alt={`work-${idx}`}
                      className="w-full h-20 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Patient Reviews */}
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
              Patient Reviews
            </h3>
            {reviews.length > 0 ? (
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {reviews.slice(0, 3).map((rev) => (
                  <div key={rev._id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <svg
                          className="w-3 h-3 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-gray-800">
                          {rev.user.name}
                        </p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-2.5 h-2.5 ${
                                i < rev.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-10 h-10 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">No reviews yet</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Services Offered */}
        {doctor.services?.length > 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-sm p-6 mt-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
              Services Offered
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {doctor.services.slice(0, 6).map((service) => (
                <Link
                  to={`/services/${service._id}`}
                  key={service._id}
                  className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-300 group"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-xs text-gray-800 group-hover:text-blue-600 transition-colors">
                        {service.name}
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-2xs text-gray-500">
                          {service.category?.name}
                        </span>
                        <span className="text-xs font-bold text-green-600">
                          {service.price} EGP
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;
