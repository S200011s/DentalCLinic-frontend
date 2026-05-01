import React, { useEffect, useState } from "react";
import ServiceSelect from "../../../components/Appointment/ServiceSelect";
import DoctorSelect from "../../../components/Appointment/DoctorSelect";
import DoctorCard from "../../../components/Appointment/DoctorCard";
import SlotPicker from "../../../components/Appointment/SlotPicker";
import PatientForm from "../../../components/Appointment/PatientForm";
import ButtonSubmit from "../../../components/Buttons/ButtonSubmit";
import axios, { getAxiosWithToken } from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuccessBookingModal from "../../../components/Modals/successBooking";

const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const routeDoctor = location.state?.doctor;
  const routeService = location.state?.service;

  const [selectedService, setSelectedService] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState(0);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [targetUserAppointments, setTargetUserAppointments] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const [patientData, setPatientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
  });

  const fetchAvailableSlots = async (serviceId, doctorId, date) => {
    try {
      const axiosAuth = getAxiosWithToken();
      const res = await axiosAuth.get(`/appointment/slots`, {
        params: { serviceId, doctorId, date },
      });
      console.log("⏳ Refetched available slots", res.data);
    } catch (err) {
      console.error("❌ Couldn't refresh available slots.", err);
    }
  };

  // Initialize with route data if available, otherwise fetch services
  useEffect(() => {
    const initializeData = async () => {
      try {
        // If we have route service, use it directly
        if (routeService) {
          setSelectedService(routeService._id);
          setAmount(routeService.price || 0);
        } else {
          // Otherwise fetch services and set first one as default
          const res = await axios.get("/services");
          const allServices = res.data?.services || [];
          if (allServices.length > 0) {
            const defaultService = allServices[0];
            setSelectedService(defaultService._id);
            setAmount(defaultService.price || 0);
          }
        }

        // If we have route doctor, set it and fetch details
        if (routeDoctor) {
          setSelectedDoctor(routeDoctor._id);
          setDoctorDetails(routeDoctor);
        }
      } catch (err) {
        console.error("❌ Failed to fetch services", err);
      }
    };

    initializeData();
    window.scrollTo(0, 0);
  }, [routeService, routeDoctor]);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!selectedService) return;
      
      // If we already have the price from route service, use it
      if (routeService && routeService._id === selectedService) {
        setAmount(routeService.price || 0);
        return;
      }
      
      try {
        const res = await axios.get(`/services/${selectedService}`);
        setAmount(res.data?.price || 0);
      } catch (err) {
        setAmount(0);
        console.error("❌ Failed to get price", err);
      }
    };
    fetchPrice();
  }, [selectedService, routeService]);

  useEffect(() => {
    if (!selectedDoctor) return setDoctorDetails(null);
    
    // If we already have doctor details from route, use them
    if (routeDoctor && routeDoctor._id === selectedDoctor) {
      setDoctorDetails(routeDoctor);
      return;
    }
    
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`/doctor/${selectedDoctor}`);
        setDoctorDetails(res.data?.doctor || res.data);
      } catch (err) {
        console.error("❌ Failed to fetch doctor", err);
      }
    };
    fetchDoctor();
  }, [selectedDoctor, routeDoctor]);

  useEffect(() => {
    if (currentUser?.role === "client") {
      setPatientData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        age: currentUser.age,
      });
    }
  }, []);

  useEffect(() => {
    const fetchExistingAppointments = async () => {
      try {
        const axiosAuth = getAxiosWithToken();
        const res = await axiosAuth.get("/appointment/my");
        setExistingAppointments(res.data?.appointments || []);
      } catch (err) {
        console.error("❌ Failed to fetch existing appointments", err);
      }
    };
    if (currentUser?.role === "client") {
      fetchExistingAppointments();
    }
  }, [selectedSlot]);

useEffect(() => {
  const fetchTargetUserAppointments = async () => {
    try {
      if (currentUser?.role === "admin" && patientData?._id) {
        const axiosAuth = getAxiosWithToken();
        const res = await axiosAuth.get(`/appointment/user/${patientData?._id}`);
        setTargetUserAppointments(res.data?.appointments || []);
      }
    } catch (err) {
      console.error("❌ Failed to fetch target user's appointments", err);
    }
  };

  fetchTargetUserAppointments();
}, [patientData._id, selectedSlot]);



  const handleBook = async () => {
    if (!selectedService || !selectedDoctor || !selectedSlot || !paymentMethod) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (currentUser?.role !== "client" && !patientData.firstName) {
      toast.error("Please provide patient details.");
      return;
    }

    const selectedDateOnly = selectedSlot.startTime.split("T")[0];

    if (currentUser?.role === "client") {
    const alreadyBookedToday = existingAppointments.some((appt) => appt.date === selectedDateOnly);
    if (alreadyBookedToday) {
      toast.error("⛔ You already have an appointment on this day.");
      return;
    }
  }

    if (currentUser?.role === "admin") {
    const alreadyBookedForUser = targetUserAppointments.some(
      (appt) => appt.date === selectedDateOnly
    );
    if (alreadyBookedForUser) {
      toast.error("⛔ This user already has an appointment on this day.");
      return;
    }
  }

    if (selectedSlot.status?.toLowerCase() !== "available") {
      toast.error("This time slot is no longer available.");
      return;
    }

    const bookingData = {
      doctor: selectedDoctor,
      service: selectedService,
      date: selectedDateOnly,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      amount,
      patientInfo: currentUser?.role === "client" ? undefined : patientData,
      paymentMethod,
    };
    
    if (paymentMethod === "online") {
      return navigate("/payment", { state: { bookingData } });
    }

    try {
      const axiosAuth = getAxiosWithToken();
      await axiosAuth.post("/appointment", bookingData);

      toast.success("✅ Your appointment has been booked successfully.");
      setShowModal(true); 
     } catch (err) {
        const errorMsg = err.response?.data?.message || "Something went wrong while booking.";
        const statusCode = err.response?.status;

        if (statusCode === 409) {
          if (errorMsg.toLowerCase().includes("booked with this doctor")) {
            toast.error("⛔ You've already booked with this doctor on this day.");
          } else if (errorMsg.toLowerCase().includes("slot") || errorMsg.toLowerCase().includes("already booked")) {
            toast.error("⚠️ This time slot is no longer available. Please choose another one.");
          } else {
            toast.error("⚠️ " + errorMsg);
          }

          if (selectedService && selectedDoctor && selectedSlot) {
            const selectedDateOnly = selectedSlot.startTime.split("T")[0];
            fetchAvailableSlots(selectedService, selectedDoctor, selectedDateOnly);
          }

          setSelectedSlot(null);
        } else if ([400, 404].includes(statusCode)) {
          toast.error("❌ " + errorMsg);
        } else {
          toast.error("❌ Something went wrong. Please try again.");
        }

        console.error("❌ Booking error:", err.response?.data || err.message);
      }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-cyan-100 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
      
      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 tracking-tight">
              Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Appointment</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Schedule your visit with our expert medical professionals. We're here to provide you with the best care possible.
            </p>
          </div>

          {/* Booking Form Container */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 backdrop-blur-sm border border-gray-100 animate-slide-up">
            
            {/* Doctor Card */}
            {doctorDetails && (
              <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <DoctorCard doctor={doctorDetails} selectedServiceId={selectedService} />
              </div>
            )}

            {/* Form Steps */}
            <div className="space-y-8">
              {/* Step 1: Service Selection */}
              <div className="group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">1</div>
                  <h3 className="text-xl font-semibold text-gray-800">Select Service</h3>
                </div>
                <div className="pl-11 transform transition-all duration-300 group-hover:scale-[1.02]">
                  <ServiceSelect selectedService={selectedService} setSelectedService={setSelectedService} />
                </div>
              </div>

              {/* Step 2: Doctor Selection */}
              <div className="group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">2</div>
                  <h3 className="text-xl font-semibold text-gray-800">Choose Doctor</h3>
                </div>
                <div className="pl-11 transform transition-all duration-300 group-hover:scale-[1.02]">
                  <DoctorSelect selectedService={selectedService} selectedDoctor={selectedDoctor} setSelectedDoctor={setSelectedDoctor} />
                </div>
              </div>

              {/* Step 3: Slot Selection */}
              {selectedDoctor && selectedService && (
                <div className="group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">3</div>
                    <h3 className="text-xl font-semibold text-gray-800">Select Time Slot</h3>
                  </div>
                  <div className="pl-11 transform transition-all duration-300 group-hover:scale-[1.02]">
                    <SlotPicker doctorId={selectedDoctor} serviceId={selectedService} onSlotSelect={setSelectedSlot} />
                  </div>
                </div>
              )}

              {/* Step 4: Payment Method */}
              <div className="group animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">4</div>
                  <h3 className="text-xl font-semibold text-gray-800">Payment Method</h3>
                </div>
                <div className="pl-11">
                  <div className="relative">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 appearance-none bg-white shadow-sm hover:shadow-md"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="cash">💰 Cash Payment</option>
                      <option value="online">💳 Online Payment</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5: Patient Information */}
              {currentUser?.role !== "client" && (
                <div className="group animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">5</div>
                    <h3 className="text-xl font-semibold text-gray-800">Patient Information</h3>
                  </div>
                  <div className="pl-11 transform transition-all duration-300 group-hover:scale-[1.02]">
                    <PatientForm patientData={patientData} setPatientData={setPatientData} />
                  </div>
                </div>
              )}

              {/* Price Display */}
              {amount > 0 && (
                <div className="animate-fade-in-up bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-l-4 border-blue-500" style={{ animationDelay: '0.7s' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-700">Service Price:</span>
                    <span className="text-2xl font-bold text-blue-600">{amount} EGP</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <div className="transform transition-all duration-300 hover:scale-105">
                  <ButtonSubmit name="Book Appointment" onClick={handleBook} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Success Modal */}
      <SuccessBookingModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onGo={() => {
          setShowModal(false);
          navigate(currentUser?.role === "admin" ? "/layout/appointments" : "/my-appointments");
        }}
      />

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out backwards;
        }

        .animate-bounce {
          animation: bounce 3s infinite;
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default BookAppointment;