// src/api/review.service.js
import axios from "./axiosInstance";

// ===================== ADMIN DASHBOARD APIs =====================

// Doctor Reviews
export const getAllDoctorReviews = async () => {
  const { data } = await axios.get("/dashboard/reviews/doctors");
  return data;
};

export const getPendingDoctorReviews = async () => {
  const { data } = await axios.get("/dashboard/reviews/doctors/pending");
  return data;
};

export const approveDoctorReview = async (id) => {
  const { data } = await axios.patch(`/dashboard/reviews/doctors/${id}/approve`);
  return data;
};

export const rejectDoctorReview = async (id, reason) => {
  const { data } = await axios.patch(`/dashboard/reviews/doctors/${id}/reject`, { reason });
  return data;
};

export const getDoctorReviewsWithPendingEdits = async () => {
  const { data } = await axios.get("/dashboard/reviews/doctors/pending-edits");
  return data;
};

export const approveDoctorReviewEdit = async (id) => {
  const { data } = await axios.put(`/dashboard/reviews/doctors/${id}/edit-decision`, { decision: "approved" });
  return data;
};

export const rejectDoctorReviewEdit = async (id) => {
  const { data } = await axios.put(`/dashboard/reviews/doctors/${id}/edit-decision`, { decision: "rejected" });
  return data;
};

export const deleteRejectedDoctorReview = async (id) => {
  const { data } = await axios.delete(`/dashboard/reviews/doctors/rejected/${id}`);
  return data;
};

// Clinic Reviews
export const getAllClinicReviews = async () => {
  const { data } = await axios.get("/dashboard/reviews/clinic");
  return data;
};

export const getPendingClinicReviews = async () => {
  const { data } = await axios.get("/dashboard/reviews/clinic/pending");
  return data;
};

export const approveClinicReview = async (id) => {
  const { data } = await axios.patch(`/dashboard/reviews/clinic/${id}/approve`);
  return data;
};

export const rejectClinicReview = async (id, reason) => {
  const { data } = await axios.patch(`/dashboard/reviews/clinic/${id}/reject`, { reason });
  return data;
};

export const getClinicReviewsWithPendingEdits = async () => {
  const { data } = await axios.get("/dashboard/reviews/clinic/pending-edits");
  return data;
};

export const approveClinicReviewEdit = async (id) => {
  const { data } = await axios.put(`/dashboard/reviews/clinic/${id}/edit-decision`, { decision: "approved" });
  return data;
};

export const rejectClinicReviewEdit = async (id) => {
  const { data } = await axios.put(`/dashboard/reviews/clinic/${id}/edit-decision`, { decision: "rejected" });
  return data;
};

export const deleteRejectedClinicReview = async (id) => {
  const { data } = await axios.delete(`/dashboard/reviews/clinic/rejected/${id}`);
  return data;
};

// Stats
export const getReviewStats = async () => {
  const { data } = await axios.get("/dashboard/reviews/stats");
  return data;
};


// ===================== PUBLIC APIs (للمستخدمين) =====================

export const getDoctorReviews = async (doctorId) => {
  const { data } = await axios.get(`/reviews/doctor/${doctorId}`);
  return data;
};

export const getClinicReviews = async () => {
  const { data } = await axios.get("/reviews/clinic");
  return data;
};

export const editClinicReview = async (reviewId, rating, comment) => {
  const { data } = await axios.put(`/reviews/clinic/${reviewId}`, { rating, comment });
  return data;
};


export const createDoctorReview = async (doctorId, appointmentId, rating, comment) => {
  const { data } = await axios.post("/reviews/doctor", { doctorId, appointmentId, rating, comment });
  return data;
};

export const createClinicReview = async (rating, comment) => {
  const { data } = await axios.post("/reviews/clinic", { rating, comment });
  return data;
};

export const editDoctorReview = async (reviewId, rating, comment) => {
  const { data } = await axios.put(`/reviews/doctor/${reviewId}`, { rating, comment });
  return data;
};

export const deleteDoctorReview = async (reviewId) => {
  const { data } = await axios.delete(`/reviews/doctor/${reviewId}`);
  return data;
};

export const getReviewStatusForAppointment = async (appointmentId) => {
  const { data } = await axios.get(`/reviews/appointment/${appointmentId}/status`);
  return data;
};
