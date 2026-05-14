import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { MdDelete, MdCheckCircle, MdCancel, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 text-sm" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-gray-300 text-sm" />
      ))}
    </div>
  );
};

const ReviewCard = ({ review, type, onApprove, onReject, onApproveEdit, onRejectEdit, onDelete }) => {
  const handleApprove = () => {
    Swal.fire({
      title: "Approve Review?",
      text: `Are you sure you want to approve this ${type} review?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Yes, approve",
    }).then((result) => {
      if (result.isConfirmed) onApprove(review._id);
    });
  };

  const handleReject = () => {
    Swal.fire({
      title: "Reject Review",
      input: "textarea",
      inputPlaceholder: "Please provide a reason for rejection...",
      inputAttributes: { required: true },
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Reject",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        onReject(review._id, result.value);
      } else if (result.isConfirmed && !result.value) {
        Swal.fire("Error", "Please provide a reason", "error");
      }
    });
  };

  const handleApproveEdit = () => {
    Swal.fire({
      title: "Approve Edit?",
      text: "Are you sure you want to approve this edit request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Yes, approve",
    }).then((result) => {
      if (result.isConfirmed) onApproveEdit(review._id);
    });
  };

  const handleRejectEdit = () => {
    Swal.fire({
      title: "Reject Edit?",
      text: "Are you sure you want to reject this edit request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, reject",
    }).then((result) => {
      if (result.isConfirmed) onRejectEdit(review._id);
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Delete Review?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) onDelete(review._id);
    });
  };

  const getStatusBadge = () => {
    if (review.status === "approved") return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Approved</span>;
    if (review.status === "pending") return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
    if (review.status === "rejected") return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Rejected</span>;
    return null;
  };

  const getEditStatusBadge = () => {
    if (review.editStatus === "pending" && review.pendingEdit) {
      return (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <MdEdit className="text-blue-500" />
            <span className="text-xs font-medium text-blue-700">Edit Request Pending</span>
          </div>
          <div className="text-xs text-gray-600">
            <p><strong>Original:</strong> {review.comment}</p>
            <p><strong>Suggested:</strong> {review.pendingEdit.comment}</p>
            <p><strong>Rating:</strong> {review.rating} → {review.pendingEdit.rating}</p>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={handleApproveEdit} className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">Approve Edit</button>
            <button onClick={handleRejectEdit} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">Reject Edit</button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border rounded-lg p-4 mb-3 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <img src={review.user?.image || "https://via.placeholder.com/40"} alt={review.user?.firstName} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h4 className="font-semibold text-gray-800">{review.user?.firstName} {review.user?.lastName}</h4>
              <p className="text-xs text-gray-500">{review.user?.email}</p>
            </div>
            {getStatusBadge()}
          </div>

          {review.doctor && (
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              <span className="font-medium">Doctor:</span>
              <span>Dr. {review.doctor.firstName} {review.doctor.lastName}</span>
              <span className="text-xs text-gray-400">({review.doctor.specialization?.join(", ")})</span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={review.rating} />
            <span className="text-sm text-gray-600">({review.rating}/5)</span>
          </div>
          
          <p className="text-gray-700 mb-2">{review.comment}</p>
          
          {review.rejectionReason && review.status === "rejected" && (
            <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-red-600"><strong>Rejection Reason:</strong> {review.rejectionReason}</p>
            </div>
          )}

          {getEditStatusBadge()}

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span>Created: {new Date(review.createdAt).toLocaleDateString()}</span>
            {review.approvedAt && <span>Approved: {new Date(review.approvedAt).toLocaleDateString()}</span>}
          </div>
        </div>

        <div className="flex gap-2">
          {review.status === "pending" && !review.pendingEdit && (
            <>
              <button onClick={handleApprove} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                <MdCheckCircle className="text-xl" />
              </button>
              <button onClick={handleReject} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Reject">
                <MdCancel className="text-xl" />
              </button>
            </>
          )}
          {review.status === "rejected" && (
            <button onClick={handleDelete} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Delete">
              <MdDelete className="text-xl" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;