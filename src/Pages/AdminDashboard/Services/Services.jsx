import PopupsAddServices from "../../../components/Popups/PopupsAddServices";
import AdminTables from "../AdminTables";
import { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";

const columns = [
  { label: "Image", key: "image", minWidth: 150 },
  { label: "ID", key: "_id", minWidth: 200 },
  { label: "Service Name", key: "name", minWidth: 150 },
  { label: "Category", key: "category", minWidth: 150 },
  { label: "Price", key: "price", minWidth: 100 },
  { label: "Description", key: "description", minWidth: 500 },
  { label: "Actions", key: "actions", minWidth: 150, align: "right" },
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const getAllServices = async () => {
    try {
      const { data } = await axios.get("/services?limit=100");
      const formatted = data.services.map((s) => ({
        _id: s._id,
        name: s.name,
        image: s.image,
        price: s.price,
        description: s.description,
        category: s.category,
      }));
      setServices(formatted);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };
  let DeleteById = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices((prev) => prev.filter((doctor) => doctor._id !== id));
      toast.success("service deleted successfully");
    } catch {
      toast.error("Failed to delete service");
    }
  };
  const handleEdit = (service) => {
    setSelectedService(service);
    setIsEdit(true);
    setOpen(true);
  };

  useEffect(() => {
    getAllServices();
  }, []);

  return (
    <main className="h-full overflow-y-auto bg-white">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container px-6 mx-auto grid">
        <h2
          className="my-6 text-2xl font-semibold"
          style={{ color: "#10244b" }}
        >
          Services
        </h2>
        <div className="mb-6 flex justify-end" style={{ width: "100%" }}>
          <PopupsAddServices
            open={open}
            setOpen={setOpen}
            isEdit={isEdit}
            serviceData={selectedService}
            onClose={() => {
              setOpen(false);
              setIsEdit(false);
              setSelectedService(null);
            }}
            onSuccess={() => {
              getAllServices();
              setOpen(false);
              setIsEdit(false);
              setSelectedService(null);
            }}
          />{" "}
        </div>
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <AdminTables
            columns={columns}
            rows={services}
            DeleteById={DeleteById}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </main>
  );
};

export default Services;
