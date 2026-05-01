import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const DoctorCard = ({ doctor, size = "large", service, showBooking = false }) => {
  const isSmall = size === "small";
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/doctor/${doctor._id}`);
  };

  const handleBooking = (e) => {
    e.stopPropagation(); 
    navigate("/book-appointment", { state: { doctor, service } });
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className={`cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group ${isSmall ? "max-w-sm" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Doctor Image */}
      <div className="relative overflow-hidden">
        <img
          src={doctor.profileImage}
          alt={`Dr. ${doctor.user?.firstName || ""} ${doctor.user?.lastName || ""}`}
          className={`w-full ${isSmall ? "h-40" : "h-48"} object-cover transition-transform duration-300 group-hover:scale-105`}
        />
        
        {/* Experience Badge */}
        {doctor.experience && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-blue-600">
          </div>
        )}
      </div>

      {/* Doctor Info */}
      <div className="p-4 space-y-3">
        {/* Doctor Name */}
        <h3 className={`${isSmall ? "text-lg" : "text-xl"} font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300`}>
          Dr. {doctor.fullName}
        </h3>

        {/* Specialization */}
        {doctor.specialization && (
          <div className="flex flex-wrap gap-1">
            {doctor.specialization.slice(0, 2).map((spec, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
              >
                {spec}
              </span>
            ))}
            {doctor.specialization.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                +{doctor.specialization.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(doctor.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600">
              {doctor.averageRating?.toFixed(1) || "N/A"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {showBooking ? (
            <motion.button
              onClick={handleBooking}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Book Appointment
            </motion.button>
          ) : (
            <motion.button
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Profile
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;

