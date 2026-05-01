import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/services/${service._id}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="p-6 cursor-pointer transition-transform duration-300 hover:-translate-y-2 bg-white rounded-2xl shadow-md"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Image */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden shadow-lg"
          style={{ backgroundColor: "var(--color-Secound)" }}
        >
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold text-center"
          style={{
            color: "var(--color-headline)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={service.name}
        >
          {service.name}
        </h3>

        {/* Description */}
        <p
          className="text-sm text-center"
          style={{
            color: "var(--color-Gray)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={service.description}
        >
          {service.description}
        </p>

        {/* Category & Price */}
        <div className="flex justify-between w-full px-2 text-sm">
          <span
            className="px-3 py-1 rounded-full"
            style={{
              backgroundColor: "var(--color-Secound)",
              color: "var(--color-Buttons)",
              fontWeight: 500,
            }}
          >
            {service.category}
          </span>
          <span
            className="font-semibold"
            style={{
              color: "var(--color-green-dark)",
              fontWeight: 600,
            }}
          >
            {service.price} EGP
          </span>
        </div>
      </div>

      {/* Read More Icon */}
      <div className="text-center mt-5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/services/${service._id}`);
          }}
          className="flex items-center gap-2 mx-auto text-sm font-medium text-blue-700 hover:text-blue-500 transition-colors duration-300"
        >
          Read more <FaArrowRightLong />
        </button>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
