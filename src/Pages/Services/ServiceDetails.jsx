import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import DoctorCard from "../../components/Doctors/DoctorsCard";
import ButtonSubmit from "../../components/Buttons/ButtonSubmit";
import AOS from "aos";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axiosInstance.get(`/services/${id}`);
        setService(res.data);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: "#64748b" }}>Loading service details...</p>
        </div>
      </div>
    );
  }

  if (!service) {
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium" style={{ color: "#dc2626" }}>
            Service not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Hero Section */}
      <div
        className="relative py-16 md:py-16 px-6 md:px-12 lg:px-24 min-h-[500px] md:min-h-[500px] lg:min-h-[500px] flex items-center"
        style={{
          background: "var(--color-Secound)",
        }}
      >
        <div className="w-full mx-auto text-center flex flex-col items-center justify-center">
          {/* Title */}
          <span
            className="flex items-center justify-center gap-0.5 text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-semibold"
            style={{ color: "var(--color-headline)" }}
            data-aos="fade-down"
            data-aos-delay="200"
          >
            {service.name}
          </span>

          {/* Breadcrumb */}
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

            <span className="text-slate-500 font-medium">›</span>

            <span
              className="hover:text-blue-600 cursor-pointer transition-colors font-medium"
              style={{ color: "var(--color-headline)" }}
              onClick={() => navigate("/services")}
            >
              Services
            </span>

            <span className="text-slate-500 font-medium">›</span>

            <span
              className="hover:text-blue-600 cursor-pointer transition-colors font-medium"
              style={{ color: "var(--color-headline)" }}
            >
              {service.name}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-8 md:py-12">
        {/* Service Header */}
        <div
          className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-6 md:p-8 mb-8 md:mb-12"
          style={{ boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)" }}
        >
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Service Image */}
            <div className="lg:w-1/2">
              <div
                className="relative rounded-xl md:rounded-2xl overflow-hidden"
                style={{ backgroundColor: "#e8f2ff" }}
              >
                <img
                  src={service.image || "/default-service.jpg"}
                  alt={service.name}
                  className="w-full h-64 md:h-72 object-cover"
                />
                <div
                  className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs md:text-sm font-medium"
                  style={{
                    backgroundColor: "rgba(59, 130, 246, 0.9)",
                    color: "white",
                  }}
                >
                  {service.category?.name}
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="lg:w-1/2 flex flex-col justify-between">
              <div>
                <h2
                  className="text-2xl md:text-3xl font-bold mb-3 md:mb-4"
                  style={{ color: "#1e293b" }}
                >
                  {service.name}
                </h2>

                <p
                  className="text-sm md:text-base leading-relaxed mb-4 md:mb-6"
                  style={{ color: "#64748b" }}
                >
                  {service.description}
                </p>

                {/* Service Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div
                    className="p-3 md:p-4 rounded-lg md:rounded-xl"
                    style={{ backgroundColor: "#f1f5f9" }}
                  >
                    <div className="flex items-center mb-1 md:mb-2">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 mr-2"
                        style={{ color: "#3b82f6" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span
                        className="font-semibold text-sm md:text-base"
                        style={{ color: "#1e293b" }}
                      >
                        Price
                      </span>
                    </div>
                    <p
                      className="text-lg md:text-xl font-bold"
                      style={{ color: "#059669" }}
                    >
                      {service.price} EGP
                    </p>
                  </div>

                  <div
                    className="p-3 md:p-4 rounded-lg md:rounded-xl"
                    style={{ backgroundColor: "#f1f5f9" }}
                  >
                    <div className="flex items-center mb-1 md:mb-2">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 mr-2"
                        style={{ color: "#3b82f6" }}
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
                      <span
                        className="font-semibold text-sm md:text-base"
                        style={{ color: "#1e293b" }}
                      >
                        Duration
                      </span>
                    </div>
                    <p
                      className="text-base md:text-lg"
                      style={{ color: "#64748b" }}
                    >
                      {service.duration}
                    </p>
                  </div>

                  {service.sessions && (
                    <div
                      className="p-3 md:p-4 rounded-lg md:rounded-xl md:col-span-2"
                      style={{ backgroundColor: "#f1f5f9" }}
                    >
                      <div className="flex items-center mb-1 md:mb-2">
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5 mr-2"
                          style={{ color: "#3b82f6" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <span
                          className="font-semibold text-sm md:text-base"
                          style={{ color: "#1e293b" }}
                        >
                          Sessions
                        </span>
                      </div>
                      <p
                        className="text-base md:text-lg"
                        style={{ color: "#64748b" }}
                      >
                        {service.sessions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Doctors Section */}
        {service.doctors && service.doctors.length > 0 && (
          <div>
            <div className="text-center mb-8 md:mb-12">
              <h3
                className="text-2xl md:text-3xl font-bold mb-3 md:mb-4"
                style={{ color: "#1e293b" }}
              >
                Available Doctors
              </h3>
              <p className="text-sm md:text-base" style={{ color: "#64748b" }}>
                Meet our experienced doctors who provide this service
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
              {service.doctors.map((doc) => (
                <DoctorCard
                  key={doc._id}
                  doctor={doc}
                  size="small"
                  service={service}
                  showBooking={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
