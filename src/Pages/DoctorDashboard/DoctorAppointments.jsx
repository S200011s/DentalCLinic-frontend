import React, { useEffect, useState } from "react";
import axios, { getAxiosWithToken } from "../../api/axiosInstance";
import { toast } from "react-toastify";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const axiosAuth = getAxiosWithToken();
      const res = await axiosAuth.get("/appointment/doctor-appointments");
      setAppointments(res.data.appointments || []);
    } catch (err) {
      toast.error("Failed to load appointments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      const axiosAuth = getAxiosWithToken();
      await axiosAuth.patch(`/appointment/complete/${id}`);
      toast.success("Appointment marked as completed");
      fetchAppointments();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update appointment";
      toast.error(`❌ ${errorMsg}`);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="pt-28 pb-10 min-h-screen max-w-6xl mx-auto px-4">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Doctor Dashboard</h2>
          <p className="text-blue-100 mt-1">Manage your upcoming patient appointments</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="py-4 px-4 font-semibold text-gray-600">Patient</th>
                    <th className="py-4 px-4 font-semibold text-gray-600">Date</th>
                    <th className="py-4 px-4 font-semibold text-gray-600">Time</th>
                    <th className="py-4 px-4 font-semibold text-gray-600">Service</th>
                    <th className="py-4 px-4 font-semibold text-gray-600">Status</th>
                    <th className="py-4 px-4 font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">
                          {appt.user?.firstName} {appt.user?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{appt.user?.email}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">
                        {new Date(appt.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-4 px-4 text-gray-700 font-mono text-sm">
                        {new Date(appt.startTime).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                          {appt.service?.name}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appt.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : appt.status === "rescheduled"
                              ? "bg-purple-100 text-purple-700"
                              : appt.status === "completed"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {appt.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {(appt.status === "confirmed" || appt.status === "rescheduled") && (
                          <button
                            onClick={() => handleMarkCompleted(appt._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                          >
                            Mark Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <i className="bx bx-calendar-x text-6xl text-gray-300"></i>
              <p className="text-gray-500 mt-4 text-lg">No appointments scheduled yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
