import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaSpinner, FaSync } from "react-icons/fa";
import ReviewCard from "../../../components/ReviewCard/ReviewCard";
import {
  getAllDoctorReviews,
  getPendingDoctorReviews,
  approveDoctorReview,
  rejectDoctorReview,
  getDoctorReviewsWithPendingEdits,
  approveDoctorReviewEdit,
  rejectDoctorReviewEdit,
  deleteRejectedDoctorReview,
  getReviewStats,
} from "../../../api/review.service";

const DoctorsReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [stats, setStats] = useState(null);

  // ================= FETCH STATS =================
  const fetchStats = async () => {
    try {
      const statsData = await getReviewStats();
      setStats(statsData.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // ================= FETCH REVIEWS =================
  const fetchReviews = async () => {
    setLoading(true);

    try {
      let data;

      if (activeTab === "pending") {
        data = await getPendingDoctorReviews();
        setReviews(data.pendingReviews || []);
      } else if (activeTab === "edits") {
        data = await getDoctorReviewsWithPendingEdits();
        setReviews(data.pendingEdits || []);
      } else {
        data = await getAllDoctorReviews();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD STATS ONCE =================
  useEffect(() => {
    fetchStats();
  }, []);

  // ================= LOAD REVIEWS WHEN TAB CHANGES =================
  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  // ================= APPROVE REVIEW =================
  const handleApprove = async (id) => {
    try {
      await approveDoctorReview(id);

      toast.success("Review approved successfully!");

      await fetchReviews();
      await fetchStats();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to approve review"
      );
    }
  };

  // ================= REJECT REVIEW =================
  const handleReject = async (id, reason) => {
    try {
      await rejectDoctorReview(id, reason);

      toast.info("Review rejected");

      await fetchReviews();
      await fetchStats();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reject review"
      );
    }
  };

  // ================= APPROVE EDIT =================
  const handleApproveEdit = async (id) => {
    try {
      await approveDoctorReviewEdit(id);

      toast.success("Edit approved and review updated!");

      await fetchReviews();
      await fetchStats();
    } catch (error) {
      toast.error("Failed to approve edit");
    }
  };

  // ================= REJECT EDIT =================
  const handleRejectEdit = async (id) => {
    try {
      await rejectDoctorReviewEdit(id);

      toast.info("Edit request rejected");

      await fetchReviews();
      await fetchStats();
    } catch (error) {
      toast.error("Failed to reject edit");
    }
  };

  // ================= DELETE REVIEW =================
  const handleDelete = async (id) => {
    try {
      await deleteRejectedDoctorReview(id);

      toast.success("Review deleted");

      await fetchReviews();
      await fetchStats();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };


  const counts = useMemo(() => {
  if (!stats) return { pending: 0, all: 0, edits: 0 };

  const pending =
    stats.doctors?.find((s) => s._id === "pending")?.count || 0;

  const all =
    stats.doctors?.reduce((sum, s) => sum + s.count, 0) || 0;

  const edits =
    stats.pendingEdits?.doctors || 0;

  return { pending, all, edits };
}, [stats]);

const handleRefresh = async () => {
  try{
  setLoading(true);
  await Promise.all([fetchStats(), fetchReviews()]);
  }finally{setLoading(false)};
};

  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold" style={{ color: "#10244b" }}>
          Doctors Reviews Management
        </h2>
        <button onClick={handleRefresh} className="flex items-center gap-2 px-3 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50">
          <FaSync className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Pending Reviews</p>
          <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Pending Edits</p>
          <p className="text-2xl font-bold text-blue-600">{counts.edits}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-2xl font-bold text-green-600">{counts.all}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-purple-600">
            {stats?.doctors?.find(s => s._id === "approved")?.count || 0}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button onClick={() => setActiveTab("pending")} className={`px-4 py-2 font-medium transition-colors ${activeTab === "pending" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}>
          Pending ({counts.pending})
        </button>
        <button onClick={() => setActiveTab("edits")} className={`px-4 py-2 font-medium transition-colors ${activeTab === "edits" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}>
          Edit Requests ({counts.edits})
        </button>
        <button onClick={() => setActiveTab("all")} className={`px-4 py-2 font-medium transition-colors ${activeTab === "all" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}>
          All Reviews ({counts.all})
        </button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center items-center py-20"><FaSpinner className="animate-spin text-4xl text-blue-500" /></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg"><p className="text-gray-500">No {activeTab} reviews found</p></div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} type="doctor" onApprove={handleApprove} onReject={handleReject} onApproveEdit={handleApproveEdit} onRejectEdit={handleRejectEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsReviews;