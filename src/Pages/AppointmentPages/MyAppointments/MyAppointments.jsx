import React, { useEffect, useState } from "react";
import axios, { getAxiosWithToken } from "../../../api/axiosInstance";
import AppointmentCard from "../../../components/MyAppointment/AppointmentCard";
import CancelModal from "../../../components/Modals/CancelModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getReviewStatusForAppointment } from "../../../api/review.service";
import ReviewModal from "../../../components/Modals/ReviewModal";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStatuses, setReviewStatuses] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchAppointments = async () => {
  setLoading(true);
  try {
    const axiosAuth = getAxiosWithToken();
    const res = await axiosAuth.get(`/appointment/user/${user.id}`, {
      params: statusFilter ? { status: statusFilter } : {},
    });

    setAppointments(res.data.appointments || []);
    
    const appointmentsData = res.data.appointments || [];
    for (const apt of appointmentsData) {
      if (apt.status === "completed") {
        try {
          const status = await getReviewStatusForAppointment(apt._id);
          setReviewStatuses(prev => ({ ...prev, [apt._id]: status }));
        } catch (error) {
          console.error("Error fetching review status:", error);
        }
      }
    }
  } catch (err) {
    toast.error("❌ Failed to load appointments");
    console.error(err);
    setAppointments([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    } else {
      toast.error("User not found. Please log in again.");
    }
  }, [statusFilter]);

  const handleCancelClick = (appointment) => {
    setSelectedAppt(appointment);
    setModalOpen(true);
  };

 const handleCancelSubmit = async (reason) => {
  const axiosAuth = getAxiosWithToken();
  try {
    await axiosAuth.patch(`/appointment/cancel/${selectedAppt._id}`, {
      cancellationMessage: reason,
    });

    toast.success("✅ Appointment cancelled successfully!");
    setModalOpen(false);
    setSelectedAppt(null);
    fetchAppointments();
  } catch (err) {
    console.error("❌ Cancel error:", err?.response?.data || err.message);
    toast.error("❌ Failed to cancel appointment");
  }
};


  const handlePayNow = (appointment) => {
      console.log("Appointment object: ", appointment);
  console.log("Appointment ID: ", appointment._id);
    navigate(`/appointment/${appointment._id}`, { state: { appointment } });
  };

  const handleSubmitReview = async (rating, comment) => {
  try {
    if (selectedAppointment?.doctor?._id) {
      await axios.post("/reviews/doctor", {
        doctorId: selectedAppointment.doctor._id,
        appointmentId: selectedAppointment._id,
        rating,
        comment,
      });
      toast.success("Thank you for your feedback!");
    }
    
    setShowReviewModal(false);
    setSelectedAppointment(null);
    await fetchAppointments(); // تحديث الحالة
  } catch (error) {
    console.error("Error submitting review:", error);
    toast.error(error.response?.data?.message || "Failed to submit review");
  }
};


const getReviewButton = (appointment) => {
  if (appointment.status !== 'completed') return null;
  const status = reviewStatuses[appointment._id];
  if (!status || !status.exists) {
    return (
      <button
        onClick={() => { setSelectedAppointment(appointment); setShowReviewModal(true); }}
        className='mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'>
        ⭐ Write a Review
      </button>
    );
  }
  if (status.status === 'pending')
    return <span className='mt-2 text-xs text-yellow-600 font-medium'>Review under review</span>;
  if (status.status === 'approved')
    return <span className='mt-2 text-xs text-green-600 font-medium'>✓ Reviewed</span>;
  if (status.status === 'rejected')
    return (
      <div className='mt-2 flex flex-col gap-1'>
        <span className='text-xs text-red-600'>Review rejected</span>
        <button
          onClick={() => { setSelectedAppointment(appointment); setShowReviewModal(true); }}
          className='text-xs text-orange-600 underline'>
          Try Again
        </button>
      </div>
    );
  return null;
};


  return (
    <div className="pt-28 pb-10 min-h-screen max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">My Appointments</h2>

      <div className="mb-4 flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded-md text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appt) => (
  <AppointmentCard
    key={appt._id}
    appointment={appt}
    onCancel={handleCancelClick}
    onPay={handlePayNow}
    reviewButton={
      <div className="mt-2">
        {getReviewButton(appt)}
      </div>
    }
  />
))
        ) : (
          <p className="text-center text-gray-600">No appointments found.</p>
        )}
      </div>

      <CancelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCancelSubmit}
      />
      <ReviewModal
  isOpen={showReviewModal}
  onClose={() => { setShowReviewModal(false); 
    setSelectedAppointment(null); }}
  onSubmit={handleSubmitReview}
  appointment={selectedAppointment}
/>

    </div>
  );
};

export default MyAppointments;
