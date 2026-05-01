import React, { useEffect, useState } from "react";
import axios, { getAxiosWithToken } from "../../../api/axiosInstance";
import AppointmentCard from "../../../components/MyAppointment/AppointmentCard";
import CancelModal from "../../../components/Modals/CancelModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchAppointments = async () => {
    try {
      const axiosAuth = getAxiosWithToken();
      const res = await axiosAuth.get(`/appointment/user/${user.id}`, {
        params: statusFilter ? { status: statusFilter } : {},
      });

      setAppointments(res.data.appointments || []);
    } catch (err) {
      toast.error("❌ Failed to load appointments");
      console.error(err);
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
    </div>
  );
};

export default MyAppointments;
