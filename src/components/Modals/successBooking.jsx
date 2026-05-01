import React from "react";

const SuccessBookingModal = ({ onClose, onGo, visible }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center space-y-4">
        <h3 className="text-xl font-semibold text-green-600">Your Appointment has created successfully</h3>
        <p className="text-sm text-gray-700">Wait for confirmation, and you can pay online after confirmation</p>

        <div className="space-y-2 pt-2">
          <button
            onClick={onGo}
            className="w-full bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700 transition"
          >
            Go for Your Appointments
          </button>
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-600 rounded-xl py-2 hover:bg-gray-100"
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessBookingModal;
