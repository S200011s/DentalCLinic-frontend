import { useEffect, useState } from "react";
import PopupsAddDoctors from "../../../components/Popups/PopupsAddDoctors";
import AdminTables from "../AdminTables";
import axios from "../../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";

const columns = [
  { label: "ProfileImage", key: "profileImage", minWidth: 150 },
  { label: "ID", key: "_id", minWidth: 200 },
  { label: "User Name", key: "userName", minWidth: 150 },
  { label: "Specialization", key: "specialization", minWidth: 150 },
  { label: "Experience (Years)", key: "experience", minWidth: 200 },
  { label: "Bio", key: "bio", minWidth: 400 },
  { label: "Certifications", key: "certifications", minWidth: 250 },
  { label: "Services", key: "services", minWidth: 200 },
  { label: "AverageRating", key: "averageRating", minWidth: 50 },
  { label: "WorkImages", key: "workImages", minWidth: 200 },
  { label: "Actions", key: "actions", minWidth: 150, align: "right" },
];

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const getallDoctors = async () => {
    try {
      const { data } = await axios.get("/doctor?limit=1000");
      const mapped = data.doctors.map((doc) => ({
        _id: doc._id,
        userName: doc.fullName || "N/A",
        specialization: doc.specialization?.join(" | ") || "N/A",
        averageRating: doc.averageRating,
        profileImage: doc.profileImage,
        experience: doc.experience || "N/A",
        bio: doc.bio || "N/A",
        certifications: doc.certifications?.join(" | ") || "N/A",
        services: doc.services?.map((s) => s.name).join(" | ") || "N/A",
        workImages: doc.workImages?.join(" | ") || "N/A",
      }));
      setDoctors(mapped);
    } catch (err) {
      console.error("Error fetching doctors", err);
    }
  };
  let DeleteById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/doctor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors((prev) => prev.filter((doctor) => doctor._id !== id));
      toast.success("doctor deleted successfully");
    } catch {
      toast.error("Failed to delete doctor");
    }
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEdit(true);
    setOpen(true);
  };

  useEffect(() => {
    getallDoctors();
  }, []);
  return (
    <>
      <main className="h-full overflow-y-auto bg-white">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="container px-6 mx-auto grid">
          <h2
            className="my-6 text-2xl font-semibold"
            style={{ color: "#10244b" }}
          >
            Doctors
          </h2>
          <div className="mb-6 flex justify-end " style={{ width: "100%" }}>
            <PopupsAddDoctors
              open={open}
              setOpen={setOpen}
              isEdit={isEdit}
              doctorData={selectedDoctor}
              onClose={() => {
                setOpen(false);
                setIsEdit(false);
                setSelectedDoctor(null);
              }}
              onSuccess={() => {
                getallDoctors();
                setOpen(false);
                setIsEdit(false);
                setSelectedDoctor(null);
              }}
            />
          </div>
          <div className="w-full overflow-hidden rounded-lg shadow-xs">
            <AdminTables
              columns={columns}
              rows={doctors}
              DeleteById={DeleteById}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Doctors;
