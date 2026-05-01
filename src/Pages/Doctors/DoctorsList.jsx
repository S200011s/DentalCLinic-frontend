import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import DropdownFilter from "../../components/DropdownList/DropdownFilter";
import DoctorCard from "../../components/Doctors/DoctorsCard";
import SearchBox from "../../components/Search/SearchBox";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [sortBy, setSortBy] = useState("createdAt-desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const navigate = useNavigate();

  const [specializationOptions, setSpecializationOptions] = useState([
    { label: "All", value: "" },
  ]);

  const sortOptions = [
    { label: "Newest", value: "createdAt-desc" },
    { label: "Top Rated", value: "averageRating-desc" },
    { label: "Lowest Rated", value: "averageRating-asc" },
  ];
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const { data } = await axiosInstance.get("/doctor/specializations");
        const dynamicOptions = Array.isArray(data)
          ? data.map((spec) => ({
              label: spec,
              value: spec,
            }))
          : [];
        setSpecializationOptions([
          { label: "All", value: "" },
          ...dynamicOptions,
        ]);
      } catch (err) {
        console.error("Error fetching specializations:", err);
      }
    };

    fetchSpecializations();
  }, []);

  const fetchSuggestions = async (query) => {
    try {
      const { data } = await axiosInstance.get(
        `/search/doctors?keyword=${query}`
      );
      const suggestions = [];
      data.doctors.forEach((doc) => {
        const fullName = `Dr. ${doc.user.firstName} ${doc.user.lastName}`;
        suggestions.push({
          label: fullName,
          value: doc._id,
          type: "doctor",
        });
      });
      return suggestions;
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      return [];
    }
  };

  const fetchDoctors = async () => {
    try {
      const query = new URLSearchParams();
      if (specialization) query.append("specialization", specialization);
      if (sortBy) {
        const [field, order] = sortBy.split("-");
        query.append("sortBy", field);
        query.append("order", order);
      }
      if (keyword) query.append("keyword", keyword);
      query.append("page", page);
      query.append("limit", 8);

      const { data } = await axiosInstance.get(`/doctor?${query.toString()}`);
      setDoctors(data?.doctors || []);
      setTotalPages(Math.ceil(data.total / 8));
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization, sortBy, page, keyword]);

  const handleSuggestionSelect = (type, value) => {
    if (type === "doctor") {
      navigate(`/doctor/${value}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Hero Section */}
      <div
        className="relative py-16 md:py-16 px-6 md:px-12 lg:px-24 min-h-[500px] md:min-h-[500px] lg:min-h-[500px] flex items-center"
        style={{
          background: "var(--color-Secound)",
        }}
      >
        <div className="w-full mx-auto text-center flex flex-col items-center justify-center">
          <p
            className="text-lg font-medium mb-2"
            style={{ color: "#3b82f6" }}
            data-aos="fade-down"
            data-aos-delay="100"
          >
            Meet Our Dental Team
          </p>
          <span
            className="flex items-center justify-center gap-0.5 text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold"
            style={{ color: "var(--color-headline)" }}
            data-aos="fade-down"
            data-aos-delay="200"
          >
            Committed to Your Smile
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
              Dentists
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Box */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SearchBox
            placeholder="Search doctors ..."
            fetchSuggestions={fetchSuggestions}
            onSelect={handleSuggestionSelect}
          />
        </motion.div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6 flex justify-end">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--color-white)] bg-[var(--color-Buttons)] rounded-md shadow hover:bg-[var(--color-Buttons-disabled)] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h18M6 8h12M10 12h4M12 16h0"
              />
            </svg>
            Filters & Sort
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <motion.div
            className="hidden lg:block lg:w-1/4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  Specialization
                </label>
                <DropdownFilter
                  label=""
                  options={specializationOptions}
                  selected={specialization}
                  onChange={setSpecialization}
                />
              </div>
              <div>
                <label className="block mb-3 text-sm font-semibold text-gray-700">
                  Sort By
                </label>
                <DropdownFilter
                  label=""
                  options={sortOptions}
                  selected={sortBy}
                  onChange={setSortBy}
                />
              </div>
            </div>
          </motion.div>

          {/* Mobile Filters Dropdown */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                className="lg:hidden mb-6 bg-white rounded-lg p-6 shadow-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Specialization
                    </label>
                    <DropdownFilter
                      label=""
                      options={specializationOptions}
                      selected={specialization}
                      onChange={setSpecialization}
                      
                    />
                  </div>
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-700">
                      Sort By
                    </label>
                    <DropdownFilter
                      label=""
                      options={sortOptions}
                      selected={sortBy}
                      onChange={setSortBy}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Doctor Cards */}
          <div className="flex-1 my-10">
            {doctors.length > 0 ? (
              <>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 "
                  style={{ marginTop: "-4rem" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {doctors.map((doc, index) => (
                    <motion.div
                      key={doc._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 * index }}
                    >
                      <DoctorCard doctor={doc} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    className="flex justify-center mt-12 gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={page === 1}
                    >
                      Previous
                    </button>

                    <div className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                      Page {page} of {totalPages}
                    </div>

                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
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
                <p className="text-lg font-medium text-gray-500">
                  No doctors found for the selected criteria.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
